#!/usr/bin/env node

import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import { promisify } from "util";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { globSync } from "glob";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to search
const rootDir = path.resolve(__dirname, "..");
const excludeDir = path.join(rootDir, "src", "lib", "contract-interactions");

// Function to check if the path should be excluded
const shouldExclude = (filePath) => {
  return (
    filePath.startsWith(excludeDir) ||
    filePath.includes("node_modules") ||
    filePath.includes(".git")
  );
};

// Function to process the imports and usages in a file using AST
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, "utf8");

    // Parse the file content into an AST
    const ast = parser.parse(content, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "decorators-legacy"],
    });

    let hasUseQueryImport = false;
    let needsUseChainedQueryImport = false;
    let modified = false;

    // Traverse the AST to find and modify import declarations and useQuery usages
    traverse.default(ast, {
      // Handle imports
      ImportDeclaration(path) {
        const source = path.node.source.value;

        // Only process imports from @tanstack/react-query
        if (source !== "@tanstack/react-query") {
          return;
        }

        // Check if useQuery is being imported
        const useQuerySpecifier = path.node.specifiers.find(
          (specifier) =>
            t.isImportSpecifier(specifier) &&
            specifier.imported &&
            specifier.imported.name === "useQuery",
        );

        if (!useQuerySpecifier) {
          return;
        }

        hasUseQueryImport = true;
        needsUseChainedQueryImport = true;
        modified = true;

        // Check if useQuery is imported with an alias
        const localName = useQuerySpecifier.local.name;

        // Remove the useQuery import specifier
        const remainingSpecifiers = path.node.specifiers.filter(
          (specifier) =>
            !(
              t.isImportSpecifier(specifier) &&
              specifier.imported &&
              specifier.imported.name === "useQuery"
            ),
        );

        if (remainingSpecifiers.length === 0) {
          // If no imports remain, remove the entire import declaration
          path.remove();
        } else {
          // Otherwise, update the import with remaining specifiers
          path.node.specifiers = remainingSpecifiers;
        }

        // If useQuery was imported with a custom local name, we need to store it
        // to replace its usages later
        if (localName !== "useQuery") {
          path.scope.rename(localName, "useChainedQuery");
        }
      },

      // Handle function calls/usages
      CallExpression(path) {
        // Only proceed if we confirmed there was a useQuery import
        if (!hasUseQueryImport) {
          return;
        }

        // Check if this is a call to useQuery
        if (
          t.isIdentifier(path.node.callee) &&
          path.node.callee.name === "useQuery"
        ) {
          // Replace useQuery with useChainedQuery
          path.node.callee.name = "useChainedQuery";
          modified = true;
        }
      },
    });

    // If no changes were needed, return false
    if (!modified && !hasUseQueryImport) {
      return false;
    }

    // Add the useChainedQuery import if needed
    if (needsUseChainedQueryImport) {
      const useChainedQueryImport = t.importDeclaration(
        [
          t.importSpecifier(
            t.identifier("useChainedQuery"),
            t.identifier("useChainedQuery"),
          ),
        ],
        t.stringLiteral("@/hooks/react-query/use-chained-query"),
      );

      // Find the best place to insert the new import
      // We'll add it to the program body, right after any existing imports
      let lastImportIndex = -1;
      for (let i = 0; i < ast.program.body.length; i++) {
        if (t.isImportDeclaration(ast.program.body[i])) {
          lastImportIndex = i;
        }
      }

      ast.program.body.splice(lastImportIndex + 1, 0, useChainedQueryImport);
    }

    // Generate the modified code
    const { code } = generate.default(ast, {}, content);

    // If the content was changed, write it back to the file
    if (code !== content) {
      await writeFile(filePath, code, "utf8");
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log(
    "Starting to replace useQuery imports and usages with AST processing...",
  );

  try {
    // Find all TypeScript and TSX files using glob
    const pattern = `${rootDir}/src/**/*.{ts,tsx}`;
    const excludePattern = `${excludeDir}/**/*.{ts,tsx}`;

    console.log(`Searching for files matching: ${pattern}`);
    console.log(`Excluding files matching: ${excludePattern}`);

    const files = globSync(pattern, {
      ignore: [
        excludePattern,
        "src/hooks/react-query/use-chained-query.ts",
      ],
    });

    console.log(`Found ${files.length} TypeScript files to process`);

    let modifiedFiles = 0;
    for (const file of files) {
      if (shouldExclude(file)) {
        continue;
      }

      const wasModified = await processFile(file);
      if (wasModified) {
        console.log(`Modified: ${path.relative(rootDir, file)}`);
        modifiedFiles++;
      }
    }

    console.log(`Completed! Modified ${modifiedFiles} files.`);
  } catch (error) {
    console.error("Error:", error);
    // ESM compatible way to exit
    process.exitCode = 1;
  }
}

main();

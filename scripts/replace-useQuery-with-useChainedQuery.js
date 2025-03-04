#!/usr/bin/env node

import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { globSync } from "glob";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

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

// Function to process the imports and usages in a file
async function processFile(filePath) {
  try {
    const content = await readFile(filePath, "utf8");
    const lines = content.split("\n");

    // Parse the file to identify locations but not to generate code
    const ast = parse(content, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "decorators-legacy"],
    });

    // Store modifications to make
    const modifications = [];
    let needsUseChainedQueryImport = false;
    let importPosition = 0;

    // Analyze the AST to find locations to change
    traverse.default(ast, {
      ImportDeclaration(path) {
        const node = path.node;
        if (node.source.value !== "@tanstack/react-query") {
          return;
        }

        // Track position of import declarations for later
        const importLine = node.loc.start.line;
        importPosition = Math.max(importPosition, importLine);

        // Check for useQuery in the import specifiers
        const useQuerySpecifierIndex = node.specifiers.findIndex(
          (spec) => spec.imported && spec.imported.name === "useQuery",
        );

        if (useQuerySpecifierIndex === -1) {
          return;
        }

        // We found a useQuery import
        needsUseChainedQueryImport = true;

        // Get the local name of useQuery for finding references
        const localName = node.specifiers[useQuerySpecifierIndex].local.name;

        // Store the start/end position to modify the import statement
        modifications.push({
          type: "replace-import",
          line: node.loc.start.line - 1, // 0-indexed
          column: node.loc.start.column,
          endLine: node.loc.end.line - 1,
          endColumn: node.loc.end.column,
          localName,
        });
      },

      // Find usage of useQuery function calls
      CallExpression(path) {
        const node = path.node;
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "useQuery"
        ) {
          // Store the position to replace useQuery with useChainedQuery
          modifications.push({
            type: "replace-usage",
            line: node.loc.start.line - 1, // 0-indexed
            column: node.callee.loc.start.column,
            endColumn: node.callee.loc.end.column,
          });
        }
      },
    });

    // If no changes needed, exit early
    if (modifications.length === 0 && !needsUseChainedQueryImport) {
      return false;
    }

    // Process the modifications - we process in reverse order to avoid position shifts
    modifications.sort((a, b) => b.line - a.line || b.column - a.column);

    // Track renamed imports to update usages
    const renamedImports = new Map();

    // Apply modifications
    for (const mod of modifications) {
      if (mod.type === "replace-import") {
        // Get the original import statement
        const importLine = lines[mod.line];

        // Check if it's the only import or part of a list
        if (importLine.includes("{ useQuery }")) {
          // It's the only import, replace the whole line
          lines[mod.line] =
            `import { useChainedQuery } from "@/hooks/react-query/use-chained-query";`;
        } else {
          // It's part of a list, need to modify just the useQuery part
          // Preserve exact spacing and indentation
          const beforeUseQuery = importLine.substring(
            0,
            importLine.indexOf("useQuery"),
          );
          const afterUseQuery = importLine.substring(
            importLine.indexOf("useQuery") + "useQuery".length,
          );

          // Check if we need to remove a comma
          if (afterUseQuery.trim().startsWith(",")) {
            // Remove useQuery and the comma after it
            lines[mod.line] =
              beforeUseQuery +
              afterUseQuery.substring(afterUseQuery.indexOf(",") + 1);
          } else if (beforeUseQuery.trim().endsWith(",")) {
            // Remove useQuery and the comma before it
            lines[mod.line] =
              beforeUseQuery.substring(0, beforeUseQuery.lastIndexOf(",")) +
              afterUseQuery;
          } else {
            // Just remove useQuery
            lines[mod.line] = beforeUseQuery + afterUseQuery;
          }

          // Clean up any empty import brackets
          if (
            lines[mod.line].includes("{ }") ||
            lines[mod.line].includes("{}")
          ) {
            // Remove the entire import line if it's now empty
            lines[mod.line] = "";
          }

          // Add the new import on the next line
          lines.splice(
            mod.line + 1,
            0,
            `import { useChainedQuery } from "@/hooks/react-query/use-chained-query";`,
          );
        }

        // Track the renamed import if it has a different local name
        if (mod.localName !== "useQuery") {
          renamedImports.set(mod.localName, "useChainedQuery");
        }
      } else if (mod.type === "replace-usage") {
        // Replace useQuery() with useChainedQuery()
        const line = lines[mod.line];
        lines[mod.line] =
          line.substring(0, mod.column) +
          "useChainedQuery" +
          line.substring(mod.endColumn);
      }
    }

    // If we need to add the import but didn't replace any
    if (
      needsUseChainedQueryImport &&
      !modifications.some((m) => m.type === "replace-import")
    ) {
      lines.splice(
        importPosition,
        0,
        `import { useChainedQuery } from "@/hooks/react-query/use-chained-query";`,
      );
    }

    // Write the changes back to the file
    await writeFile(filePath, lines.join("\n"), "utf8");
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log("Starting to replace useQuery imports and usages...");

  try {
    // Find all TypeScript and TSX files using glob
    const pattern = `${rootDir}/src/**/*.{ts,tsx}`;
    const excludePattern = `${excludeDir}/**/*.{ts,tsx}`;

    console.log(`Searching for files matching: ${pattern}`);
    console.log(`Excluding files matching: ${excludePattern}`);

    const files = globSync(pattern, {
      ignore: excludePattern,
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

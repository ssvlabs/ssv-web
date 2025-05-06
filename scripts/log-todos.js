import { execSync } from "child_process";

try {
  const todos = execSync('grep -RIn --exclude-dir=node_modules "TODO:" src', {
    encoding: "utf8",
  });
  if (todos) {
    // Format each TODO
    const formattedTodos = todos
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const match = line.match(/^([^:]+):(\d+):.*TODO:(.+)/);
        if (!match) return line;
        const [, path, lineNum, description] = match;
        return `\x1b[90m${path}:${lineNum}\x1b[0m\n\x1b[38;5;208mTODO: ${description?.trim()}\x1b[0m`;
      })
      .join('\n');

    console.log(formattedTodos);
    console.log(
      "\n\x1b[32m☝️  Found some TODOs we should tackle when we get a chance! ☝️\x1b[0m",
    );
  }
} catch (error) {
  if (error.status === 1 && !error.stdout) {
    // No TODOs found - silent exit
  } else {
    // Other error occurred
    console.error(error);
  }
}

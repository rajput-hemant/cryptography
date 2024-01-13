import colors from "picocolors";

/**
 * Capitalize the first letter of a string
 * @param str String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * Read a file from the filesystem
 * @param path Relative path to the file
 * @returns File contents
 */
export async function readFile(path: string) {
  if (!path.startsWith("./")) {
    throw new Error("Please provide a relative path");
  }

  if (!path || path === "./") {
    throw new Error("No file path provided");
  }

  return await Bun.file(path).text();
}

/**
 * Handle the cancel event
 */
export function onCancel() {
  console.log(colors.red("✖") + " Operation cancelled");
  process.exit(0);
}

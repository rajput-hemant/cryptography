import colors from "picocolors";
import fs from "fs/promises";

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

  if (process.versions.bun) {
    return await Bun.file(path).text();
  }

  return await fs.readFile(path, "utf-8");
}

/**
 * Check if a file exists
 * @param path Relative path to the file
 * @returns Whether the file exists or not
 */
export async function checkFileExists(path: string) {
  if (process.versions.bun) {
    return await Bun.file(path).exists();
  }

  try {
    const stats = await fs.stat(path);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Handle the cancel event
 */
export function onCancel() {
  console.log(colors.red("✖") + " Operation cancelled");
  process.exit(0);
}

/**
 * Find the greatest common divisor of two numbers
 * @param x
 * @param y
 * @returns Greatest common divisor
 */
export function gcd(x: number, y: number) {
  x = Math.abs(x);
  y = Math.abs(y);

  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }

  return x;
}

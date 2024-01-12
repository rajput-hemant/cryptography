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
 * Handle the cancel event
 */
export function onCancel() {
  console.log(colors.red("✖") + " Operation cancelled");
  process.exit(0);
}

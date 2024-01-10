import prompts from "prompts";
import colors from "picocolors";

import { capitalize } from "../lib/utils";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export async function ceasarCipher() {
  try {
    const { text, shift, action } = await prompts(
      [
        {
          type: "text",
          name: "text",
          message: "Enter your text",
          validate: (v) => (v ? true : "Please enter some text"),
        },
        {
          type: "number",
          name: "shift",
          message: "Enter the shift",
          min: 1,
          max: 26,
          validate: (v) => (v ? true : "Please enter a shift"),
        },
        {
          type: "select",
          name: "action",
          message: "Select an action",
          choices: [
            { title: "Encrypt", value: "encrypt" },
            { title: "Decrypt", value: "decrypt" },
          ],
        },
      ],
      {
        onCancel() {
          throw new Error(colors.red("✖") + " Operation cancelled");
        },
      },
    );

    const result = crypt(text, shift, action);

    console.log(
      `\n${colors.yellow(capitalize(action) + "ed text")}: ${colors.green(
        result,
      )}`,
    );

    return;
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }
}

function crypt(text: string, shift: number, action: "encrypt" | "decrypt") {
  return text
    .split("")
    .map((char) => {
      const charIndex = ALPHABET.indexOf(char);

      if (charIndex === -1) {
        return char;
      }

      const newIndex =
        (action === "encrypt" ? charIndex + shift : charIndex - shift) %
        ALPHABET.length;

      return ALPHABET.at(newIndex);
    })
    .join("");
}

import prompts from "prompts";
import colors from "picocolors";

import { capitalize, onCancel } from "../lib/utils";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export async function ceasarCipher() {
  try {
    const { text, shift, action, cipherText, plainText } = await prompts(
      [
        {
          type: "select",
          name: "action",
          message: "Select an action",
          choices: [
            { title: "Encrypt", value: "encrypt" },
            { title: "Decrypt", value: "decrypt" },
            { title: "Brute Force", value: "bruteForce" },
          ],
        },
        {
          type: (prev) => (prev === "bruteForce" ? null : "text"),
          name: "text",
          message: "Enter your text",
          validate,
        },
        {
          type: (prev) => (prev === "bruteForce" ? null : "number"),
          name: "shift",
          message: "Enter the shift",
          min: 1,
          max: 25,
          validate: (v) => (v ? true : "Please enter a shift"),
        },
        {
          type: (_, values) => (values.action === "bruteForce" ? "text" : null),
          name: "cipherText",
          message: "Enter the cipher text",
          validate,
        },
        {
          type: (_, values) => (values.action === "bruteForce" ? "text" : null),
          name: "plainText",
          message: "Enter the plain text",
          validate,
        },
      ],
      { onCancel },
    );

    if (action === "bruteForce") {
      const result = bruteForce(plainText, cipherText);

      if (result === -1) {
        console.log(
          `\n${colors.red("Error:")} ${colors.yellow(
            "Couldn't find the shift",
          )}\n`,
        );
      } else {
        console.log(`\n${colors.yellow("Shift")}: ${colors.green(result)}\n`);
      }

      return;
    }

    const result = crypt(text, shift, action);

    console.log(
      `\n${colors.yellow(capitalize(action) + "ed text")}: ${colors.green(
        result,
      )}\n`,
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
      const charIndex = ALPHABET.indexOf(char.toLowerCase());

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

function bruteForce(plainText: string, cipherText: string) {
  for (let i = 0; i < ALPHABET.length; i++) {
    let s1 = "";

    for (let j = 0; j < cipherText.length; j++) {
      const c = cipherText[j];
      const a = ALPHABET.indexOf(c);
      const newChar = ALPHABET.at(a - i);

      s1 += newChar;
    }

    if (s1 === plainText) {
      return i;
    }
  }

  return -1;
}

function validate(value: string) {
  if (!value) {
    return "Please enter some text";
  }

  if (!value.match(/^[a-zA-Z]+$/)) {
    return "Please enter a text with only letters";
  }

  return true;
}

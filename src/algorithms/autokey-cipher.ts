import prompts from "prompts";
import colors from "picocolors";

import { capitalize, checkFileExists, onCancel, readFile } from "../lib/utils";

export async function autoKeyCipher() {
  try {
    let { action, text, key, cipherText, plainText } = await prompts(
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
        // encypt/decrypt
        {
          type: (prev) => (prev === "bruteForce" ? null : "text"),
          name: "text",
          message: "Enter your text or a relative path to a file",
          hint: "e.g. ./text.txt",
          validate,
        },
        {
          type: (prev) => (prev === "bruteForce" ? null : "number"),
          name: "key",
          message: "Enter the key",
          min: 1,
          max: 25,
          validate: (v) => (v ? true : "Please enter a key"),
        },
        // brute force
        {
          type: (_, values) => (values.action === "bruteForce" ? "text" : null),
          name: "cipherText",
          message: "Enter the cipher text or a relative path to a file",
          hint: "e.g. ./cipher.txt",
          validate,
        },
        {
          type: (_, values) => (values.action === "bruteForce" ? "text" : null),
          name: "plainText",
          message: "Enter the plain text or a relative path to a file",
          hint: "e.g. ./plain.txt",
          validate,
        },
      ],
      { onCancel },
    );

    if (action === "bruteForce") {
      if (cipherText.startsWith("./")) {
        cipherText = await readFile(cipherText);
      }

      if (plainText.startsWith("./")) {
        plainText = await readFile(plainText);
      }

      const result = bruteForce(plainText, cipherText);

      if (result === -1) {
        console.log(
          `\n${colors.red("Error:")} ${colors.yellow(
            "Couldn't find the key",
          )}\n`,
        );
      } else {
        console.log(`\n${colors.yellow("Key")}: ${colors.green(result)}\n`);
      }

      return;
    }

    if (text.startsWith("./")) {
      text = await readFile(text);
    }

    const result = crypt(text, key, action);

    console.log(
      `\n${colors.yellow(`${capitalize(action)}ed text`)}: ${colors.green(
        result,
      )}\n`,
    );

    return;
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

function crypt(text: string, key: number, action: "encrypt" | "decrypt") {
  return text.split("").reduce((acc, char, i) => {
    const charIndex = ALPHABET.indexOf(char.toLowerCase());

    if (charIndex === -1) {
      return acc + char;
    }

    let newIndex: number;

    if (action === "encrypt") {
      if (i === 0) {
        newIndex = (charIndex + key) % 26;
      } else {
        const prevCharIndex = ALPHABET.indexOf(text[i - 1].toLowerCase());
        newIndex = (charIndex + prevCharIndex) % 26;
      }
    } else {
      if (i === 0) {
        newIndex = (charIndex - key) % 26;
      } else {
        const prevCharIndex = ALPHABET.indexOf(acc[i - 1].toLowerCase());
        newIndex = (charIndex - prevCharIndex) % 26;
      }
    }

    return acc + ALPHABET.at(newIndex);
  }, "");
}

function bruteForce(plainText: string, cipherText: string) {
  return (
    Array.from({ length: 25 }, (_, i) => i + 1).find(
      (i) => crypt(cipherText, i, "decrypt") === plainText,
    ) ?? -1
  );
}

async function validate(value: string) {
  if (!value) {
    return "Please enter some text";
  }

  if (value.startsWith("./")) {
    if (value.length === 2) {
      return "Please enter a path";
    }

    const pathExists = await checkFileExists(value);

    if (!pathExists) {
      return "The path you provided doesn't exist.";
    }
  }

  if (!value.match(/^(.\/)?[a-zA-Z]+(.*)?$/)) {
    return "Please enter a text with only letters";
  }

  return true;
}

import prompts from "prompts";
import colors from "picocolors";

import { capitalize, checkFileExists, onCancel, readFile } from "../lib/utils";

const ALPHABET = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

export async function playfairCipher() {
  try {
    let { action, text, key } = await prompts(
      [
        {
          type: "select",
          name: "action",
          message: "Select an action",
          choices: [
            { title: "Encrypt", value: "encrypt" },
            { title: "Decrypt", value: "decrypt" },
          ],
        },
        {
          type: (prev) => (prev === "bruteForce" ? null : "text"),
          name: "text",
          message: "Enter your text or a relative path to a file",
          hint: "e.g. ./text.txt",
          validate,
        },
        {
          type: (prev) => (prev === "bruteForce" ? null : "text"),
          name: "key",
          message: "Enter the key",
          validate: (v) => {
            if (!v) {
              return "Please enter a key";
            }

            if (!v.match(/^[a-zA-Z]+$/)) {
              return "Please enter a key with only letters";
            }

            return true;
          },
        },
      ],
      { onCancel },
    );

    if (text.startsWith("./")) {
      text = await readFile(text);
    }

    const plafairMatrix = constructPlayfairMatrix(key);
    const diagraphs = plainTextToDiagraphs(text);

    const result = crypt(plafairMatrix, text, diagraphs, action);

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

function constructPlayfairMatrix(key: string) {
  const matrix: string[][] = [];

  key = key.toUpperCase().replace(/J/g, "I");

  let i = 0,
    j = 0;

  for (let char of key) {
    if (!matrix[i]) {
      matrix[i] = [];
    }

    if (!matrix[i].includes(char)) {
      matrix[i][j] = char;

      if (j === 4) {
        i++;
        j = 0;
      } else {
        j++;
      }
    }
  }

  const filteredAlphabet = ALPHABET.split("").filter(
    (char) => char !== "J" && !key.includes(char),
  );

  for (let char of filteredAlphabet) {
    if (char === "J") {
      continue;
    }

    if (!matrix[i]) {
      matrix[i] = [];
    }

    if (!matrix[i].includes(char)) {
      matrix[i][j] = char;

      if (j === 4) {
        i++;
        j = 0;
      } else {
        j++;
      }
    }
  }

  return matrix;
}

function plainTextToDiagraphs(text: string) {
  const diagraphs: string[] = [];

  let i = 0,
    j = 0;

  while (i < text.length) {
    if (text[i] === text[i + 1]) {
      diagraphs[j] = text[i] + "X";
      i++;
    } else {
      diagraphs[j] = text[i] + text[i + 1];
      i += 2;
    }

    j++;
  }

  return diagraphs.map((d) => d.toUpperCase());
}

function crypt(
  matrix: string[][],
  text: string,
  diagraphs: string[],
  action: string,
) {
  let result = "";

  for (let diagraph of diagraphs) {
    const [first, second] = diagraph.split("");

    const [firstRow, firstCol] = findPosition(matrix, first);
    const [secondRow, secondCol] = findPosition(matrix, second);

    let newFirst = "",
      newSecond = "";

    if (firstRow === secondRow) {
      newFirst = matrix
        .at(firstRow)!
        .at((firstCol + (action === "encrypt" ? 1 : -1)) % 5)!;

      newSecond = matrix
        .at(secondRow)!
        .at((secondCol + (action === "encrypt" ? 1 : -1)) % 5)!;
    } else if (firstCol === secondCol) {
      newFirst = matrix
        .at((firstRow + (action === "encrypt" ? 1 : -1)) % 5)!
        .at(firstCol)!;
      newSecond = matrix
        .at((secondRow + (action === "encrypt" ? 1 : -1)) % 5)!
        .at(secondCol)!;
    } else {
      newFirst = matrix[firstRow][secondCol];
      newSecond = matrix[secondRow][firstCol];
    }

    result += newFirst + newSecond;
  }

  return result;
}

function findPosition(matrix: string[][], char: string) {
  const row = matrix.findIndex((r) => r.includes(char));
  const col = matrix[row].findIndex((c) => c === char);

  return [row, col];
}

import prompts from "prompts";
import colors from "picocolors";

import { algorithms } from "./lib/constants";
import { onCancel } from "./lib/utils";

async function init() {
  console.clear();

  console.log(`${colors.bgBlue(colors.bold("Cryptographer"))}\n`);

  let loopOver = false;

  try {
    do {
      const { algorithm } = await prompts(
        {
          type: "select",
          name: "algorithm",
          message: "Select an algorithm",
          choices: algorithms.map(({ name: value, title, description }) => ({
            title,
            value,
            description,
          })),
        },
        { onCancel },
      );

      const selectedAlgo = algorithms.find((a) => a.name === algorithm)!;

      console.log(
        `\n${colors.blue("Algorithm:")} ${colors.green(selectedAlgo.title)}\n`,
      );

      await selectedAlgo.handler();

      const { again } = await prompts(
        {
          type: "confirm",
          name: "again",
          message: "Do you want to start again?",
          initial: true,
        },
        { onCancel },
      );

      loopOver = again;
    } while (loopOver);

    console.log(
      `\nSee a Problem? Open an issue at ${colors.underline(
        colors.cyan("https://github.com/rajput-hemant/cryptography/issues"),
      )}`,
    );

    process.exit(0);
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }
}

init().catch(console.error);

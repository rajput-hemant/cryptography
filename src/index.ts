import prompts from "prompts";
import colors from "picocolors";

import { algorithms } from "./lib/constants";

async function init() {
  console.clear();

  console.log(`${colors.bgBlue(colors.bold("Cryptographer"))}\n`);

  try {
    const { algorithm } = await prompts(
      {
        type: "select",
        name: "algorithm",
        message: colors.reset("Select an algorithm"),
        choices: algorithms.map(({ name: value, title, description }) => ({
          title,
          value,
          description,
        })),
      },
      {
        onCancel() {
          throw new Error(colors.red("✖") + " Operation cancelled");
        },
      },
    );

    const selectedAlgo = algorithms.find((a) => a.name === algorithm)!;

    console.log(
      `\n${colors.blue("Algorithm:")} ${colors.green(selectedAlgo.title)}\n`,
    );

    await selectedAlgo.handler();

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

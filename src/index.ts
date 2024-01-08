import prompts from "prompts";
import { lightBlue, lightGreen, red, reset } from "kolorist";

import { algorithms } from "./lib/constants";

async function init() {
  try {
    const { algorithm } = await prompts(
      {
        type: "select",
        name: "algorithm",
        message: reset("Select an algorithm"),
        choices: algorithms.map(({ name: value, title, description }) => ({
          title,
          value,
          description,
        })),
      },
      {
        onCancel() {
          throw new Error(red("✖") + " Operation cancelled");
        },
      },
    );

    const selectedAlgo = algorithms.find((a) => a.name === algorithm)!;

    console.log(
      `\n${lightBlue("Algorithm:")} ${lightGreen(selectedAlgo.title)}\n`,
    );

    await selectedAlgo.handler();

    return;
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }
}

init().catch((e) => {
  console.error(e);
});

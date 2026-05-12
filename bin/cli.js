#!/usr/bin/env node

import boxen from "boxen";
import chalk from "chalk";
import inquirer from "inquirer";
import open from "open";
import terminalLink from "terminal-link";

const PROFILE = {
  fullName: "Reyhaneh Moayeri",
  handle: "@reyhaneh-moayeri",
  email: "reyhaneh.rad.dev@gmail.com",
  workLine: [
    "Software Developer· ",
  ].join(""),
  github: {
    url: "https://github.com/reyhaneh-moayeri",
    display: "github.com/reyhaneh-moayeri",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/reyhaneh-moayerirad/",
    display: "linkedin.com/in/reyhaneh-moayerirad",
  },
  twitter: {
    url: "https://twitter.com/itsreydev",
    display: "twitter.com/itsreydev",
  },
  npm: {
    url: "https://www.npmjs.com/~reyhanehrad",
    display: "npmjs.com/package/reyhanehrad",
  },
  bio: chalk.italic.gray(
    `"Always curious, always learning, and often coding, especially in JavaScript."`,
  ),
};

const LABELS = ["Work", "Twitter", "npm", "GitHub", "LinkedIn", "Email", "Card"];
const LABEL_COL = Math.max(...LABELS.map((s) => s.length));

/** Plain ANSI styles only inside hyperlinks — truecolor (`chalk.hex`) breaks in OSC 8 links on many terminals. */
function href(styled, url, plainFallback) {
  const fallback = plainFallback ?? url;
  return terminalLink(styled, url, { fallback: () => fallback });
}

function labelRow(label, value) {
  return `${chalk.gray(label.padEnd(LABEL_COL))}  ${value}`;
}

function cardBody() {
  const { fullName, handle, email, workLine, github, linkedin, twitter, npm, bio } =
    PROFILE;

  const linkColWidth = Math.max(
    workLine.trimEnd().length,
    twitter.display.length,
    npm.display.length,
    github.display.length,
    linkedin.display.length,
    email.length,
    "npx rey.dev".length,
  );

  const padLink = (s) => s.padEnd(linkColWidth);
  const workAligned = padLink(workLine.trimEnd());
  const cardPlain = "npx rey.dev";
  const cardTail = " ".repeat(Math.max(0, linkColWidth - cardPlain.length));
  const cardRow = `${chalk.red("npx")} ${chalk.gray("rey.dev")}${cardTail}`;

  const header = chalk.bold.green(`${fullName} / ${handle}`);

  const lines = [
    header,
    "",
    labelRow("Work", workAligned),
    labelRow(
      "Twitter",
      href(chalk.cyan(padLink(twitter.display)), twitter.url, twitter.display),
    ),
    labelRow(
      "npm",
      href(chalk.red(padLink(npm.display)), npm.url, npm.display),
    ),
    labelRow(
      "GitHub",
      href(chalk.cyan(padLink(github.display)), github.url, github.display),
    ),
    labelRow(
      "LinkedIn",
      href(
        chalk.blue.bold(padLink(linkedin.display)),
        linkedin.url,
        linkedin.display,
      ),
    ),
    labelRow(
      "Email",
      href(chalk.green(padLink(email)), `mailto:${email}`, email),
    ),
    labelRow("Card", cardRow),
    "",
    bio,
  ];

  return lines.join("\n");
}

async function main() {
  console.log(
    boxen(cardBody(), {
      borderStyle: "round",
      borderColor: "green",
      padding: { top: 1, bottom: 1, left: 2, right: 2 },
      margin: { bottom: 1 },
    }),
  );

  console.log(
    `${chalk.gray("Tip:")} Try ${chalk.cyan("cmd/ctrl + click")} on the links above\n`,
  );

  for (;;) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What you want to do?",
        choices: [
          { name: "Send me an email?", value: "email" },
          { name: "Open GitHub profile", value: "github" },
          { name: "Open LinkedIn", value: "linkedin" },
          { name: "Exit", value: "exit" },
        ],
        loop: false,
      },
    ]);

    if (action === "exit") {
      console.log(chalk.gray("\nBye!"));
      break;
    }
    if (action === "email") await open(`mailto:${PROFILE.email}`);
    if (action === "github") await open(PROFILE.github.url);
    if (action === "linkedin") await open(PROFILE.linkedin.url);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

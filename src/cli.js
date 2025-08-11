#!/usr/bin/env node
import { program } from "commander";
import { runBadName } from "./core/index.js"; // ✅ 改這裡

program
  .argument("<target>", "Path or glob of files")
  .option("--mode <mode>", "Naming mode", "newOldHell")
  .option(
    "--include <pattern>",
    "Glob include",
    "**/*.{js,ts,jsx,tsx,css,html}"
  )
  .parse(process.argv);

const opts = program.opts();
const [target] = program.args;

runBadName(target, opts);

import { glob } from "glob";
import fs from "fs";
import path from "path";
import { transformJS } from "../transformers/js.js";
// import { transformCSS } from '../transformers/css.js'
// import { transformHTML } from '../transformers/html.js'
import * as modes from "./modes/index.js";

export async function runBadName(target, opts) {
  const files = await glob(opts.include, { cwd: target, absolute: true });
  const mode = modes[opts.mode];
  if (!mode) throw new Error(`Mode ${opts.mode} not found`);

  const map = new Map();

  for (const file of files) {
    const ext = path.extname(file);
    let code = fs.readFileSync(file, "utf8");

    if (/\.(js|ts|jsx|tsx)$/.test(ext)) {
      code = transformJS(code, map, mode);
      fs.writeFileSync(file, code, "utf8");
    }

    // CSS/HTML 等這個穩了再開
    // else if (/\.css$/.test(ext)) { ... }
    // else if (/\.html$/.test(ext)) { ... }
  }
}

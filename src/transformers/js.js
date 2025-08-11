import { parse } from "@babel/parser";
import traverseImport from "@babel/traverse";
import generateImport from "@babel/generator";
import * as t from "@babel/types";

const traverse = traverseImport.default || traverseImport;
const generate = generateImport.default || generateImport;

const DEFAULT_PRESERVE = new Set([
  "require",
  "module",
  "exports",
  "arguments",
  "React",
  "useState",
  "useEffect",
  "Fragment",
]);

// 禁改位置：物件鍵(非shorthand)、obj.foo 的 foo、label、import/export 的對外名
function isForbiddenIdentifier(path) {
  if (!path.isIdentifier()) return true;
  const p = path.parentPath;
  if (p?.isObjectProperty() && p.node.key === path.node && !p.node.shorthand)
    return true;
  if (
    p?.isMemberExpression() &&
    p.node.property === path.node &&
    !p.node.computed
  )
    return true;
  if (p?.isLabeledStatement()) return true;
  if (p?.isImportSpecifier() && p.node.imported === path.node) return true;
  if (p?.isExportSpecifier() && p.node.exported === path.node) return true;
  return false;
}

export function transformJS(code, map, mode) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: [
      "typescript",
      "jsx",
      "classProperties",
      "classPrivateProperties",
      "classPrivateMethods",
      "decorators-legacy",
      "dynamicImport",
      "importMeta",
      "topLevelAwait",
    ],
  });

  // 第1階段：收集「綁定名」(宣告、參數、函式名、類名、import 本地名)
  const bindNames = new Set();

  traverse(ast, {
    // 變數/參數/函式/類的宣告點
    Identifier(path) {
      if (isForbiddenIdentifier(path)) return;
      const binding = path.scope.getBinding(path.node.name);
      if (!binding) return;

      // 只收集「這個識別符就是該綁定的宣告點」的情況
      if (binding.identifier === path.node) {
        const name = path.node.name;
        if (!DEFAULT_PRESERVE.has(name)) bindNames.add(name);
      }
    },
    ImportSpecifier(path) {
      const local = path.node.local;
      if (t.isIdentifier(local) && !DEFAULT_PRESERVE.has(local.name)) {
        bindNames.add(local.name);
      }
    },
    ImportDefaultSpecifier(path) {
      const local = path.node.local;
      if (t.isIdentifier(local) && !DEFAULT_PRESERVE.has(local.name)) {
        bindNames.add(local.name);
      }
    },
    ImportNamespaceSpecifier(path) {
      const local = path.node.local;
      if (t.isIdentifier(local) && !DEFAULT_PRESERVE.has(local.name)) {
        bindNames.add(local.name);
      }
    },
  });

  // 建立一次性的改名表（避免連鎖改名）
  let counter = 0;
  const produced = new Set([...map.values()]);
  for (const orig of bindNames) {
    if (map.has(orig)) continue;
    // 產生新名，避免跟已產生的新名撞
    let candidate;
    do {
      candidate = mode.nextName("var", null, counter++);
    } while (produced.has(candidate));
    map.set(orig, candidate);
    produced.add(candidate);
  }

  // 第2階段：只對綁定做 rename（Babel 會自動更新同scope引用）
  traverse(ast, {
    Identifier(path) {
      if (isForbiddenIdentifier(path)) return;
      const binding = path.scope.getBinding(path.node.name);
      if (!binding) return;
      if (binding.identifier !== path.node) return;

      const oldName = path.node.name;
      const newName = map.get(oldName);
      if (!newName || oldName === newName) return;

      // 只呼叫一次 rename；避免在 traversal 中 replace 造成遞迴
      path.scope.rename(oldName, newName);
    },
    // 額外保險：函式/類別宣告名（有些情況上面沒抓到）
    FunctionDeclaration(path) {
      const id = path.node.id;
      if (!id || !t.isIdentifier(id)) return;
      const oldName = id.name;
      const newName = map.get(oldName);
      if (newName && oldName !== newName) path.scope.rename(oldName, newName);
    },
    ClassDeclaration(path) {
      const id = path.node.id;
      if (!id || !t.isIdentifier(id)) return;
      const oldName = id.name;
      const newName = map.get(oldName);
      if (newName && oldName !== newName) path.scope.rename(oldName, newName);
    },
    ImportSpecifier(path) {
      const local = path.node.local;
      if (!t.isIdentifier(local)) return;
      const oldName = local.name;
      const newName = map.get(oldName);
      if (newName && oldName !== newName) path.scope.rename(oldName, newName);
    },
    ImportDefaultSpecifier(path) {
      const local = path.node.local;
      if (!t.isIdentifier(local)) return;
      const oldName = local.name;
      const newName = map.get(oldName);
      if (newName && oldName !== newName) path.scope.rename(oldName, newName);
    },
    ImportNamespaceSpecifier(path) {
      const local = path.node.local;
      if (!t.isIdentifier(local)) return;
      const oldName = local.name;
      const newName = map.get(oldName);
      if (newName && oldName !== newName) path.scope.rename(oldName, newName);
    },
    ExportSpecifier(path) {
      const local = path.node.local;
      if (!t.isIdentifier(local)) return;
      const oldName = local.name;
      const newName = map.get(oldName);
      if (newName && oldName !== newName) path.scope.rename(oldName, newName);
    },
  });

  return generate(ast, { jsescOption: { minimal: true } }, code).code;
}

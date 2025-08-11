export function transformCSS(code, map, mode) {
  let counter = 0;
  return code.replace(/\.(\w+)/g, (_, cls) => {
    if (!map.has(cls)) {
      map.set(cls, mode.nextName("class", null, counter++));
    }
    return "." + map.get(cls);
  });
}

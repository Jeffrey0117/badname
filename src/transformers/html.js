export function transformHTML(code, map, mode) {
  let counter = 0;
  return code.replace(/class="([^"]+)"/g, (match, classes) => {
    const newClasses = classes.split(/\s+/).map((cls) => {
      if (!map.has(cls)) {
        map.set(cls, mode.nextName("class", null, counter++));
      }
      return map.get(cls);
    });
    return `class="${newClasses.join(" ")}"`;
  });
}

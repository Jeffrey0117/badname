export const namePool = [
  "final",
  "final_final",
  "final_final2",
  "final_final_final",
  "final_ok",
  "final_OK",
  "final_fix",
  "final_fix_OK",
  "final_last",
  "final_last_OK",
  "final_last_v2",
  "final_last_v2_OK",
  "final_real",
  "final_real_OK",
  "final_real_final",
  "final_real_final_OK",
];

export function nextName(kind, scope, attempt) {
  const index = attempt % namePool.length;
  return namePool[index];
}

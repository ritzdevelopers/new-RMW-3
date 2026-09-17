export function hasWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

export function isLiteDevice() {
  if (typeof window === "undefined") return true;
  const saveData =
    "connection" in navigator &&
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  return (
    window.innerWidth < 768 ||
    saveData ||
    (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4)
  );
}

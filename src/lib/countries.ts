const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

const OVERRIDES: Record<string, string> = {
  TW: "Taiwan",
};

export function getCountryLabel(code: string): string {
  if (OVERRIDES[code]) return OVERRIDES[code];
  try {
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
}

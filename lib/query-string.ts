export function buildQueryString(
  params: Record<string, string | number | undefined>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== null) {
      result[key] = String(value);
    }
  }
  return result;
}

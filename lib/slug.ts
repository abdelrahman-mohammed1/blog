/** Egyptian-style Arabic → Latin map for readable blog slugs */
const ARABIC_MAP: Record<string, string> = {
  ا: "a",
  أ: "a",
  إ: "e",
  آ: "a",
  ئ: "e",
  ء: "",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "g",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "th",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "o",
  ي: "y",
  ى: "a",
  ة: "a",
  " ": "-",
  "ـ": "",
};

/**
 * Generates a URL-friendly slug from a title (supports Arabic + emoji).
 * Example: "ازاي تختار خروف العيد ❤️" → "azay-tkhtar-khrof-alaayd"
 */
export function generateSlug(title: string): string {
  if (!title.trim()) return "";

  let slug = "";

  for (const char of title.normalize("NFC")) {
    if (ARABIC_MAP[char] !== undefined) {
      slug += ARABIC_MAP[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      slug += char.toLowerCase();
    }
  }

  return slug
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

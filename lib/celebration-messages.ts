const READING_CELEBRATION_MESSAGES = [
  "🎉 Nice! You actually read the post 😂",
  "🔥 +1 brain cell unlocked",
  "📖 Certified Reader Activated",
  "🧠 Knowledge absorbed. Views +1.",
  "👀 You stayed. Respect.",
  "🎓 Graduated from Skimmer University",
  "✨ Reader mode: ON",
  "🏆 Achievement unlocked: Actually Read It",
] as const;

export function getRandomCelebrationMessage(): string {
  const index = Math.floor(Math.random() * READING_CELEBRATION_MESSAGES.length);
  return READING_CELEBRATION_MESSAGES[index];
}

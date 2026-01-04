const competitiveProgrammingTips: string[] = [
  "Competitive programming is less about memorizing algorithms and more about recognizing patterns. Many problems look new but are actually variations of prefix sums, two pointers, binary search, or greedy strategies.",
  "Before optimizing anything, always think about the brute-force approach, even if it is too slow to pass.",
  "Constraints are one of the biggest hints in a problem statement. Always map constraints to time and space complexity.",
  "Precomputation saves time. Use prefix sums, lookup tables, or preprocessed arrays whenever repeated work exists.",
  "Many problems rely on mathematical identities like XOR properties, modular arithmetic, or GCD tricks.",
  "Assertions help catch silent logical bugs during practice and improve confidence in your code.",
  "Breaking logic into small helper functions reduces mistakes and improves readability.",
  "Master one language deeply instead of switching between many languages.",
  "Upsolving after contests is where real improvement happens.",
  "Most wrong answers come from logical mistakes, not syntax errors."
];

const getRandomDigit = (): number =>
  Math.floor(Math.random() * competitiveProgrammingTips.length);

export const getRandomCpTip = (): { index: number; tip: string } => {
  const index = getRandomDigit();
  return {
    index,
    tip: competitiveProgrammingTips[index] as string
  };
};
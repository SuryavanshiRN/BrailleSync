// Enhanced test for braille translation with special characters
const brailleMap = {
  a: "⠁",
  b: "⠃",
  c: "⠉",
  d: "⠙",
  e: "⠑",
  f: "⠋",
  g: "⠛",
  h: "⠓",
  i: "⠊",
  j: "⠚",
  k: "⠅",
  l: "⠇",
  m: "⠍",
  n: "⠝",
  o: "⠕",
  p: "⠏",
  q: "⠟",
  r: "⠗",
  s: "⠎",
  t: "⠞",
  u: "⠥",
  v: "⠧",
  w: "⠺",
  x: "⠭",
  y: "⠽",
  z: "⠵",
  0: "⠚",
  1: "⠁",
  2: "⠃",
  3: "⠉",
  4: "⠙",
  5: "⠑",
  6: "⠋",
  7: "⠛",
  8: "⠓",
  9: "⠊",
  " ": "⠀",
  ".": "⠲",
  ",": "⠂",
  "?": "⠦",
  "!": "⠖",
  ":": "⠒",
  ";": "⠆",
  "-": "⠤",
  "(": "⠐⠣",
  ")": "⠐⠜",
  "'": "⠄",
  '"': "⠐⠄",
  "&": "⠈⠯",
  "@": "⠈⠁",
  "*": "⠐⠔",
  "/": "⠸⠌",
  "\\": "⠸⠡",
  "#": "⠼⠹",
  $: "⠈⠎",
  "%": "⠨⠴",
  "+": "⠐⠖",
  "=": "⠐⠶",
  "<": "⠐⠣",
  ">": "⠐⠜",
  "[": "⠪",
  "]": "⠻",
  "{": "⠸⠣",
  "}": "⠸⠜",
  _: "⠸⠤",
  "|": "⠸⠳",
};

const capitalIndicator = "⠠";
const numberIndicator = "⠼";

const contractions = {
  the: "⠮",
  and: "⠯",
  for: "⠿",
  with: "⠾",
  ing: "⠬",
};

function textToBraille(text, isGrade2 = false) {
  if (!text) return "";

  let content = text;

  // Apply Grade-2 contractions if enabled
  if (isGrade2) {
    Object.entries(contractions).forEach(([word, char]) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      content = content.replace(regex, char);
    });
  }

  let result = "";
  let inNumber = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    // If it's already a braille contraction, pass it through
    if (Object.values(contractions).includes(char)) {
      result += char;
      inNumber = false;
      continue;
    }

    const lowerChar = char.toLowerCase();

    if (char >= "0" && char <= "9") {
      if (!inNumber) {
        result += numberIndicator;
        inNumber = true;
      }
      result += brailleMap[char] || char;
    } else if (char === " ") {
      result += brailleMap[" "];
      inNumber = false;
    } else if (brailleMap[lowerChar]) {
      inNumber = false;
      if (char !== lowerChar) {
        result += capitalIndicator;
      }
      result += brailleMap[lowerChar];
    } else {
      inNumber = false;
      result += char;
    }
  }

  return result;
}

console.log("=== SPECIAL CHARACTER TESTS ===\n");

const tests = [
  { input: "Hello & why", desc: "Ampersand test" },
  { input: "email@test.com", desc: "Email with @ symbol" },
  { input: "100% complete!", desc: "Percentage and exclamation" },
  { input: "a + b = c", desc: "Math equation" },
  { input: "cost is $50", desc: "Dollar sign" },
  { input: "use * for multiply", desc: "Asterisk" },
  { input: "(hello)", desc: "Parentheses" },
  { input: "Hello & why", grade2: false, desc: "Grade 1 with &" },
  { input: "Hello & why", grade2: true, desc: "Grade 2 with &" },
];

tests.forEach((test, idx) => {
  const result = textToBraille(test.input, test.grade2 || false);
  const hasUnmapped =
    result.includes("&") ||
    result.includes("@") ||
    (result.match(/[a-zA-Z0-9]/g) &&
      result.match(/[a-zA-Z0-9]/g).some((c) => c.charCodeAt(0) < 128));

  console.log(`Test ${idx + 1}: ${test.desc}`);
  console.log(`  Input:  "${test.input}"`);
  console.log(`  Output: "${result}"`);
  console.log(
    `  Status: ${
      hasUnmapped
        ? "⚠️  Contains unmapped characters"
        : "✅ All characters mapped"
    }`
  );
  if (test.grade2 !== undefined) {
    console.log(`  Grade:  ${test.grade2 ? "Grade 2" : "Grade 1"}`);
  }
  console.log("");
});

console.log('\n=== SPECIFIC TEST: "Hello & why" ===');
const testInput = "Hello & why";
const grade1Result = textToBraille(testInput, false);
const grade2Result = textToBraille(testInput, true);

console.log(`Input: "${testInput}"`);
console.log(`\nGrade 1 Output: "${grade1Result}"`);
console.log(
  `Contains &? ${
    grade1Result.includes("&")
      ? "❌ YES (not converted)"
      : "✅ NO (properly converted)"
  }`
);
console.log(`\nGrade 2 Output: "${grade2Result}"`);
console.log(
  `Contains &? ${
    grade2Result.includes("&")
      ? "❌ YES (not converted)"
      : "✅ NO (properly converted)"
  }`
);

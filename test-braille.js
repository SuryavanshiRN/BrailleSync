// Test script for Grade 2 Braille translation
// Run with: node test-braille.js

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
  " ": "⠀",
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

function brailleToText(braille) {
  const reverseBrailleMap = {};

  Object.entries(brailleMap).forEach(([key, value]) => {
    reverseBrailleMap[value] = key;
  });

  Object.entries(contractions).forEach(([word, symbol]) => {
    reverseBrailleMap[symbol] = word;
  });

  let result = "";
  let nextCapital = false;
  let inNumber = false;

  for (let i = 0; i < braille.length; i++) {
    const char = braille[i];

    if (char === capitalIndicator) {
      nextCapital = true;
      continue;
    }
    if (char === numberIndicator) {
      inNumber = true;
      continue;
    }
    if (char === "⠀") {
      result += " ";
      inNumber = false;
      continue;
    }

    const textChar = reverseBrailleMap[char];
    if (textChar) {
      if (nextCapital) {
        result += textChar.charAt(0).toUpperCase() + textChar.slice(1);
        nextCapital = false;
      } else {
        result += textChar;
      }
    } else {
      result += char;
    }
  }
  return result;
}

// Test cases
console.log("=== GRADE 2 BRAILLE TRANSLATION TESTS ===\n");

const testCases = [
  { text: "the", grade: 1, expected: "⠞⠓⠑" },
  { text: "the", grade: 2, expected: "⠮" },
  { text: "and", grade: 1, expected: "⠁⠝⠙" },
  { text: "and", grade: 2, expected: "⠯" },
  { text: "for", grade: 1, expected: "⠋⠕⠗" },
  { text: "for", grade: 2, expected: "⠿" },
  { text: "with", grade: 1, expected: "⠺⠊⠞⠓" },
  { text: "with", grade: 2, expected: "⠾" },
  { text: "ing", grade: 1, expected: "⠊⠝⠛" },
  { text: "ing", grade: 2, expected: "⠬" },
  { text: "the cat and the dog", grade: 1, expected: "⠞⠓⠑⠀⠉⠁⠞⠀⠁⠝⠙⠀⠞⠓⠑⠀⠙⠕⠛" },
  { text: "the cat and the dog", grade: 2, expected: "⠮⠀⠉⠁⠞⠀⠯⠀⠮⠀⠙⠕⠛" },
  { text: "walking with friends", grade: 2, expected: "⠺⠁⠇⠅⠬⠀⠾⠀⠋⠗⠊⠑⠝⠙⠎" },
];

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const isGrade2 = test.grade === 2;
  const result = textToBraille(test.text, isGrade2);
  const isPass = result === test.expected;

  console.log(`Test ${index + 1}: "${test.text}" (Grade ${test.grade})`);
  console.log(`  Expected: ${test.expected}`);
  console.log(`  Got:      ${result}`);
  console.log(`  Status:   ${isPass ? "✓ PASS" : "✗ FAIL"}`);
  console.log("");

  if (isPass) passed++;
  else failed++;
});

console.log("\n=== REVERSE TRANSLATION TESTS (Braille to Text) ===\n");

const reverseTests = [
  { braille: "⠮", expected: "the" },
  { braille: "⠯", expected: "and" },
  { braille: "⠿", expected: "for" },
  { braille: "⠾", expected: "with" },
  { braille: "⠬", expected: "ing" },
  { braille: "⠮⠀⠉⠁⠞⠀⠯⠀⠮⠀⠙⠕⠛", expected: "the cat and the dog" },
  { braille: "⠺⠁⠇⠅⠬⠀⠾⠀⠋⠗⠊⠑⠝⠙⠎", expected: "walking with friends" },
];

reverseTests.forEach((test, index) => {
  const result = brailleToText(test.braille);
  const isPass = result === test.expected;

  console.log(`Reverse Test ${index + 1}: ${test.braille}`);
  console.log(`  Expected: "${test.expected}"`);
  console.log(`  Got:      "${result}"`);
  console.log(`  Status:   ${isPass ? "✓ PASS" : "✗ FAIL"}`);
  console.log("");

  if (isPass) passed++;
  else failed++;
});

console.log("\n=== TEST SUMMARY ===");
console.log(`Total Tests: ${testCases.length + reverseTests.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(
  `Success Rate: ${(
    (passed / (testCases.length + reverseTests.length)) *
    100
  ).toFixed(2)}%`
);

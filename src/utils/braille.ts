const brailleMap: Record<string, string> = {
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
  "0": "⠚",
  "1": "⠁",
  "2": "⠃",
  "3": "⠉",
  "4": "⠙",
  "5": "⠑",
  "6": "⠋",
  "7": "⠛",
  "8": "⠓",
  "9": "⠊",
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

// Basic Grade-2 Contractions
const contractions: Record<string, string> = {
  the: "⠮",
  and: "⠯",
  for: "⠿",
  with: "⠾",
  ing: "⠬",
};

/**
 * Converts text to Braille.
 * @param isGrade2 - If true, applies word-based contractions.
 */
export const textToBraille = (text: string, isGrade2 = false): string => {
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

    // If it's already a braille contraction from the step above, pass it through
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
};

/**
 * Converts Braille back to Text.
 * Updated to handle Grade-2 contractions.
 */
export const brailleToText = (braille: string): string => {
  const reverseBrailleMap: Record<string, string> = {};

  // 1. Map standard characters
  Object.entries(brailleMap).forEach(([key, value]) => {
    reverseBrailleMap[value] = key;
  });

  // 2. Map contractions so symbols like '⠮' return 'the'
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
        // Capitalize the first letter of the contracted word or the character
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
};

const brailleMap: Record<string, string> = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
  'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
  'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
  '0': '⠚', '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙',
  '5': '⠑', '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊',
  ' ': '⠀',
  '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖', ':': '⠒',
  ';': '⠆', '-': '⠤', '(': '⠐⠣', ')': '⠐⠜',
  "'": '⠄', '"': '⠐⠄',
};

const capitalIndicator = '⠠';
const numberIndicator = '⠼';

export const textToBraille = (text: string): string => {
  if (!text) return '';
  
  let result = '';
  let inNumber = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const lowerChar = char.toLowerCase();
    
    if (char >= '0' && char <= '9') {
      if (!inNumber) {
        result += numberIndicator;
        inNumber = true;
      }
      result += brailleMap[char] || char;
    } else if (char === ' ') {
      result += brailleMap[' '];
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

export const brailleToText = (braille: string): string => {
  const reverseBrailleMap: Record<string, string> = {};
  Object.entries(brailleMap).forEach(([key, value]) => {
    reverseBrailleMap[value] = key;
  });
  
  let result = '';
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
    
    if (char === '⠀') {
      result += ' ';
      inNumber = false;
      continue;
    }
    
    const textChar = reverseBrailleMap[char];
    if (textChar) {
      if (nextCapital) {
        result += textChar.toUpperCase();
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

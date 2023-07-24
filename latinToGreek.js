export const latinToGreek = (inputText) => {
    const latinToGreekMap = {
      a: 'α', A: 'Α',
      b: 'β', B: 'Β',
      c: 'ψ', C: 'Ψ',
      d: 'δ', D: 'Δ',
      e: 'ε', E: 'Ε',
      f: 'φ', F: 'Φ',
      g: 'γ', G: 'Γ',
      h: 'η', H: 'Η',
      i: 'ι', I: 'Ι',
      j: 'ξ', J: 'Ξ',
      k: 'κ', K: 'Κ',
      l: 'λ', L: 'Λ',
      m: 'μ', M: 'Μ',
      n: 'ν', N: 'Ν',
      o: 'ο', O: 'Ο',
      p: 'π', P: 'Π',
      q: 'θ', Q: 'Θ',
      r: 'ρ', R: 'Ρ',
      s: 'σ', S: 'Σ',
      t: 'τ', T: 'Τ',
      u: 'υ', U: 'Υ',
      v: 'ω', V: 'Ω',
      w: 'ω', W: 'Ω', // In Greek, 'w' can be represented by 'ω'
      x: 'χ', X: 'Χ',
      y: 'υ', Y: 'Υ',
      z: 'ζ', Z: 'Ζ',
      0: '0',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
    };
  
    return inputText
      .split('') // Convert the text to an array of characters
      .map((char) => latinToGreekMap[char] || char) // Replace each Latin letter/number with the corresponding Greek letter/number (if available)
      .join(''); // Join the characters back to form the converted text
  }
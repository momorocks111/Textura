"use strict";

export class TextTransformer {
  constructor() {
    this.morseCode = {
      a: ".-",
      b: "-...",
      c: "-.-.",
      d: "-..",
      e: ".",
      f: "..-.",
      g: "--.",
      h: "....",
      i: "..",
      j: ".---",
      k: "-.-",
      l: ".-..",
      m: "--",
      n: "-.",
      o: "---",
      p: ".--.",
      q: "--.-",
      r: ".-.",
      s: "...",
      t: "-",
      u: "..-",
      v: "...-",
      w: ".--",
      x: "-..-",
      y: "-.--",
      z: "--..",
      " ": "/",
    };
  }

  transformText(text) {
    return [
      { name: "Reverse Words", result: this.reverseWords(text) },
      { name: "Apply Cipher", result: this.applyCipher(text) },
      { name: "Create Acrostic", result: this.createAcrostic(text) },
      {
        name: "Generate Alliterative Phrases",
        result: this.generateAlliterativePhrases(text),
      },
      { name: "Convert to Morse Code", result: this.convertToMorseCode(text) },
      { name: "Create Word Ladder", result: this.createWordLadder(text) },
      {
        name: "Identify Rheotorical Devices",
        result: this.identifyRheotoricalDevices(text),
      },
      { name: "Generate Word Cloud", result: this.generateWordCloud(text) },
      { name: "Create Found Poem", result: this.createFoundPoem(text) },
    ];
  }

  reverseWords(text) {
    return text
      .split(/\b/)
      .map((word) => {
        if (word.match(/\w+/)) {
          return word.split("").reverse().join("");
        }

        return word;
      })
      .join("");
  }

  applyCipher(text) {
    const shift = 13;
    return text.replace(/[a-zA-Z]/g, (char) =>
      String.fromCharCode(((char.charCodeAt(0) + shift - 65) % 26) + 65)
    );
  }

  createAcrostic(text) {
    const words = text.split(/\s+/);
    const acrostic = words[0].split("");

    return acrostic
      .map(
        (letter) =>
          words.find((word) =>
            word.toLowerCase().startsWith(letter.toLowerCase())
          ) || letter
      )
      .join("\n");
  }

  generateAlliterativePhrases(text) {
    const words = text.split(/\s+/);
    const alliterations = [];

    for (let i = 0; i < words.length - 2; i++) {
      if (this.isAlliteration(words.slice(i, i + 3))) {
        alliterations.push(words.slice(i, i + 3).join(" "));
      }
    }

    return alliterations.join(", ");
  }

  isAlliteration(words) {
    const sounds = words.map((word) => this.getPhoneticStart(word));

    return sounds.every((sound) => sound === sound[0]);
  }

  getPhoneticStart(word) {
    const phonetics = {
      kn: "n",
      gn: "n",
      ph: "f",
      wh: "w",
      ps: "s",
    };

    for (let [key, value] of Object.entries(phonetics)) {
      if (word.toLowerCase().startsWith(key)) return value;
    }

    return word[0].toLowerCase();
  }

  convertToMorseCode(text) {
    return text
      .toLowerCase()
      .split("")
      .map((char) => this.morseCode[char] || char)
      .join(" ");
  }

  createWordLadder(text) {
    const words = text.split(/\s+/);
    if (words.length < 2) return "Not enough words for a ladder";

    const start = words[0];
    const end = words[words.length - 1];

    if (start.length !== end.length)
      return "Start and end words must be same length";

    const ladder = this.findWordLadder(start, end, new Set(words));
    return ladder ? ladder.join(" -> ") : "No valid word ladder found";
  }

  findWordLadder(start, end, wordSet) {
    const queue = [[start]];
    const visited = new Set();

    while (queue.length > 0) {
      const path = queue.shift();
      const word = path[path.length - 1];

      if (word === end) return path;

      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const newWord =
            word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);

          if (wordSet.has(newWord) && !visited.has(newWord)) {
            visited.add(newWord);
            queue.push([...path, newWord]);
          }
        }
      }
    }

    return null;
  }

  identifyRheotoricalDevices(text) {
    const devices = [];

    if (this.hasAlliteration(text)) devices.push("Alliteration");
    if (this.hasAssonance(text)) devices.push("Assonance");
    if (this.hasMetaphor(text)) devices.push("Metaphor");
    if (this.hasSimile(text)) devices.push("Simile");
    if (this.hasPersonification(text)) devices.push("Personification");

    return devices.join(", ") || "No common rhetorical devices identified";
  }

  hasAlliteration(text) {
    const words = text.split(/\s+/);

    for (let i = 0; i < words.length - 2; i++) {
      if (words[i][0] === words[i + 1][0] && words[i][0] === words[i + 2][0])
        return true;
    }

    return false;
  }

  hasAssonance(text) {
    const vowels = "aeiou";
    const words = text.split(/\s+/);

    for (let i = 0; i < words.length - 1; i++) {
      const vowel1 = words[i]
        .split("")
        .find((char) => vowels.includes(char.toLowerCase()));

      const vowel2 = words[i + 1]
        .split("")
        .find((char) => vowels.includes(char.toLowerCase()));

      if (vowel1 && vowel2 && vowel1.toLowerCase() === vowel2.toLowerCase())
        return true;
    }

    return false;
  }

  hasMetaphor(text) {
    return /\b(is|are|was|were)\b(?![ ,]*like\b)/i.test(text);
  }

  hasSimile(text) {
    return /\b(like|as)\b/i.test(text);
  }

  hasPersonification(text) {
    const humanVerbs = [
      "thinks",
      "feels",
      "knows",
      "understands",
      "loves",
      "hates",
    ];

    return humanVerbs.some((verb) => text.toLowerCase().includes(verb));
  }

  generateWordCloud(text) {
    const words = text.toLowerCase().match(/\b(\w+)\b/g);
    const frequency = {};

    words.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => `${word}: ${count}`)
      .join(", ");
  }

  createFoundPoem(text) {
    const sentences = text.split(/[.!?]+/);
    const words = sentences.flatMap((sentence) => sentence.trim().split(/\s+/));
    const poemLines = [];
    let lineLength = 0;

    for (const word of words) {
      if (lineLength + word.length > 40) {
        poemLines.push("\n");
        lineLength = 0;
      }

      poemLines.push(word);
      lineLength += word.length + 1;
    }

    return poemLines.join(" ").trim();
  }
}

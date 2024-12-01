"use strict";

export const grammarRules = [
  {
    name: "Double negatives",
    regex: /\b(?:not|never).*?\b(?:no|not|never)\b/i,
  },
  {
    name: "Subject-verb agreement",
    regex: /\b(I|he|she|it)\s+(are|were|have been)\b/i,
  },
  {
    name: "Dangling modifier",
    regex: /^(?:Having|Being|While).*?,(?!\s*(?:I|we|you|he|she|it|they))/im,
  },
  {
    name: "Run-on sentence",
    regex: /\w+[.!?]\s+[a-z]/g,
  },
  {
    name: "Comma splice",
    regex: /\w+,\s+[a-z]/g,
  },
  {
    name: "Misused apostrophe",
    regex: /\b(\w+)('s)\b(?!\s+(?:is|has|was|does))/i,
  },
  {
    name: "Split infinitive",
    regex: /\bto\s+(\w+ly\s+)+\w+\b/i,
  },
  {
    name: "Ending sentence with preposition",
    regex: /\b(at|by|for|from|in|of|on|to|with)\s*[.!?]$/i,
  },
  {
    name: "Misused 'their/there/they're'",
    regex: /\b(their|there|they're)\b/i,
  },
  {
    name: "Misused 'your/you're'",
    regex: /\b(your|you're)\b/i,
  },
  {
    name: "Misused 'its/it's'",
    regex: /\b(its|it's)\b/i,
  },
  {
    name: "Passive voice",
    regex: /\b(?:am|is|are|was|were|be|been|being)\s+(\w+ed|[^aeiou\s]+en)\b/i,
  },
  {
    name: "Redundant phrases",
    regex:
      /\b(absolutely essential|advance planning|basic fundamentals|close proximity|completely filled|end result|free gift|future plans|past history|revert back|unexpected surprise)\b/i,
  },
  {
    name: "Misplaced modifier",
    regex: /\b(only|just|nearly|almost|hardly)\b(?!\s+(?:the|a|an|[A-Z]))/i,
  },
  {
    name: "Incorrect comparative/superlative",
    regex: /\b(more|most)\s+(\w+(?:er|est))\b|\b(\w+er|est)\s+(than)\b/i,
  },
  {
    name: "Misused 'who/whom'",
    regex: /\b(who|whom)\b/i,
  },
  {
    name: "Incorrect use of 'myself'",
    regex: /\b(I|me)\s+and\s+myself\b|\bmyself\s+and\s+(I|me)\b/i,
  },
  {
    name: "Misused 'affect/effect'",
    regex: /\b(affect|effect)\b/i,
  },
  {
    name: "Misused 'fewer/less'",
    regex: /\b(fewer|less)\b/i,
  },
  {
    name: "Misused 'lie/lay'",
    regex: /\b(lie|lay|lied|laid|lying|laying)\b/i,
  },
  {
    name: "Misused 'accept/except'",
    regex: /\b(accept|except)\b/i,
  },
  {
    name: "Misused 'all ready/already'",
    regex: /\b(all ready|already)\b/i,
  },
  {
    name: "Misused 'all together/altogether'",
    regex: /\b(all together|altogether)\b/i,
  },
  {
    name: "Misused 'assure/ensure/insure'",
    regex: /\b(assure|ensure|insure)\b/i,
  },
  {
    name: "Misused 'by/buy/bye'",
    regex: /\b(by|buy|bye)\b/i,
  },
  {
    name: "Misused 'council/counsel'",
    regex: /\b(council|counsel)\b/i,
  },
  {
    name: "Misused 'disinterested/uninterested'",
    regex: /\b(disinterested|uninterested)\b/i,
  },
  {
    name: "Misused 'farther/further'",
    regex: /\b(farther|further)\b/i,
  },
  {
    name: "Misused 'for/since'",
    regex: /\b(for|since)\b(?=\s*\d+(?:\s*(?:years|months|days)))/i,
  },
  {
    name: "Misused 'its'/it's in possessive form",
    regex: /\b(\w+)('s)\b(?=\s*(?:is|has|was|does))/i,
  },
  {
    name: "Misused 'lead/led'",
    regex: /\b(lead|led)\b/i,
  },
  {
    name: "Misused 'loose/lose'",
    regex: /\b(loose|lose)\b/i,
  },
  {
    name: "Misused 'peace/piece'",
    regex: /\b(peace|piece)\b/i,
  },
  {
    name: "Misused 'quiet/quite'",
    regex: /\b(quiet|quite)\b/i,
  },
  {
    name: "Misused 'site/sight/cite'",
    regex: /\b(site|sight|cite)\b/i,
  },
  {
    name: "Misused 'to/two/too'",
    regex: /\b(to|two|too)\b/i,
  },
  {
    name: "Misused 'whether/if'",
    regex: /\b(whether|if)\b(?=\s*(?:or not))/i,
  },
  // Tense Consistency
  {
    name: "Inconsistent verb tense",
    regex:
      /\b(?:was|were|had been)\s+\w+\s+\b(?:is|are|has been)\b|\b(?:is|are|has been)\s+\w+\s+\b(?:was|were|had been)\b/i,
  },
  // Parallel Structure
  {
    name: "Lack of parallel structure",
    regex:
      /\b(?:I went to the store, and she went to the park)\b|\b(?:He likes reading books, but she likes watching movies)\b/i,
  },
  // Active Voice Preference
  {
    name: "Overuse of passive voice",
    regex:
      /\b(?:The ball was thrown by John)\b|\b(?:The play was written by Shakespeare)\b/i,
  },
  // Redundant Words
  {
    name: "Redundant words",
    regex:
      /\b(?:end result|free gift|new innovation|personal opinion|final decision)\b/i,
  },
  // Adverb Overuse
  {
    name: "Overuse of adverbs",
    regex: /\b(?:very|really|extremely|highly|completely)\s+\w+\b/i,
  },
  // Sentence Fragment
  {
    name: "Sentence fragment",
    regex: /^(?!(?:[A-Z]|I)).*?[.!?]$/gm,
  },
  // Double Conjunctions
  {
    name: "Double conjunctions",
    regex: /\b(and|but|or)\s+(and|but|or)\b/i,
  },
  // Inconsistent Capitalization
  {
    name: "Inconsistent capitalization",
    regex: /\b([a-z])([A-Z])/g,
  },
  {
    name: "Missing article",
    regex: /\b(a|an|the)\s*(?:is|are|was|were|has|have|had)\b/i,
  },
  {
    name: "Incorrect use of 'who's/whom's'",
    regex: /\b(who's|whom's)\b/i,
  },
  {
    name: "Misused 'all ready/already'",
    regex: /\b(all ready|already)\b/i,
  },
  {
    name: "Misused 'all together/altogether'",
    regex: /\b(all together|altogether)\b/i,
  },
  {
    name: "Misused 'assure/ensure/insure'",
    regex: /\b(assure|ensure|insure)\b/i,
  },
  {
    name: "Misused 'by/buy/bye'",
    regex: /\b(by|buy|bye)\b/i,
  },
  {
    name: "Misused 'council/counsel'",
    regex: /\b(council|counsel)\b/i,
  },
  {
    name: "Misused 'disinterested/uninterested'",
    regex: /\b(disinterested|uninterested)\b/i,
  },
  {
    name: "Misused 'farther/further'",
    regex: /\b(farther|further)\b/i,
  },
  {
    name: "Misused 'for/since'",
    regex: /\b(for|since)\b(?=\s*\d+(?:\s*(?:years|months|days)))/i,
  },
  {
    name: "Misused 'lead/led'",
    regex: /\b(lead|led)\b/i,
  },
  {
    name: "Misused 'loose/lose'",
    regex: /\b(loose|lose)\b/i,
  },
  {
    name: "Misused 'peace/piece'",
    regex: /\b(peace|piece)\b/i,
  },
  {
    name: "Misused 'quiet/quite'",
    regex: /\b(quiet|quite)\b/i,
  },
  {
    name: "Misused 'site/sight/cite'",
    regex: /\b(site|sight|cite)\b/i,
  },
  {
    name: "Misused 'to/two/too'",
    regex: /\b(to|two|too)\b/i,
  },
  {
    name: "Misused 'whether/if'",
    regex: /\b(whether|if)\b(?=\s*(?:or not))/i,
  },
  // Tense Consistency
  {
    name: "Inconsistent verb tense",
    regex:
      /\b(?:was|were|had been)\s+\w+\s+\b(?:is|are|has been)\b|\b(?:is|are|has been)\s+\w+\s+\b(?:was|were|had been)\b/i,
  },
  // Parallel Structure
  {
    name: "Lack of parallel structure",
    regex:
      /\b(?:I went to the store, and she went to the park)\b|\b(?:He likes reading books, but she likes watching movies)\b/i,
  },
  // Active Voice Preference
  {
    name: "Overuse of passive voice",
    regex:
      /\b(?:The ball was thrown by John)\b|\b(?:The play was written by Shakespeare)\b/i,
  },
  // Redundant Words
  {
    name: "Redundant words",
    regex:
      /\b(?:end result|free gift|new innovation|personal opinion|final decision)\b/i,
  },
  // Adverb Overuse
  {
    name: "Overuse of adverbs",
    regex: /\b(?:very|really|extremely|highly|completely)\s+\w+\b/i,
  },
  // Sentence Fragment
  {
    name: "Sentence fragment",
    regex: /^(?!(?:[A-Z]|I)).*?[.!?]$/gm,
  },
  // Double Conjunctions
  {
    name: "Double conjunctions",
    regex: /\b(and|but|or)\s+(and|but|or)\b/i,
  },
  // Inconsistent Capitalization
  {
    name: "Inconsistent capitalization in titles",
    regex: /\b([A-Z][a-z]*\s+[a-z][A-Z])/g,
  },
  {
    name: "Incorrect capitalization after punctuation",
    regex: /([.!?])\s+([a-z])/g,
  },
  {
    name: "Missing capitalization at the beginning of a sentence",
    regex: /^([a-z])/gm,
  },
  {
    name: "Incorrect capitalization in proper nouns",
    regex: /\b([a-z]+)\s+([A-Z][a-z]*)\b/g,
  },
  {
    name: "Inconsistent capitalization in headings",
    regex: /\b([A-Z][a-z]*\s+[A-Z][a-z]*)\b/g,
  },
  {
    name: "Incorrect capitalization in titles of works",
    regex: /\b([A-Z][a-z]*\s+[A-Z][a-z]*)\b/g,
  },
  {
    name: "Missing capitalization in acronyms",
    regex: /\b([a-z]{2,})\b/g,
  },
  {
    name: "Incorrect capitalization in brand names",
    regex: /\b([a-z]+)\s+([A-Z][a-z]*)\b/g,
  },
  {
    name: "Inconsistent capitalization in names",
    regex: /\b([A-Z][a-z]*\s+[A-Z][a-z]*)\b/g,
  },
  {
    name: "Incorrect capitalization after colons",
    regex: /(:)\s+([a-z])/g,
  },
];

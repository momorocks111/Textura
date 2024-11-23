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
];

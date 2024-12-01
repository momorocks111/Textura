"use strict";

import { StoryTextAnalyzer } from "./story_text_analyzer.js";
import { GrammarChecker } from "./grammar_checker.js";
import { storyElements } from "../archive/story_elements.js";

// export class StoryGenerator {
//   constructor() {
//     this.analyzer = new StoryTextAnalyzer();
//     this.grammarChecker = new GrammarChecker();

//     // Define story templates for different genres
//     this.storyTemplates = {
//       romance:
//         "{transition} In {setting}, {character1} and {character2} found themselves drawn together. {risingAction} As their {descriptor} relationship deepened, {climax}. In the end, {resolution}.",
//       mystery:
//         "{transition} The {descriptor} town of {setting} was shaken when {character1} discovered {risingAction}. As the investigation deepened, {climax}. Finally, {resolution}.",
//       adventure:
//         "{transition} {character1} always dreamed of exploring {setting}. One day, {risingAction}. Along the {descriptor} journey, {climax}. At last, {resolution}.",
//       sciFi:
//         "{transition} In the year {setting}, {character1} stumbled upon a technology that changed everything. As the implications became clear, {climax}. The world would never be the same as {resolution}.",
//       fantasy:
//         "{transition} In the magical realm of {setting}, {character1} discovered they had a unique power. As dark forces gathered, {climax}. In an epic conclusion, they achieved their goal of {resolution}.",
//       horror:
//         "{transition} It all began when {character1} moved to {setting}. Strange occurrences followed. Terror struck when {climax}. In the aftermath, they found resolution in fear.",
//       comedy:
//         "{transition} Life in {setting} was pretty normal for {character1}, until one day everything changed with a funny twist. As their situation escalated into chaos, they learned to laugh it off.",
//       drama:
//         "{transition} In a small town called {setting}, everything changed for {character1}. As tensions rose during the conflict, they learned valuable lessons about life and relationships.",
//     };
//   }

//   generateStory(inputText) {
//     const analysis = this.analyzer.analyzeText(inputText);
//     const genre = analysis.suggestedGenre;
//     let storyTemplate = this.storyTemplates[genre] || this.storyTemplates.drama;

//     // Replace placeholders with actual data from analysis
//     storyTemplate = this.replacePlaceholders(storyTemplate, analysis);

//     // Polish and check grammar before returning the final story
//     return this.polishAndCheckGrammar(storyTemplate);
//   }

//   replacePlaceholders(storyTemplate, analysis) {
//     const getRandomElement = (arr) =>
//       arr[Math.floor(Math.random() * arr.length)];

//     const replacements = {
//       "{setting}":
//         analysis.settingIndications[0] ||
//         getRandomElement(storyElements.settings),
//       "{character1}":
//         analysis.characterAnalysis[0]?.name ||
//         getRandomElement(storyElements.characters),
//       "{character2}":
//         analysis.characterAnalysis[1]?.name ||
//         getRandomElement(storyElements.characters),
//       "{risingAction}": `${getRandomElement(storyElements.actions)}.`,
//       "{climax}": getRandomElement(storyElements.plotPoints),
//       "{resolution}": `${getRandomElement(storyElements.actions)}.`,
//       "{transition}": getRandomElement(storyElements.transitions),
//       "{descriptor}": getRandomElement(storyElements.descriptors),
//     };

//     return Object.entries(replacements).reduce(
//       (accumulator, [key, value]) =>
//         accumulator.replace(new RegExp(key, "g"), value),
//       storyTemplate
//     );
//   }

//   polishAndCheckGrammar(storyTemplate) {
//     // Basic polishing
//     storyTemplate = storyTemplate.replace(/\s+/g, " ").trim();
//     storyTemplate = storyTemplate.replace(/\s+([.,!?])/g, "$1");

//     // Ensure proper sentence structure
//     if (!storyTemplate.match(/[.!?]$/)) {
//       storyTemplate += ".";
//     }

//     // Apply grammar checking
//     return this.grammarChecker.checkGrammar(storyTemplate);
//   }
// }

export class StoryGenerator {
  generateStory(analysis) {
    const { mainCharacter, setting, goal, challenges, emotions, themes } =
      analysis;
    const challengeDescription = this.describeChallenges(challenges);
    const emotionDescription = this.describeEmotions(emotions);
    const themeDescription = themes[0]
      ? `In a world where ${themes[0]} was paramount`
      : "In a world full of challenges";

    return `
      ${themeDescription}, ${mainCharacter} embarked on a journey to ${goal} in ${setting}.
      ${challengeDescription}
      ${emotionDescription}
      Despite the odds, ${mainCharacter} knew they had to persevere. 
      With unwavering determination, they set out to overcome these challenges, 
      one step at a time, hoping to turn their dream into reality.
    `
      .replace(/\s+/g, " ")
      .trim();
  }

  describeChallenges(challenges) {
    if (challenges.length === 0)
      return "They faced numerous obstacles along the way.";
    if (challenges.length === 1)
      return `They encountered a significant hurdle: ${challenges[0]}`;
    return `They faced multiple challenges: ${challenges.join(" Moreover, ")}`;
  }

  describeEmotions(emotions) {
    const descriptions = [];
    if (emotions.determination)
      descriptions.push("A fierce determination burned within them.");
    if (emotions.fear)
      descriptions.push(
        "Fear gnawed at their resolve, but they pushed forward."
      );
    if (emotions.excitement)
      descriptions.push(
        "Excitement coursed through their veins at the prospect of their adventure."
      );
    if (emotions.doubt)
      descriptions.push(
        "Doubts crept in, but they refused to let them take hold."
      );
    return descriptions.join(" ");
  }
}

"use strict";

import { storyElements } from "../archive/story_elements.js";

export class StoryConstructor {
  constructStory(plot, textAnalysis, themes) {
    const storyParts = [];
    const { entities, tokens } = textAnalysis;
    const mainCharacter = entities[0] || "The protagonist";

    storyParts.push(
      this.generateIntroduction(mainCharacter, plot.conflict, themes[0])
    );

    plot.storyArc.forEach((arc, index) => {
      storyParts.push(
        this.generateStoryPart(arc, mainCharacter, themes[index], tokens)
      );
    });

    storyParts.push(
      this.generateConclusion(
        mainCharacter,
        plot.conflict,
        themes[themes.length - 1]
      )
    );

    return storyParts.join(" ");
  }

  generateIntroduction(character, conflict, theme) {
    return `${character} was facing a significant challenge in life: ${conflict.description}. This ${theme} was causing immense stress and uncertainty.`;
  }

  generateStoryPart(arc, character, theme, tokens) {
    const relevantTokens = tokens.filter((token) =>
      token.toLowerCase().includes(theme)
    );
    const action =
      storyElements.actions[
        Math.floor(Math.random() * storyElements.actions.length)
      ];
    return `As the ${
      arc.stage
    } unfolded, ${character} had to ${action} through ${theme}. ${this.generateSentence(
      relevantTokens
    )}`;
  }

  generateConclusion(character, conflict, theme) {
    return `In the end, ${character} managed to overcome the ${conflict.type} conflict. Through perseverance and growth, they found resolution in ${theme}.`;
  }

  generateSentence(tokens, length = 8) {
    return (
      tokens
        .sort(() => 0.5 - Math.random())
        .slice(0, length)
        .join(" ") + "."
    );
  }
}

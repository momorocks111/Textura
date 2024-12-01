"use strict";

import { storyElements } from "../archive/story_elements.js";
import { grammarRules } from "../archive/grammar_rules.js";
import { StoryElementExtractor } from "./story_element_extractor.js";
import { StoryRefiner } from "./story_refiner.js";

export class StoryGenerator {
  constructor(inputText) {
    this.inputText = inputText;
    this.extractor = new StoryElementExtractor(inputText);
    this.extractElements = this.extractor.extractElements();
    this.refiner = new StoryRefiner();
  }

  generateStory() {
    const storyStructure = this.createStoryStructure();
    const rawStory = this.fillStoryStructure(storyStructure);
    return this.refiner.refineStory(rawStory);
  }

  createStoryStructure() {
    return [
      { type: "setting", content: "" },
      { type: "character_intro", content: "" },
      { type: "conflict", content: "" },
      { type: "rising_action", content: "" },
      { type: "climax", content: "" },
      { type: "resolution", content: "" },
    ];
  }

  fillStoryStructure(structure) {
    return structure
      .map((section) => {
        switch (section.type) {
          case "setting":
            return this.generateSetting();
          case "character_intro":
            return this.introduceCharacters();
          case "conflict":
            return this.generateConflict();
          case "rising_action":
            return this.generateRisingAction();
          case "climax":
            return this.generateClimax();
          case "resolution":
            return this.generateResolution();
          default:
            return "";
        }
      })
      .join(" ");
  }

  generateSetting() {
    const setting =
      this.extractElements.settings[0] ||
      this.getRandomElement(storyElements.settings);
    return `In the ${setting}, ${this.getRandomElement(
      storyElements.descriptors
    )} ${this.getRandomElement(storyElements.characters)} lived.`;
  }

  introduceCharacters() {
    const characters =
      this.extractElements.characters.length > 0
        ? this.extractElements.characters
        : [
            this.getRandomElement(storyElements.characters),
            this.getRandomElement(storyElements.characters),
          ];
    return `${characters[0]} and ${
      characters[1]
    } were known for their ${this.getRandomElement(
      storyElements.descriptors
    )} adventures.`;
  }

  generateConflict() {
    const action = this.getRandomElement(storyElements.actions);
    return `One day, they decided to ${action} the ${this.getRandomElement(
      storyElements.descriptors
    )} ${this.getRandomElement(storyElements.settings)}.`;
  }

  generateRisingAction() {
    const obstacle = this.getRandomElement(storyElements.plotPoints);
    return `However, they encountered ${obstacle} which made their task more challenging.`;
  }

  generateClimax() {
    const action = this.getRandomElement(storyElements.actions);
    return `In a moment of brilliance, they managed to ${action} despite the odds.`;
  }

  generateResolution() {
    return `In the end, they celebrated their ${this.getRandomElement(
      storyElements.descriptors
    )} victory, having learned valuable lessons about teamwork and perseverance.`;
  }

  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

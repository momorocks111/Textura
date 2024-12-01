"use strict";

import { storyElements } from "../archive/story_elements.js";

export class PlotGenerator {
  generatePlot(themes) {
    const storyArc = this.createStoryArc(themes);
    const conflict = this.generateConflict(themes);
    const characterDevelopment = this.designCharacterDevelopment(themes);

    return { storyArc, conflict, characterDevelopment };
  }

  createStoryArc(themes) {
    return [
      { stage: "exposition", theme: themes[0] },
      { stage: "rising_action", theme: themes[1] },
      { stage: "climax", theme: themes[2] },
      { stage: "falling_action", theme: themes[3] },
      { stage: "resolution", theme: themes[4] },
    ];
  }

  generateConflict(themes) {
    return {
      type: "man_vs_nature",
      description: `${themes[0]} against ${themes[1]}`,
    };
  }

  designCharacterDevelopment(themes) {
    const mainCharacter = storyElements.characters[0];
    return {
      character: mainCharacter,
      arc: [
        { stage: "beginning", trait: storyElements.descriptors[0] },
        { stage: "middle", trait: storyElements.descriptors[1] },
        { stage: "end", trait: storyElements.descriptors[2] },
      ],
    };
  }
}

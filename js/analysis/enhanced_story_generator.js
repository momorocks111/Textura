"use strict";

import { AdvancedTextAnalyzer } from "./advance_text_analyzer.js";
import { ThemeExtractor } from "./theme_extractor.js";
import { PlotGenerator } from "./plot_generator.js";
import { StoryConstructor } from "./story_constructor.js";
import { GrammarChecker } from "./grammar_checker.js";

export class EnhancedStoryGenerator {
  constructor(inputText) {
    this.inputText = inputText;
    this.analyzer = new AdvancedTextAnalyzer();
    this.themeExtractor = new ThemeExtractor();
    this.plotGenerator = new PlotGenerator();
    this.storyConstructor = new StoryConstructor();
    this.grammarChecker = new GrammarChecker();
  }

  generateStory() {
    const textAnalysis = this.analyzer.analyzeText(this.inputText);
    const themes = this.themeExtractor.extractThemes(textAnalysis);
    const plot = this.plotGenerator.generatePlot(themes, textAnalysis.entities);
    const rawStory = this.storyConstructor.constructStory(
      plot,
      textAnalysis,
      themes
    );
    const checkedStory = this.grammarChecker.checkGrammar(rawStory);
    return checkedStory;
  }
}

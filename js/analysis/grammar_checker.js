import { grammarRules } from "../archive/grammar_rules.js";

export class GrammarChecker {
  checkGrammar(story) {
    let refinedStory = story;
    grammarRules.forEach((rule) => {
      refinedStory = refinedStory.replace(rule.regex, (match) =>
        this.applyCorrection(match, rule)
      );
    });
    return this.ensureStyleConsistency(refinedStory);
  }

  applyCorrection(match, rule) {
    switch (rule.name) {
      case "Double negatives":
        return this.fixDoubleNegative(match);
      case "Subject-verb agreement":
        return this.fixSubjectVerbAgreement(match);
      case "Run-on sentence":
        return this.fixRunOnSentence(match);
      case "Comma splice":
        return this.fixCommaSplice(match);
      case "Misused apostrophe":
        return this.fixMisusedApostrophe(match);
      case "Split infinitive":
        return this.fixSplitInfinitive(match);
      case "Ending sentence with preposition":
        return this.fixEndingPreposition(match);
      case "Passive voice":
        return this.fixPassiveVoice(match);
      case "Redundant phrases":
        return this.fixRedundantPhrase(match);
      case "Misplaced modifier":
        return this.fixMisplacedModifier(match);
      case "Sentence fragment":
        return this.fixSentenceFragment(match);
      case "Double conjunctions":
        return this.fixDoubleConjunctions(match);
      case "Incorrect capitalization after punctuation":
        return this.fixCapitalizationAfterPunctuation(match);
      case "Missing capitalization at the beginning of a sentence":
        return this.fixMissingInitialCapitalization(match);
      case "Dangling modifier":
        return this.fixDanglingModifier(match);
      case "Misused 'their/there/they're'":
        return this.fixTheirThereTheyre(match);
      case "Misused 'your/you're'":
        return this.fixYourYoure(match);
      case "Misused 'its/it's'":
        return this.fixItsIts(match);
      case "Incorrect comparative/superlative":
        return this.fixComparativeSuperlative(match);
      case "Misused 'who/whom'":
        return this.fixWhoWhom(match);
      case "Incorrect use of 'myself'":
        return this.fixIncorrectMyself(match);
      case "Misused 'affect/effect'":
        return this.fixAffectEffect(match);
      case "Misused 'fewer/less'":
        return this.fixFewerLess(match);
      case "Misused 'lie/lay'":
        return this.fixLieLay(match);
      case "Inconsistent verb tense":
        return this.fixInconsistentTense(match);
      case "Lack of parallel structure":
        return this.fixParallelStructure(match);
      case "Overuse of adverbs":
        return this.fixAdverbOveruse(match);
      case "Misused 'accept/except'":
        return this.fixAcceptExcept(match);
      case "Misused 'all ready/already'":
        return this.fixAllReadyAlready(match);
      case "Misused 'all together/altogether'":
        return this.fixAllTogetherAltogether(match);
      case "Misused 'assure/ensure/insure'":
        return this.fixAssureEnsureInsure(match);
      case "Misused 'by/buy/bye'":
        return this.fixByBuyBye(match);
      case "Misused 'council/counsel'":
        return this.fixCouncilCounsel(match);
      case "Misused 'disinterested/uninterested'":
        return this.fixDisinterestedUninterested(match);
      case "Misused 'farther/further'":
        return this.fixFartherFurther(match);
      case "Misused 'for/since'":
        return this.fixForSince(match);
      case "Misused 'lead/led'":
        return this.fixLeadLed(match);
      case "Misused 'loose/lose'":
        return this.fixLooseLose(match);
      case "Misused 'peace/piece'":
        return this.fixPeacePiece(match);
      case "Misused 'quiet/quite'":
        return this.fixQuietQuite(match);
      case "Misused 'site/sight/cite'":
        return this.fixSiteSightCite(match);
      case "Misused 'to/two/too'":
        return this.fixToTwoToo(match);
      case "Misused 'whether/if'":
        return this.fixWhetherIf(match);
      case "Overuse of passive voice":
        return this.fixPassiveVoiceOveruse(match);
      case "Redundant words":
        return this.fixRedundantWords(match);
      case "Inconsistent capitalization":
        return this.fixInconsistentCapitalization(match);
      case "Missing article":
        return this.fixMissingArticle(match);
      case "Incorrect use of 'who's/whom's'":
        return this.fixWhosWhoms(match);
      default:
        return this.capitalizeAndPunctuate(match);
    }
  }

  fixDoubleNegative(match) {
    return match.replace(/\b(?:not|never)\b/i, "");
  }

  fixSubjectVerbAgreement(match) {
    const [subject, verb] = match.split(/\s+/);
    const correctedVerb = subject.toLowerCase() === "i" ? "am" : "is";
    return `${subject} ${correctedVerb}`;
  }

  fixRunOnSentence(match) {
    return match.replace(/\s+/, ". ");
  }

  fixCommaSplice(match) {
    return match.replace(",", ";");
  }

  fixMisusedApostrophe(match) {
    return match.replace(/'s/, "");
  }

  fixSplitInfinitive(match) {
    const words = match.split(/\s+/);
    return `to ${words[words.length - 1]} ${words.slice(1, -1).join(" ")}`;
  }

  fixEndingPreposition(match) {
    return match.slice(0, -1) + ".";
  }

  fixPassiveVoice(match) {
    const words = match.split(/\s+/);
    return `${words[words.length - 1]} ${words.slice(0, -1).join(" ")}`;
  }

  fixRedundantPhrase(match) {
    const redundantPhrases = {
      "absolutely essential": "essential",
      "advance planning": "planning",
      "basic fundamentals": "fundamentals",
      "close proximity": "near",
      "completely filled": "filled",
      "end result": "result",
      "free gift": "gift",
      "future plans": "plans",
      "past history": "history",
      "revert back": "revert",
      "unexpected surprise": "surprise",
    };
    return redundantPhrases[match.toLowerCase()] || match;
  }

  fixMisplacedModifier(match) {
    const [modifier, ...rest] = match.split(/\s+/);
    return `${rest.join(" ")} ${modifier}`;
  }

  fixSentenceFragment(match) {
    return `It is notable that ${match.toLowerCase()}`;
  }

  fixDoubleConjunctions(match) {
    return match.replace(/\s+(and|but|or)\b/, "");
  }

  fixCapitalizationAfterPunctuation(match) {
    return match[0] + " " + match[2].toUpperCase();
  }

  fixMissingInitialCapitalization(match) {
    return match[0].toUpperCase() + match.slice(1);
  }

  capitalizeAndPunctuate(sentence) {
    return (
      sentence.charAt(0).toUpperCase() +
      sentence.slice(1) +
      (sentence.endsWith(".") ? "" : ".")
    );
  }

  ensureStyleConsistency(story) {
    // Ensure consistent tense (past tense in this case)
    story = story.replace(/\b(is|are|has been|have been)\b/g, (match) => {
      const pastTense = {
        is: "was",
        are: "were",
        "has been": "had been",
        "have been": "had been",
      };
      return pastTense[match];
    });

    // Ensure consistent point of view (third person in this case)
    story = story.replace(/\b(I|we|you)\b/g, "they");

    return story;
  }

  fixDanglingModifier(match) {
    return `The subject ${match}`;
  }

  fixTheirThereTheyre(match) {
    const corrections = {
      their: "there",
      there: "their",
      "they're": "their",
    };
    return corrections[match.toLowerCase()] || match;
  }

  fixYourYoure(match) {
    return match.toLowerCase() === "your" ? "you're" : "your";
  }

  fixItsIts(match) {
    return match === "its" ? "it's" : "its";
  }

  fixComparativeSuperlative(match) {
    const words = match.split(/\s+/);
    if (words[0] === "more" || words[0] === "most") {
      return words[1];
    }
    return `${words[0]}er`;
  }

  fixWhoWhom(match) {
    return match.toLowerCase() === "who" ? "whom" : "who";
  }

  fixIncorrectMyself(match) {
    return match.replace("myself", "me");
  }

  fixAffectEffect(match) {
    return match.toLowerCase() === "affect" ? "effect" : "affect";
  }

  fixFewerLess(match) {
    return match.toLowerCase() === "fewer" ? "less" : "fewer";
  }

  fixLieLay(match) {
    const corrections = {
      lie: "lay",
      lay: "lie",
      lied: "laid",
      laid: "lied",
      lying: "laying",
      laying: "lying",
    };
    return corrections[match.toLowerCase()] || match;
  }

  fixInconsistentTense(match) {
    const words = match.split(/\s+/);
    const pastTense = { is: "was", are: "were", has: "had" };
    return `${pastTense[words[0]] || words[0]} ${words.slice(1).join(" ")}`;
  }

  fixParallelStructure(match) {
    const parts = match.split(/,\s*|\s+and\s+/);
    const firstVerb = parts[0].match(/\b(\w+ing|\w+s)\b/);
    if (firstVerb) {
      return parts
        .map((part) => part.replace(/\b(\w+ing|\w+s)\b/, firstVerb[0]))
        .join(", ");
    }
    return match;
  }

  fixAdverbOveruse(match) {
    const adverbs = ["very", "really", "extremely", "highly", "completely"];
    return match.replace(new RegExp(`\\b(${adverbs.join("|")})\\s+`, "i"), "");
  }

  fixAcceptExcept(match) {
    return match.toLowerCase() === "accept" ? "except" : "accept";
  }

  fixAllReadyAlready(match) {
    return match.toLowerCase() === "all ready" ? "already" : "all ready";
  }

  fixAllTogetherAltogether(match) {
    return match.toLowerCase() === "all together"
      ? "altogether"
      : "all together";
  }

  fixAssureEnsureInsure(match) {
    const corrections = {
      assure: "ensure",
      ensure: "insure",
      insure: "assure",
    };
    return corrections[match.toLowerCase()] || match;
  }

  fixByBuyBye(match) {
    const corrections = {
      by: "buy",
      buy: "bye",
      bye: "by",
    };
    return corrections[match.toLowerCase()] || match;
  }

  fixCouncilCounsel(match) {
    return match.toLowerCase() === "council" ? "counsel" : "council";
  }

  fixDisinterestedUninterested(match) {
    return match.toLowerCase() === "disinterested"
      ? "uninterested"
      : "disinterested";
  }

  fixFartherFurther(match) {
    return match.toLowerCase() === "farther" ? "further" : "farther";
  }

  fixForSince(match) {
    return match.toLowerCase() === "for" ? "since" : "for";
  }

  fixLeadLed(match) {
    return match.toLowerCase() === "lead" ? "led" : "lead";
  }

  fixLooseLose(match) {
    return match.toLowerCase() === "loose" ? "lose" : "loose";
  }

  fixPeacePiece(match) {
    return match.toLowerCase() === "peace" ? "piece" : "peace";
  }

  fixQuietQuite(match) {
    return match.toLowerCase() === "quiet" ? "quite" : "quiet";
  }

  fixSiteSightCite(match) {
    const corrections = {
      site: "sight",
      sight: "cite",
      cite: "site",
    };
    return corrections[match.toLowerCase()] || match;
  }

  fixToTwoToo(match) {
    const corrections = {
      to: "two",
      two: "too",
      too: "to",
    };
    return corrections[match.toLowerCase()] || match;
  }

  fixWhetherIf(match) {
    return match.toLowerCase() === "whether" ? "if" : "whether";
  }

  fixPassiveVoiceOveruse(match) {
    const parts = match.split(" ");
    return `${parts[parts.length - 1]} ${parts.slice(0, -1).join(" ")}`;
  }

  fixRedundantWords(match) {
    const redundantPairs = {
      "end result": "result",
      "free gift": "gift",
      "new innovation": "innovation",
      "personal opinion": "opinion",
      "final decision": "decision",
    };
    return redundantPairs[match.toLowerCase()] || match;
  }

  fixInconsistentCapitalization(match) {
    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
  }

  fixMissingArticle(match) {
    return `a ${match}`;
  }

  fixWhosWhoms(match) {
    return match.toLowerCase() === "who's" ? "whose" : "who's";
  }
}

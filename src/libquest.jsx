import { Story } from 'inkjs';

const defaultCharacter = 'ada';
const userCharacter = 'user';
const mainCharacterRegex = /main character: (.*)/;
const lineCharacterRegex = /character: (.*)/;

const extractInfoFromTags = (tags, regex, defaultValue = null) => {
  if (!tags) return defaultValue;
  const tag = tags.find((t) => regex.test(t));
  if (!tag) return defaultValue;
  return tag.match(regex)[1];
};

const extractMainCharacter = (globalTags) => (
  extractInfoFromTags(globalTags, mainCharacterRegex, defaultCharacter)
);

const extractLineCharacter = (currentTags) => (
  extractInfoFromTags(currentTags, lineCharacterRegex, null)
);

const extractWaitForVariables = (choiceText) => {
  const result = choiceText.match(/\(wait for: (.*)\)/);
  if (!result) return [];
  return result[1].split(' ');
};

export default class Quest {
  constructor(questContent) {
    this.story = new Story(questContent);
    this.mainCharacter = extractMainCharacter(this.story.globalTags);
    this.dialogueId = 0;
    this.waitFor = {};
  }

  getNextDialogue(character = null) {
    const text = this.story.Continue();
    if (text.trim()) {
      return {
        id: this.dialogueId,
        text,
        character: character
                || extractLineCharacter(this.story.currentTags)
                || this.mainCharacter,
      };
    }
    return null;
  }

  continueStory() {
    let dialogue = [];

    // We assume that the next text is the user answer (except for
    // the very first one):
    if (this.dialogueId !== 0 && this.story.canContinue) {
      const d = this.getNextDialogue(userCharacter);
      if (d) {
        dialogue = [...dialogue, d];
        this.dialogueId += 1;
      }
    }

    while (this.story.canContinue) {
      const d = this.getNextDialogue();
      if (d) {
        dialogue = [...dialogue, d];
        this.dialogueId += 1;
      }
    }

    let choices = [];
    this.waitFor = {};
    this.story.currentChoices.forEach((c) => {
      const waitForVariables = extractWaitForVariables(c.text);
      if (!waitForVariables.length) {
        choices = [...choices, c];
      }
      waitForVariables.forEach((variable) => {
        this.waitFor = { ...this.waitFor, ...{ [variable]: c } };
      });
    });

    return { dialogue, choices };
  }

  choose(choice) {
    this.story.ChooseChoiceIndex(choice.index);
  }

  doUpdateStoryVariable(name, newValue) {
    this.story.variablesState[name] = newValue;
    if (name in this.waitFor) {
      this.choose(this.waitFor[name]);
    }
  }

  updateStoryVariable(name, newValue) {
    let convertedValue = newValue;

    // Ink stores booleans as 0 (false) / 1 (true). So we convert
    // boolean to int:
    if (typeof newValue === 'boolean') {
      convertedValue = newValue ? 1 : 0;
    }

    if (this.story.variablesState[name] !== convertedValue) {
      this.doUpdateStoryVariable(name, convertedValue);
    }
  }
}
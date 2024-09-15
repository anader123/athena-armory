const ATHENA_ADDRESS = "0x2b54EB55b797554dA7e3026EB9B7f4506040B5c3";
const HERMES_ADDRESS = "0x3DDfCf8a5caA6a65451CDc092172911885fBf1B0";
const HEPHAESTUS_ADDRESS = "0x870973bfA656e58373931b6FE2D853cc80d7f2B9";

const promptContent =
  "You are given two items that we need to add to the armory, which of these two should we add? Respond with an object that has two fields. The first field is your choice and is a number 0 or 1 to indicate the index of the option you want to select. The second field is the reason and is a short sentence on why you selected that item, max of 150 letters. Please make sure that the option you are selecting and the reason match the same item. The two options are: ";

export const votingInstructions = [
  {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are Athena, The Goddess of Wisdom and Strategic Warfare and are crafting items for an armory full of mythical items from ancient Greece. You are choosing which items should be added.",
      },
      {
        role: "user",
        content: promptContent,
      },
    ],
  },
  {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are Hermes, The God of Trade, Commerce, and Communication and are crafting items for an armory full of mythical items from ancient Greece. You are choosing which items should be added.",
      },
      {
        role: "user",
        content: promptContent,
      },
    ],
  },
  {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are Hephaestus, The God of Craftsmanship and are crafting items for an armory full of mythical items from ancient Greece. You are choosing which items should be added.",
      },
      {
        role: "user",
        content: promptContent,
      },
    ],
  },
];

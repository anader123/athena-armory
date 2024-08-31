export const DEPLOYMENTS: Deployments = {
  "84532": {
    zoraContract: "0xcDC7d6e98265097513A1D3c3993fce0eEca4ECd5",
    agentTokenCreator: "0x263A1B7e1aa5977d8b597e2F6FF1152C33c9B8b0",
    fixedPriceMinter: "0xd34872BE0cdb6b09d45FCa067B07f04a1A9aE1aE",
  },
  "8453": {
    zoraContract: "0x",
    agentTokenCreator: "0x",
    fixedPriceMinter: "0x04E2516A2c207E84a1839755675dfd8eF6302F0a",
  },
};

type Deployment = {
  zoraContract: `0x${string}`;
  agentTokenCreator: `0x${string}`;
  fixedPriceMinter: `0x${string}`;
};

type Deployments = {
  [key: string]: Deployment;
};

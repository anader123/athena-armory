export const DEPLOYMENTS: Deployments = {
  "84532": {
    zoraContract: "0xcDC7d6e98265097513A1D3c3993fce0eEca4ECd5",
    agentTokenCreator: "0x1de92950a141bf42fb5a1a711797fede5c33d9bb",
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

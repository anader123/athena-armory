import {
  createWalletClient,
  createPublicClient,
  http,
  Chain,
  encodeFunctionData,
} from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { base } from "viem/chains";
import { ZORA_1155_ABI, AGENT_MULTI_ABI, ZORA_FACTORY_ABI } from "./abi";
import { addUsedName } from "./misc";

interface NFTDetail {
  name: string;
  description: string;
}

interface MetadataWithIPFS {
  metadata: NFTDetail;
  ipfsMetadataHash: string;
}

const NFT_CONTRACT_ADDRESS = "0x2e19b870c16efe1e346e8fc15bc91cd322b1513d";
const AGENT_MULTI_SIG = "0xA9622d0B656dA00B0004c3e9C231B5A177402fbE";
const FIXED_PRICED_MINTER = "0x04E2516A2c207E84a1839755675dfd8eF6302F0a";
const FACTORY_ADDRESS = "0x777777C338d93e2C7adf08D102d45CA7CC4Ed021";
const DEFAULT_ADMIN = "0x62c99874C6873E5B2533e5D1Eb703b755aC93739";
const CONTRACT_IPFS_HASH =
  "ipfs://QmeFj2bHcptvF4TZ6G8MVVZbdpgnj3mARsoY379MD35PhM";

const publicClient = createPublicClient({
  chain: base as Chain,
  transport: http(),
});

const account = privateKeyToAccount(
  process.env.ETH_PRIVATE_KEY as `0x${string}`
);

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

export const createToken = async (tokenIpfsHash: string, name: string) => {
  try {
    const nextTokenId = await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: ZORA_1155_ABI,
      functionName: "nextTokenId",
    });

    const hash = await walletClient.sendTransaction({
      to: AGENT_MULTI_SIG,
      data: encodeFunctionData({
        abi: AGENT_MULTI_ABI,
        functionName: "createToken",
        args: [nextTokenId, tokenIpfsHash],
      }),
    });

    console.log("NFT add to contract in tx:", hash);
    addUsedName(name);
  } catch (error: any) {
    console.error(
      "Error performing token creation:",
      error.shortMessage ? error.shortMessage : error
    );
  }
};

export const startTokenVote = async (options: MetadataWithIPFS[]) => {
  const firstOption = {
    name: options[0].metadata.name,
    ipfsHash: options[0].ipfsMetadataHash,
  };

  const secondOption = {
    name: options[1].metadata.name,
    ipfsHash: options[1].ipfsMetadataHash,
  };

  try {
    const nextTokenId = await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: ZORA_1155_ABI,
      functionName: "nextTokenId",
    });

    await walletClient.sendTransaction({
      to: AGENT_MULTI_SIG,
      data: encodeFunctionData({
        abi: AGENT_MULTI_ABI,
        functionName: "startTokenVote",
        args: [nextTokenId, firstOption, secondOption],
      }),
    });

    console.log("Token vote started");
    await waitForTxSeconds(5); // wait for tx to confirm onchain
  } catch (error: any) {
    console.error(
      "Error performing token creation:",
      error.shortMessage ? error.shortMessage : error
    );
  }
};

export const createVoteTx = async (
  index: number,
  tokenOptions: MetadataWithIPFS[],
  voteObj: { choice: number; reason: string }
) => {
  try {
    let privateKey: `0x${string}` | undefined;
    let agentName: string | undefined;

    switch (index) {
      case 0:
        privateKey = process.env.ATHENA_KEY as `0x${string}`;
        agentName = "Athena";
        break;
      case 1:
        privateKey = process.env.HERMES_KEY as `0x${string}`;
        agentName = "Hermes";
        break;
      case 2:
        privateKey = process.env.HEPHAESTUS_KEY as `0x${string}`;
        agentName = "Hephaestus";
        break;
      default:
        throw new Error("Invalid index. Must be 0, 1, or 2.");
    }

    if (!privateKey) {
      throw new Error(`Private key is not defined for ${agentName}`);
    }

    const account = privateKeyToAccount(privateKey);

    const agentWallet = createWalletClient({
      account,
      chain: base,
      transport: http(),
    });

    const nextTokenId = await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: ZORA_1155_ABI,
      functionName: "nextTokenId",
    });

    await agentWallet.sendTransaction({
      account,
      to: AGENT_MULTI_SIG,
      data: encodeFunctionData({
        abi: AGENT_MULTI_ABI,
        functionName: "submitTokenVote",
        args: [
          nextTokenId,
          tokenOptions[voteObj.choice].ipfsMetadataHash,
          tokenOptions[voteObj.choice].metadata.name,
          voteObj.reason,
        ],
      }),
    });

    console.log(
      `${agentName} voted for ${
        tokenOptions[voteObj.choice].metadata.name
      } with reason: ${voteObj.reason}`
    );
  } catch (error: any) {
    console.error(`Error during the voting transaction: ${error.message}`);
  }
};

export const createContract = async () => {
  const addMinterPerms = encodeFunctionData({
    abi: ZORA_1155_ABI,
    functionName: "addPermission",
    args: ["0", FIXED_PRICED_MINTER, "4"],
  });
  const addAgentContractPerms = encodeFunctionData({
    abi: ZORA_1155_ABI,
    functionName: "addPermission",
    args: ["0", AGENT_MULTI_SIG, "2"],
  });

  const hash = await walletClient.sendTransaction({
    to: FACTORY_ADDRESS,
    data: encodeFunctionData({
      abi: ZORA_FACTORY_ABI,
      functionName: "createContract",
      args: [
        CONTRACT_IPFS_HASH,
        "Athena's Armory",
        {
          royaltyMintSchedule: "0",
          royaltyBPS: "500",
          royaltyRecipient: DEFAULT_ADMIN,
        },
        DEFAULT_ADMIN,
        [addMinterPerms, addAgentContractPerms],
      ],
    }),
  });

  console.log("Created NFT contract in tx:", hash);
};

// export async function createEthereumAccount() {
//   // Generate a new private key
//   const privateKey = generatePrivateKey();
//   console.log("Private Key:", privateKey);

//   // Derive the Ethereum account from the private key
//   const account = privateKeyToAccount(privateKey);
//   console.log("Address:", account.address);
//   console.log("Private Key:", privateKey);

//   return account;
// }

const waitForTxSeconds = (sec: number) => {
  console.log("Waiting for votes to start onchain...");
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};

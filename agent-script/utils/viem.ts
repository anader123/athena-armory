import {
  createWalletClient,
  createPublicClient,
  http,
  Chain,
  encodeFunctionData,
} from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { ZORA_1155_ABI, AGENT_MULTI_ABI } from "./abi";

// TODO: Add fresh delpoyments
const NFT_CONTRACT_ADDRESS = "";
const AGENT_MULTI_SIG = "";

const publicClient = createPublicClient({
  chain: baseSepolia as Chain,
  transport: http(),
});

const account = privateKeyToAccount(
  process.env.ETH_PRIVATE_KEY as `0x${string}`
);

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

export const createToken = async (tokenIpfsHash: string) => {
  const nextTokenId = await publicClient.readContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: ZORA_1155_ABI,
    functionName: "nextTokenId",
  });

  try {
    const hash = await walletClient.sendTransaction({
      to: AGENT_MULTI_SIG,
      data: encodeFunctionData({
        abi: AGENT_MULTI_ABI,
        functionName: "createToken",
        args: [nextTokenId, tokenIpfsHash],
      }),
      gasLimit: 1000000,
    });

    console.log("Token created in tx:", hash);
  } catch (error: any) {
    console.error(
      "Error performing token vote:",
      error.shortMessage ? error.shortMessage : error
    );
  }
};

export const createVoteTx = async (
  index: number,
  tokenOptions: any,
  voteObj: any
) => {
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

  const account = privateKeyToAccount(privateKey);

  const agentWallet = createWalletClient({
    account,
    chain: baseSepolia,
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
        voteObj.reason,
      ],
    }),
  });

  console.log(
    `${agentName} voted for #${voteObj.choice} with reason: ${voteObj.reason}`
  );
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

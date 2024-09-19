import { NextRequest, NextResponse } from "next/server";
import {
  createPublicClient,
  http,
  Log,
  encodeAbiParameters,
  decodeEventLog,
} from "viem";
import { base, baseSepolia } from "viem/chains";
import { AGENT_MULTI_ABI, ZORA_1155_ABI } from "@/constants/abi";
import { DEPLOYMENTS } from "@/constants/addresses";
import { GOD_DATA } from "@/constants/godDetails";

interface VoteSubmittedEventArgs {
  agent: string;
  tokenId: bigint;
  ipfsHash: string;
  name?: string;
  reason: string;
}

interface VoteSubmittedLog extends Log {
  args: VoteSubmittedEventArgs;
}

interface VoteStartedEventArgs {
  tokenId: bigint;
  firstOption: {
    name: string;
    ipfsHash: string;
  };
  secondOption: {
    name: string;
    ipfsHash: string;
  };
}

interface VoteStartedLog extends Log {
  args: VoteStartedEventArgs;
}

async function getResponse(
  req: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  const { tokenId } = params;

  if (!tokenId) {
    return NextResponse.json(
      { error: "Token ID is required" },
      { status: 400 }
    );
  }

  try {
    const networkId = +(process.env.NEXT_PUBLIC_NETWORK_ID as string);
    const network = networkId === base.id ? base : baseSepolia;

    const url = `https://base-${
      networkId === base.id ? "mainnet" : "sepolia"
    }.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

    const publicClient = createPublicClient({
      chain: network,
      transport: http(url),
    });

    // Commenting out to keep it at day 5
    // const { number: toBlock } = await publicClient.getBlock();
    // const fromBlock = toBlock - BigInt(45000); // roughly one day worth of L2 blocks

    const filter = await publicClient.createContractEventFilter({
      address: DEPLOYMENTS[network.id].agentTokenCreator,
      abi: AGENT_MULTI_ABI,
      eventName: "TokenVoteStarted",
      args: {
        tokenId,
      },
      // fromBlock,
      // toBlock,

      fromBlock: BigInt(19773740),
      toBlock: BigInt(19773760),
    });

    const optionLogs = (await publicClient.getFilterLogs({
      filter,
    })) as VoteStartedLog[];

    if (optionLogs.length === 0) {
      return NextResponse.json(
        { error: "No option logs found" },
        { status: 404 }
      );
    }

    let logs: VoteSubmittedLog[] = [];

    try {
      const filter = await publicClient.createContractEventFilter({
        address: DEPLOYMENTS[network.id].agentTokenCreator,
        abi: AGENT_MULTI_ABI,
        eventName: "VoteSubmitted",
        args: {
          tokenId,
        },
        // fromBlock,
        // toBlock,
        fromBlock: BigInt(19773710),
        toBlock: BigInt(19773760),
      });

      logs = (await publicClient.getFilterLogs({
        filter,
      })) as VoteSubmittedLog[];
    } catch (filterError) {
      console.error("Error creating or using the filter:", filterError);
      return NextResponse.json(
        { error: "Failed to retrieve logs. Please try again." },
        { status: 500 }
      );
    }

    if (logs.length === 0) {
      return NextResponse.json(
        { error: "No vote logs found" },
        { status: 404 }
      );
    }

    const votes = logs.map((log) => {
      return {
        ...log.args,
        tokenId: log.args.tokenId.toString(),
        txHash: log.transactionHash,
      };
    });

    const mergedArr = votes
      .map((vote: any) => {
        const index = GOD_DATA.findIndex(
          (god) => god.address.toLowerCase() === vote.agent.toLowerCase()
        );

        if (index !== -1) {
          return {
            ...GOD_DATA[index],
            ...vote,
          };
        }
      })
      .filter(Boolean);

    return NextResponse.json({
      votes: mergedArr,
      options: {
        ...optionLogs[0].args,
        tokenId,
      },
    });
  } catch (error) {
    console.error("Error fetching response:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  return getResponse(req, { params });
}

// async function getResponse(req: NextRequest): Promise<NextResponse> {
//   try {
//     const networkId = +(process.env.NEXT_PUBLIC_NETWORK_ID as string);
//     const network = networkId === base.id ? base : baseSepolia;

//     const url = `https://base-${
//       networkId === base.id ? "mainnet" : "sepolia"
//     }.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

//     const publicClient = createPublicClient({
//       chain: network,
//       transport: http(url),
//     });

//     const nextTokenId = (await publicClient.readContract({
//       address: DEPLOYMENTS[network.id].zoraContract,
//       abi: ZORA_1155_ABI,
//       functionName: "nextTokenId",
//     })) as bigint;

//     const currentTokenId = (nextTokenId - BigInt(1)).toString();
//     const { number: toBlock } = await publicClient.getBlock();
//     const fromBlock = toBlock - BigInt(45000); // roughly one day worth of L2 blocks

//     const VOTE_TOPIC_ID =
//       "0x051c5a6d7a3c723aab33818cdce41ae1f7210ab34d52dcc38c8087311a738cec";

//     const encodedTokenId = encodeAbiParameters(
//       [{ type: "uint256", name: "tokenId" }],
//       [BigInt(currentTokenId)]
//     );

//     const baseScanUrl = `https://${
//       networkId === base.id ? "api" : "api-sepolia"
//     }.basescan.org/api?module=logs&action=getLogs&fromBlock=${fromBlock.toString()}&toBlock=${toBlock.toString()}&address=${
//       DEPLOYMENTS[network.id].agentTokenCreator
//     }&topic0=${VOTE_TOPIC_ID}&topic0_2_opr=and&topic2=${encodedTokenId}&apikey=${
//       process.env.BASESCAN_API_KEY
//     }`;

//     let logs: VoteSubmittedLog[] = [];

//     try {
//       const response = await fetch(baseScanUrl);

//       const { result } = await response.json();
//       console.log(result);
//       result.map((log: any) => {
//         const topics = decodeEventLog({
//           abi: AGENT_MULTI_ABI,
//           data: log.data,
//           topics: log.topics,
//         });
//       });
//     } catch (filterError) {
//       console.error("Error creating or using the filter:", filterError);
//       return NextResponse.json(
//         { error: "Failed to retrieve logs. Please try again." },
//         { status: 500 }
//       );
//     }

//     if (logs.length === 0) {
//       return NextResponse.json({ error: "No logs found" }, { status: 404 });
//     }

//     const votes = logs.map((log) => {
//       return {
//         ...log.args,
//         tokenId: log.args.tokenId.toString(),
//         txHash: log.transactionHash,
//       };
//     });

//     const mergedArr = votes
//       .map((vote: any) => {
//         const index = GOD_DATA.findIndex(
//           (god) => god.address.toLowerCase() === vote.agent.toLowerCase()
//         );

//         if (index !== -1) {
//           return {
//             ...GOD_DATA[index],
//             ...vote,
//           };
//         }
//       })
//       .filter(Boolean); // Filter out any undefined results

//     return NextResponse.json({
//       votes: mergedArr,
//     });
//   } catch (error) {
//     console.error("Error fetching response:", error);
//     return NextResponse.json(
//       { error: "An error occurred while processing the request" },
//       { status: 500 }
//     );
//   }
// }

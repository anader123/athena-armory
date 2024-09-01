import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, Log, parseAbiItem } from "viem";
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

async function getResponse(req: NextRequest): Promise<NextResponse> {
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

    const nextTokenId = (await publicClient.readContract({
      address: DEPLOYMENTS[network.id].zoraContract,
      abi: ZORA_1155_ABI,
      functionName: "nextTokenId",
    })) as bigint;

    const currentTokenId = (nextTokenId - BigInt(1)).toString();

    const { number: toBlock } = await publicClient.getBlock();
    const fromBlock = toBlock - BigInt(70000); // roughly one day worth of L2 blocks

    let logs: VoteSubmittedLog[] = [];

    try {
      const filter = await publicClient.createContractEventFilter({
        address: DEPLOYMENTS[network.id].agentTokenCreator,
        abi: AGENT_MULTI_ABI,
        strict: false,
        eventName: "VoteSubmitted",
        args: {
          tokenId: currentTokenId,
        },
        fromBlock,
        // toBlock,
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
      return NextResponse.json({ error: "No logs found" }, { status: 404 });
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
      .filter(Boolean); // Filter out any undefined results

    return NextResponse.json({
      votes: mergedArr,
    });
  } catch (error) {
    console.error("Error fetching response:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getResponse(req);
}

import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, Log } from "viem";
import { base, baseSepolia } from "viem/chains";
import { AGENT_MULTI_ABI, ZORA_1155_ABI } from "@/constants/abi";
import { DEPLOYMENTS } from "@/constants/addresses";

interface VoteSubmittedEventArgs {
  agent: string;
  tokenId: bigint;
  ipfsHash: string;
  reason: string;
}

interface VoteSubmittedLog extends Log {
  args: VoteSubmittedEventArgs;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const networkId = +(process.env.NEXT_PUBLIC_NETWORK_ID as string);
  const network = networkId === base.id ? base : baseSepolia;

  const publicClient = createPublicClient({
    chain: network,
    transport: http(),
  });

  const nextTokenId = (await publicClient.readContract({
    address: DEPLOYMENTS[network.id].zoraContract,
    abi: ZORA_1155_ABI,
    functionName: "nextTokenId",
  })) as bigint;

  const currentTokenId = (nextTokenId - BigInt(1)).toString();

  const { number: toBlock } = await publicClient.getBlock();
  const fromBlock = toBlock - BigInt(7200); // 1 day worth of blocks
  const filter = await publicClient.createContractEventFilter({
    abi: AGENT_MULTI_ABI,
    address: DEPLOYMENTS[network.id].agentTokenCreator,
    eventName: "VoteSubmitted",
    args: {
      tokenId: currentTokenId,
    },
    fromBlock,
    toBlock,
  });

  const logs = (await publicClient.getFilterLogs({
    filter,
  })) as VoteSubmittedLog[];

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

  return NextResponse.json({
    votes,
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getResponse(req);
}

import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base, baseSepolia } from "viem/chains";
import { ZORA_1155_ABI } from "@/constants/abi";
import { DEPLOYMENTS } from "@/constants/addresses";

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

  const url = `https://api-base-sepolia.reservoir.tools/tokens/v7?tokens=${DEPLOYMENTS[networkId].zoraContract}:${currentTokenId}&sortBy=tokenId`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": process.env.RESERVOIR_API_KEY!,
      },
    });

    const { tokens } = await response.json();
    const tokenMetadata = tokens[0].token;

    return NextResponse.json(
      {
        name: tokenMetadata.name,
        description: tokenMetadata.description,
        image: tokenMetadata.image,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getResponse(req);
}

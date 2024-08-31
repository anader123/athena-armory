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

  const ipfsHash = (await publicClient.readContract({
    address: DEPLOYMENTS[network.id].zoraContract,
    abi: ZORA_1155_ABI,
    functionName: "uri",
    args: [currentTokenId],
  })) as string;

  const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash.slice(7)}`;

  const tokenMetadataResponse = await fetch(ipfsUrl);

  if (!tokenMetadataResponse.ok) {
    return NextResponse.json(
      { error: "Failed to fetch token metadata" },
      { status: tokenMetadataResponse.status }
    );
  }

  const tokenMetadata = await tokenMetadataResponse.json();

  return NextResponse.json({
    ...tokenMetadata,
    tokenId: currentTokenId,
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getResponse(req);
}

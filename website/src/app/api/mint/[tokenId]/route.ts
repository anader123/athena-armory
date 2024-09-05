import { NextRequest, NextResponse } from "next/server";
import { base } from "viem/chains";
import { DEPLOYMENTS } from "@/constants/addresses";

async function getResponse(
  req: NextRequest,
  { params }: { params: { tokenId: string } }
): Promise<NextResponse> {
  const { tokenId } = params;
  const networkId = +(process.env.NEXT_PUBLIC_NETWORK_ID as string);

  if (!tokenId) {
    return NextResponse.json(
      { error: "Token ID is required" },
      { status: 400 }
    );
  }

  const url = `https://api-base${
    networkId === base.id ? "" : "-sepolia"
  }.reservoir.tools/tokens/v7?tokens=${
    DEPLOYMENTS[networkId].zoraContract
  }:${tokenId}`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": process.env.RESERVOIR_API_KEY!,
      },
    });

    const { tokens } = await response.json();

    if (!tokens[0]) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    const tokenMetadata = tokens[0].token;

    return NextResponse.json(
      {
        name: tokenMetadata.name,
        description: tokenMetadata.description,
        image: tokenMetadata.image,
        tokenId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
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

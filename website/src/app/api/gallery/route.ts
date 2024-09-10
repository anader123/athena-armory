import { NextResponse } from "next/server";
import { DEPLOYMENTS } from "@/constants/addresses";
import { base } from "viem/chains";

export async function GET(): Promise<NextResponse> {
  const networkId = +(process.env.NEXT_PUBLIC_NETWORK_ID as string);
  const url = `https://api-base${
    networkId === base.id ? "" : "-sepolia"
  }.reservoir.tools/tokens/v7?collection=${
    DEPLOYMENTS[networkId].zoraContract
  }&sortBy=tokenId`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": process.env.RESERVOIR_API_KEY!,
      },
    });

    const { tokens } = await response.json();
    let finalTokens = tokens.slice(1).reverse();

    return NextResponse.json(finalTokens, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

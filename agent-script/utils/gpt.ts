import OpenAI from "openai";
import dotenv from "dotenv";
import { votingInstructions } from "../constants";
import { createVoteTx } from "./viem";
import { getUsedNames } from "./misc";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface NFTDetail {
  name: string;
  description: string;
}

interface TokenResponseType {
  nftDetails: NFTDetail[];
  images: string[];
}

interface MetadataWithIPFS {
  metadata: NFTDetail;
  ipfsMetadataHash: string;
}

export async function generateTokenDetails(): Promise<TokenResponseType> {
  console.log("Fetching from OpenAI");

  const usedNames = getUsedNames();

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are Hephaestus, The God of Craftsmanship and are crafting items for an armory full of mythical items from ancient Greece.",
      },
      {
        role: "user",
        content: `Generate an array of objects for NFT metadata of two potential items to vote on. Each object should have a name and a description. The description will be used to generate the image of items; please keep it at a max of 150 characters. No additional text beyond the metadata in the response. Don't include colors in the description. Do not return anything that is close to the following names since they have already been used: ${usedNames}`,
      },
    ],
  });

  const content = chatResponse.choices[0].message.content;

  if (!content) {
    throw new Error("Failed to generate content for the items.");
  }

  try {
    const nftArray = JSON.parse(content);
    console.log("Token Options:", nftArray);

    const promptText =
      "Create a detailed of a mythical item in the style of ancient Greek Black-Figure pottery. The image should be black and white, with intricate designs and patterns typical of ancient Greek art. The item should be depicted with bold black silhouettes against a light background, resembling the art seen on ancient Greek vases. Ensure the image is in the style of ancient Greece, with a focus on artistic, historical accuracy. No text on the image. The description to follow is:";

    console.log("Generating images");

    const firstImageResponse = await openai.images.generate({
      prompt: `${promptText} + ${nftArray[0].description}.`,
      n: 1,
      size: "1024x1024",
      model: "dall-e-3",
    });

    const secondImageResponse = await openai.images.generate({
      prompt: `${promptText} + ${nftArray[1].description}.`,
      n: 1,
      size: "1024x1024",
      model: "dall-e-3",
    });

    const firstImageUrl = firstImageResponse.data[0].url;
    const secondImageUrl = secondImageResponse.data[0].url;

    if (!firstImageUrl || !secondImageUrl) {
      throw new Error("Failed to generate image.");
    }

    console.log("Images successfully created");

    console.log(firstImageUrl);
    console.log(secondImageUrl);

    return { nftDetails: nftArray, images: [firstImageUrl, secondImageUrl] };
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("The content returned was not valid JSON.");
  }
}

export async function voteOnTokens(
  metadataWithIPFS: MetadataWithIPFS[]
): Promise<{ ipfsHash: string; name: string }> {
  console.log("Voting on items");

  let zeroIndexVoteCount = 0;

  for (const [i, instruction] of votingInstructions.entries()) {
    instruction.messages[1].content += `${metadataWithIPFS[0].metadata.description} or ${metadataWithIPFS[1].metadata.description}`;

    try {
      const chatResponse = await openai.chat.completions.create(
        instruction as any
      );
      const content = chatResponse.choices[0].message.content;

      if (!content) {
        throw new Error("Failed to generate vote for the items.");
      }

      const voteObj: { choice: number; reason: string } = JSON.parse(content);
      if (voteObj.choice === 0) {
        zeroIndexVoteCount += 1;
      }

      await createVoteTx(i, metadataWithIPFS, voteObj);
    } catch (error) {
      console.error("Error processing vote:", error);
      throw new Error(`Failed to process vote at index ${i}`);
    }
  }
  await waitForTx(20); // wait for tx to confirm onchain

  return zeroIndexVoteCount > 1
    ? {
        ipfsHash: metadataWithIPFS[0].ipfsMetadataHash,
        name: metadataWithIPFS[0].metadata.name,
      }
    : {
        ipfsHash: metadataWithIPFS[1].ipfsMetadataHash,
        name: metadataWithIPFS[1].metadata.name,
      };
}

const waitForTx = (sec: number) =>
  new Promise((resolve) => setTimeout(resolve, sec * 1000));

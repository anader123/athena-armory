import dotenv from "dotenv";
dotenv.config();
import { createContract } from "./utils/viem";
import { generateTokenDetails } from "./utils/gpt";
import { getTokenMetadataDetails } from "./utils/ipfs";
import { voteOnTokens } from "./utils/gpt";
const cron = require("node-cron");

async function generateToken(): Promise<void> {
  try {
    const { nftDetails, images } = await generateTokenDetails(); // Call OpenAI to get metadata and images
    const metadataWithIpfs = await getTokenMetadataDetails(nftDetails, images); // Upload metadata to IPFS
    const ipfsHash = await voteOnTokens(metadataWithIpfs); // Voting on which is the better and why
    await createToken(ipfsHash); // Submitting the transaction to create the token after voting

    // await createContract();
  } catch (error: any) {
    console.error(
      "Error creating token:",
      error.response ? error.response.data : error.message
    );
  }
}

cron.schedule(
  "0 9 * * *",
  () => {
    console.log("Starting the generateToken process...");
    generateToken()
      .then(() => {
        console.log("Token generation process completed.");
      })
      .catch((error) => {
        console.error("Error during token generation process:", error.message);
      });
  },
  {
    timezone: "America/Los_Angeles",
  }
);

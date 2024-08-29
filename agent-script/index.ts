import dotenv from "dotenv";
dotenv.config();
import { createToken } from "./utils/viem";
import { generateTokenDetails } from "./utils/gpt";
import { getTokenMetadataDetails } from "./utils/ipfs";
import { voteOnTokens } from "./utils/gpt";
import cron from "node-cron";

async function generateToken(): Promise<void> {
  try {
    const { nftDetails, images } = await generateTokenDetails(); // Call OpenAI to get metadata and images
    const metadataWithIpfs = await getTokenMetadataDetails(nftDetails, images); // Upload metadata to IPFS
    const { ipfsHash, name } = await voteOnTokens(metadataWithIpfs); // Voting on which is the better and why
    console.log({ ipfsHash, name });
    await createToken(ipfsHash, name); // Submitting the transaction to create the token after voting
  } catch (error: any) {
    console.error(
      "Error creating token:",
      error.response ? error.response.data : error.message
    );
  }
}

generateToken();

// console.log("started");

// cron.schedule(
//   "15 23 * * *",
//   () => {
//     console.log("Starting the generateToken process...");
//     generateToken()
//       .then(() => {
//         console.log("Token generation process completed.");
//       })
//       .catch((error) => {
//         console.error("Error during token generation process:", error.message);
//       });
//   },
//   {
//     timezone: "Etc/UTC",
//   }
// );

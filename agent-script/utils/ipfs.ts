import axios, { AxiosResponse } from "axios";
import fs from "fs";
import FormData from "form-data";

interface NFTDetail {
  name: string;
  description: string;
  image?: string;
}

interface MetadataWithIPFS {
  metadata: NFTDetail;
  ipfsMetadataHash: string;
}

async function uploadImageToIPFS(
  filePath: string,
  name: string
): Promise<string | undefined> {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const metadata = JSON.stringify({
    name,
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  try {
    const response: AxiosResponse<{
      IpfsHash: string;
    }> = await axios.post(url, formData, {
      maxContentLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${
          (formData as any)._boundary
        }`,
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    return response.data.IpfsHash;
  } catch (error: any) {
    console.error(
      "Error uploading to IPFS:",
      error.response ? error.response.data : error.message
    );
  }
}

async function uploadJsonToIPFS(
  metadata: object,
  fileName: string
): Promise<string | undefined> {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const pinataMetadata = {
    name: fileName,
  };

  const data = {
    pinataMetadata,
    pinataContent: metadata,
  };

  try {
    const response: AxiosResponse<{
      IpfsHash: string;
    }> = await axios.post(url, data, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    console.log("IPFS Hash for token metadata:", response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error: any) {
    console.error(
      "Error uploading JSON to IPFS:",
      error.response ? error.response.data : error.message
    );
  }
}

export async function getTokenMetadataDetails(
  nftDetails: NFTDetail[],
  images: string[]
): Promise<MetadataWithIPFS[]> {
  console.log("Uploading item details to IPFS");

  const metadataDetails = await Promise.all(
    nftDetails.map((nftDetail, i) => {
      return new Promise<MetadataWithIPFS>((resolve, reject) => {
        axios
          .get(images[i], { responseType: "stream" })
          .then((response) => {
            const imgFilePath = `${nftDetail.name}.png`;
            const writer = fs.createWriteStream(imgFilePath);

            response.data.pipe(writer);

            writer.on("finish", async () => {
              try {
                const ipfsImageHash = await uploadImageToIPFS(
                  imgFilePath,
                  imgFilePath // File name
                );

                const updatedMetadata = {
                  ...nftDetail,
                  image: `ipfs://${ipfsImageHash}`,
                };

                const ipfsMetadataHash = await uploadJsonToIPFS(
                  updatedMetadata,
                  `${nftDetail.name}.json` // File name
                );

                fs.unlink(imgFilePath, (err) => {
                  if (err) {
                    console.error("Error deleting the image file:", err);
                  }
                });

                if (!ipfsMetadataHash) {
                  console.error("Image URL is undefined");
                  return;
                }

                resolve({ metadata: updatedMetadata, ipfsMetadataHash });
              } catch (error) {
                reject(error);
              }
            });

            writer.on("error", (err) => {
              console.error("Error saving the image:", err);
              reject(err);
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
    })
  );

  return metadataDetails;
}

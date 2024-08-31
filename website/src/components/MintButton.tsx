import { useWriteContract, useAccount } from "wagmi";
import { DEPLOYMENTS } from "@/constants/addresses";
import { ZORA_1155_ABI } from "@/constants/abi";
import { parseEther, zeroAddress, encodeAbiParameters } from "viem";
import { base } from "viem/chains";
import MintedDialog from "./MintedDialog";

export default function MintButton({
  howMany,
  name,
  tokenId,
}: {
  howMany: number;
  name: string;
  tokenId: string;
}) {
  const { address: userAddress } = useAccount();
  const write = useWriteContract();

  const networkId = +(process.env.NEXT_PUBLIC_NETWORK_ID ?? base.id);

  const zoraContractAddress = DEPLOYMENTS[networkId.toString()].zoraContract;
  const fixedPriceMinterAddress =
    DEPLOYMENTS[networkId.toString()].fixedPriceMinter;

  const mintRefAddress = process.env.NEXT_PUBLIC_MINT_REF ?? zeroAddress;
  const value = parseEther("0.000777") * BigInt(howMany);
  const minterArguments = encodeAbiParameters(
    [{ type: "address" }],
    [userAddress!]
  );

  return (
    <div className="w-full">
      <MintedDialog
        tokenId={tokenId}
        name={name}
        open={write.isSuccess}
        onClose={() => {
          write.reset();
        }}
        txHash={write!.data || "0x0"}
      />
      <button
        onClick={() =>
          write.writeContract({
            address: zoraContractAddress,
            abi: ZORA_1155_ABI,
            functionName: "mint",
            args: [
              fixedPriceMinterAddress,
              tokenId,
              howMany.toString(),
              [mintRefAddress],
              minterArguments,
            ],
            value,
            chainId: networkId,
          })
        }
        className="w-full font-open-sans text-black bg-gray-300 rounded-md py-2"
      >
        Mint
      </button>
      {write.error && (
        <div
          title={write.error ? write.error.message : undefined}
          className="text-red-500 font-open-sans text-sm line-clamp-2 text-center mt-2"
        >
          {write.error && toHumanErrorMessage(write.error.message)}
        </div>
      )}
    </div>
  );
}

function toHumanErrorMessage(message?: string | null): string | null {
  if (!message) {
    return null;
  }

  if (message.includes("exceeds the balance")) {
    return "You do not have enough ETH to mint.";
  }

  if (message.includes("User rejected")) {
    return "User rejected the request.";
  }

  if (message.includes("Connector not connected")) {
    return "Wallet not connected. Please connect wallet.";
  }

  return message;
}

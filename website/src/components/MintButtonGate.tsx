import { ConnectKitButton } from "connectkit";
import MintButton from "./MintButton";

export default function MintButtonGate({
  howMany,
  name,
  tokenId,
  img,
}: {
  howMany: number;
  name: string;
  tokenId: string;
  img: string;
}) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, unsupported }) => {
        if (!isConnected || unsupported) {
          return (
            <button
              type="button"
              className="w-full font-open-sans text-black bg-gray-300 rounded-md py-2"
              onClick={show}
              disabled={isConnecting}
            >
              Mint
            </button>
          );
        }
        return (
          <MintButton
            name={name}
            tokenId={tokenId}
            howMany={howMany}
            img={img}
          />
        );
      }}
    </ConnectKitButton.Custom>
  );
}

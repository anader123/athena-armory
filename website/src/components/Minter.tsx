import { useState } from "react";
import Stepper from "./Stepper";
import { ConnectKitButton } from "connectkit";
import MintButton from "./MintButton";
import CountDown from "./CountDown";

export default function Minter() {
  const [howMany, setHowMany] = useState(1);

  return (
    <div className="flex flex-row w-full justify-center gap-40 my-20">
      <div className="flex flex-col justify-between h-[30vw]">
        <div>
          <div className="display-table">
            <h2 className="text-3xl border-b border-white m-0">
              Medusa’s Gorgon Shield
            </h2>
            <p className="font-open-sans text-gray-500 table-caption p-1 mt-2 text-sm">
              A beautifully crafted shield embellished with Medusa’s head,
              featuring majestic golden wings and intricate etchings.
            </p>
          </div>
          <CountDown />
        </div>

        <div>
          <Stepper
            value={howMany}
            onChange={(newHowMany) => {
              setHowMany(newHowMany);
            }}
          />
          <MintButtonGate howMany={howMany} />
          <p className="w-full text-center font-open-sans mt-4 text-gray-500 text-sm">
            Total: {0.000777 * howMany} ETH
          </p>
        </div>
      </div>

      <div className="flex items-center w-[30vw] h-[30vw]">
        <img
          className="border-2 border-gray-300 rounded-md h-full object-cover "
          src="/test.png"
          alt="item-img"
        />
      </div>
    </div>
  );
}

function MintButtonGate({ howMany }: { howMany: number }) {
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
        return <MintButton howMany={howMany} />;
      }}
    </ConnectKitButton.Custom>
  );
}

import { useState } from "react";
import Stepper from "./Stepper";
import { ConnectKitButton } from "connectkit";
import MintButton from "./MintButton";
import CountDown from "./CountDown";
import { useQuery } from "@tanstack/react-query";
import { apiFetcher } from "@/utils/fetcher";

export default function Minter() {
  const [howMany, setHowMany] = useState(1);

  const { data, error, isLoading } = useQuery({
    queryKey: ["fetchCurrentMint"],
    queryFn: () => apiFetcher("currentmint"),
    // staleTime: STALE_TIME,
  });

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex sm:flex-row flex-col-reverse w-full justify-center sm:gap-40 gap-8 sm:my-20 my-10">
      <div className="flex flex-col justify-between sm:px-0 px-6 lg:w-[20%] md:w-[25%] w-full">
        <div className="w-full">
          <div className="display-table w-full">
            <h2 className="text-3xl border-b border-white m-0 inline">
              {data.name}
            </h2>
            <p className="font-open-sans text-gray-500 table-caption p-1 mt-2 text-md">
              {data.description}
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
          <MintButtonGate
            tokenId={data.tokenId}
            name={data.name}
            howMany={howMany}
          />
          <p className="w-full text-center font-open-sans mt-4 text-gray-500 text-sm">
            Total: {0.000777 * howMany} ETH
          </p>
        </div>
      </div>

      <div className="flex justify-center sm:w-[30vw] sm:h-[30vw] sm:px-0 px-6">
        <img
          className="border-2 border-gray-300 rounded-md h-full object-cover "
          src={data.image}
          alt="item-img"
        />
      </div>
    </div>
  );
}

function MintButtonGate({
  howMany,
  name,
  tokenId,
}: {
  howMany: number;
  name: string;
  tokenId: string;
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
        return <MintButton name={name} tokenId={tokenId} howMany={howMany} />;
      }}
    </ConnectKitButton.Custom>
  );
}

import { useState } from "react";
import Stepper from "./Stepper";
import CountDown from "./CountDown";
import { useQuery } from "@tanstack/react-query";
import { apiFetcher } from "@/utils/fetcher";
import MinterLoading from "./MinterLoading";
import { getStaleTime } from "@/utils/getStaleTime";
import Image from "next/image";
import ForgingItem from "./ForgingItem";
import MintButtonGate from "./MintButtonGate";
import { getCurrentTokenId } from "@/utils/getCurrentTokenId";

export default function Minter() {
  const [howMany, setHowMany] = useState(1);
  const staleTime = getStaleTime();
  // const currentTokenId = getCurrentTokenId(); Pausing the creation of new tokens so this is commented out
  const currentTokenId = 5;

  const { data, error, isLoading } = useQuery({
    queryKey: ["fetchCurrentMint", currentTokenId],
    queryFn: () => apiFetcher(`mint/${currentTokenId}`),
    staleTime,
  });

  if (isLoading) {
    return <MinterLoading />;
  }

  if (error) {
    return <ForgingItem />;
  }

  if (!data.description) {
    return <ForgingItem />;
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
          {/* <CountDown /> */}
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
            img={data.image}
          />
          <p className="w-full text-center font-open-sans mt-4 text-gray-500 text-sm">
            Total: {0.000777 * howMany} ETH
          </p>
        </div>
      </div>

      <div className="flex justify-center sm:w-[30vw] sm:h-[30vw] sm:px-0 px-6">
        <Image
          className="border-2 border-gray-700 rounded-md h-full object-cover "
          src={
            data.image.startsWith("ipfs://")
              ? data.image.replace("ipfs://", "https://ipfs.io/ipfs/")
              : data.image
          }
          alt="item-img"
          height={1024}
          width={1024}
        />
      </div>
    </div>
  );
}

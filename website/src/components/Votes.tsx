import { useQuery } from "@tanstack/react-query";
import { apiFetcher } from "@/utils/fetcher";
import VotesLoading from "./VotesLoading";
import { getStaleTime } from "@/utils/getStaleTime";
import Image from "next/image";

export default function Votes() {
  const staleTime = getStaleTime();
  const { data, error, isLoading } = useQuery({
    queryKey: ["fetchCurrentVotes"],
    queryFn: () => apiFetcher("votes"),
    staleTime,
  });

  if (isLoading) {
    return <VotesLoading />;
  }

  if (error || !data) {
    return <div>Error...</div>;
  }

  return (
    <div className="flex flex-col sm:p-16 px-8">
      <div className="display-table">
        <h2 className="text-2xl border-b border-white m-0 inline">
          Final Verdict
        </h2>
        <p className="font-open-sans text-gray-500 table-caption mt-3 sm:w-[45%]">
          {`Athena's Armory is curated daily by three AI agents, each representing
            the wisdom and power of an Ancient Greek God. Using their private
            keys, these AI entities vote on which items should be added to the
            armory. Below are the results of today's divine decisions.`}
        </p>
        <div className=" text-white table-caption text-center my-8">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 hover:underline sm:text-2xl text-xl"
            href={`https://ipfs.io/ipfs/${data.options.firstOption.ipfsHash}`}
          >
            {data.options.firstOption.name}
          </a>

          <span className="text-gray-300 mx-2 text-md"> vs </span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 hover:underline sm:text-2xl text-xl"
            href={`https://ipfs.io/ipfs/${data.options.secondOption.ipfsHash}`}
          >
            {data.options.secondOption.name}
          </a>
        </div>
      </div>
      <div className="flex sm:flex-row flex-col sm:gap-20 gap-8 w-full">
        {data.votes.map((godVote: any, i: number) => {
          return (
            <div
              className="flex sm:flex-row flex-col sm:gap-4 gap-1 sm:w-[33%]"
              key={`${godVote.godName} + ${i}`}
            >
              <div className="flex-shrink-0">
                <Image
                  className="rounded-md h-full sm:w-[125px] w-[100px] object-cover"
                  alt={godVote.name}
                  src={godVote.imgLink}
                  width={125}
                  height={125}
                />
              </div>
              <div className="text-sm flex flex-col justify-between">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 hover:opacity-70 hover:underline text-lg"
                  href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/${godVote.address}`}
                >
                  {godVote.godName}
                </a>
                <p className="font-open-sans text-gray-500 text-sm">
                  {`"${godVote.reason}"`}
                </p>
                <div className="flex flex-col sm:mt-4 mt-1 text-xs gap-1">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 hover:underline"
                    href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${godVote.txHash}`}
                  >
                    Voted: {godVote.name}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

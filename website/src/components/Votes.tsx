const dummyDataArr = [
  {
    name: "Hermes",
    address: "",
    reason:
      "Medusa's head on the shield can turn enemies to stone, providing a great defensive edge.",
    itemName: "Medusa’s Gorgon Shield",
    voteTx: "",
    imgLink: `${process.env.NEXT_PUBLIC_BASE_URL}/hermes-pfp.png`,
    ipfsHash: "",
  },
  {
    name: "Hephaestus",
    address: "",
    reason:
      "The Shield with Medusa's head can petrify enemies and provide great defense, making it superior.",
    itemName: "Medusa’s Gorgon Shield",
    voteTx: "",
    imgLink: `${process.env.NEXT_PUBLIC_BASE_URL}/hephaestus-pfp.png`,
    ipfsHash: "",
  },
  {
    name: "Athena",
    address: "",
    reason:
      "The shield features Medusa's head, a symbol of protection, and embodies divine craftsmanship perfect for the armory.",
    itemName: "Medusa’s Gorgon Shield",
    voteTx: "",
    imgLink: `${process.env.NEXT_PUBLIC_BASE_URL}/athena-pfp.png`,
    ipfsHash: "",
  },
];

export default function Votes() {
  return (
    <div className="flex flex-col p-16 gap-10 mb-10">
      <div className="display-table">
        <h2 className="text-2xl border-b border-white m-0 inline">
          Final Verdict
        </h2>
        <p className="font-open-sans text-gray-500 table-caption mt-3 text-sm w-[45%]">
          Athena's Armory is curated daily by three AI agents, each representing
          the wisdom and power of an Ancient Greek God. Using their private
          keys, these AI entities vote on which items should be added to the
          armory. Below are the results of today's divine decisions.
        </p>
      </div>
      <div className="flex gap-20 w-full">
        {dummyDataArr.map((godVote, i) => {
          return (
            <div className="flex gap-4 w-[33%]" key={`${godVote.name} + ${i}`}>
              <div className="flex-shrink-0">
                <img
                  className="rounded-md h-full w-[125px] object-cover"
                  alt={godVote.name}
                  src={godVote.imgLink}
                />
              </div>
              <div className="text-sm flex flex-col justify-between">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-md mb-2 hover:opacity-70 hover:underline"
                  href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/${godVote.address}`}
                >
                  {godVote.name}
                </a>
                <p className="font-open-sans text-gray-500 text-sm">
                  {`"${godVote.reason}"`}
                </p>
                <div className="flex flex-col mt-4 text-xs gap-1">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-open-sans hover:opacity-70 hover:underline"
                    href={`ipfs://${godVote.ipfsHash}`}
                  >
                    {godVote.itemName}
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 hover:underline"
                    href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${godVote.voteTx}`}
                  >
                    Vote Tx
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

import Link from "next/link";

export default function About() {
  return (
    <div className="lg:p-20 p-10">
      <div className="w-full flex flex-col items-center md:gap-20 gap-10">
        <div className="w-full flex md:flex-row flex-col justify-between items-center sm:gap-0 gap-4">
          <img
            src="/logo.png"
            className="md:max-w-[35%] max-w-[80%] rounded-md"
          />
          <div className="lg:max-w-[40%] md:max-w-[60%] w-full break-words">
            <h3 className="lg:text-3xl text-2xl">A new item forged each day</h3>
            <p className="font-open-sans text-gray-500 mt-2">
              Athena’s Armory is an NFT contract managed by AI agents embodying
              the personality of Greek Gods. Every day a new item is forged and
              added to the contract. Items can be minted for 24 hours after they
              are created.
            </p>
          </div>
        </div>
        <div className="w-full flex md:flex-row flex-col-reverse justify-between items-center">
          <div className="lg:max-w-[40%] md:max-w-[60%] w-full break-words flex flex-col gap-4">
            <h3 className="lg:text-3xl text-2xl sm:mt-0 mt-4">
              AI Agents That Embody Greek Gods
            </h3>
            <p className="font-open-sans text-gray-500">
              The armory is curated daily by three AI agents, each representing
              the wisdom and power of an Ancient Greek God. With their private
              keys, these AI entities use their best judgement to vote on which
              item should be added to the armory.
            </p>
          </div>
          <img
            src="/about.avif"
            className="md:max-w-[35%] max-w-[80%] rounded-md"
          />
        </div>
        <div className="w-full flex flex-col gap-2 text-gray-500">
          <h3 className="md:text-3xl text-2xl text-white">The Chosen Gods</h3>
          <div className="flex xl:flex-row flex-col gap-4 justify-between mt-4">
            <div>
              <p className="text-white text-xl">Athena</p>
              <p className="font-open-sans">
                The Goddess of Wisdom and Strategic Warfare
              </p>
              <p className="font-open-sans sm:inline hidden">
                Address: 0x2b54EB55b797554dA7e3026EB9B7f4506040B5c3
              </p>
            </div>
            <div>
              <p className="text-white text-xl">Hermes</p>
              <p className="font-open-sans">
                The God of Trade, Commerce, and Communication
              </p>
              <p className="font-open-sans sm:inline hidden">
                Address:0x3DDfCf8a5caA6a65451CDc092172911885fBf1B0{" "}
              </p>
            </div>
            <div>
              <p className="text-white text-xl">Hephaestus</p>
              <p className="font-open-sans">
                The God of Craftsmanship and Fire
              </p>
              <p className="font-open-sans sm:inline hidden">
                Address: 0x870973bfA656e58373931b6FE2D853cc80d7f2B9
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Crafted with the Power of the Gods

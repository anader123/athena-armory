import { Fragment, memo, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAccount } from "wagmi";
import { DEPLOYMENTS } from "@/constants/addresses";
import Image from "next/image";

const MintedDialog = memo(
  ({
    open,
    tokenId,
    name,
    txHash,
    img,
    onClose,
  }: {
    open: boolean;
    tokenId: string;
    name: string;
    txHash: string;
    img: string;
    onClose: () => void;
  }) => {
    const cancelButtonRef = useRef(null);
    const { address } = useAccount();

    let text = `I just was able to enter Athena's Armory and collect ${name}. The Armory is an NFT contract that is controlled by AI agents that embody Greek Gods. Check it out here:`;

    const twitterUrl =
      "https://twitter.com/intent/tweet?url=" +
      encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}`) +
      "&text=" +
      encodeURIComponent(text);

    const warpcastUrl =
      "https://warpcast.com/~/compose?text=" +
      encodeURIComponent(text) +
      `&embeds[]=${process.env.NEXT_PUBLIC_BASE_URL}`;

    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl ring-gray-500  ring-2">
                  <Dialog.Title
                    as="h3"
                    className="font-roboto text-lg p-2 leading-6 bg-black text-center text-white"
                  >
                    {name}
                    <button
                      type="button"
                      className="absolute top-0 right-3 text-white text-3xl"
                      onClick={onClose}
                      ref={cancelButtonRef}
                    >
                      ✕
                    </button>
                  </Dialog.Title>

                  <div className="flex flex-col md:flex-row items-center p-4 sm:gap-8 gap-4 font-roboto">
                    <Image alt={name} src={img} width={350} height={350} />
                    <div className="flex flex-col gap-2">
                      <div className="text-2xl font-bold tracking-tight uppercase text-black">
                        Minted
                      </div>
                      <p className="text-black font-open-sans">
                        {`You have collected ${name} from Athena's Armory. You can
                        view it in your wallet or on`}{" "}
                        <a
                          className="underline hover:opacity-70"
                          target="_blank"
                          href={`https://opensea.io/assets/base/${DEPLOYMENTS[8453].zoraContract}/${tokenId}`}
                        >
                          OpenSea
                        </a>
                        .
                      </p>
                      <p className="text-center text-gray-600 hover:opacity-[80%] mt-4">
                        <a
                          className="underline hover:opacity-70"
                          target="_blank"
                          href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${txHash}`}
                        >
                          View on Basescan
                        </a>
                      </p>
                      <div className="font-roboto text-xs mt-8 text-black text-center">
                        One more thing! Help us build the armory:
                      </div>
                      <p className="text-sm text-gray-500 font-bold flex justify-center gap-2">
                        <a
                          className="inline-block px-4 py-2 text-white rounded-full bg-black hover:bg-blue-700"
                          target="_blank"
                          href={twitterUrl}
                        >
                          Twitter/X
                        </a>
                        {" • "}
                        <a
                          className="inline-block px-4 py-2 text-white rounded-full bg-black hover:bg-purple-800"
                          target="_blank"
                          href={warpcastUrl}
                        >
                          Warpcast
                        </a>
                      </p>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }
);

MintedDialog.displayName = "MintedDialog";

export default MintedDialog;

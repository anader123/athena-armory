import { ConnectKitButton } from "connectkit";

export default function Header() {
  return (
    <div className="flex flex-row border-b border-gray-400 p-4">
      <div className="w-full flex flex-row flex-start items-center gap-2">
        <img
          className="rounded-full h-auto w-[40px] border border-gray-400"
          src="./logo2.png"
        />
        <h2 className="text-xl text-gray-100 font-light">Athena's Armory</h2>
      </div>
      <div>
        <div className="w-full flex font-open-sans flex-row flex-start gap-4 items-center text-gray-100 font-light">
          <p>About</p>
          <p>Gallery</p>
          <ConnectKitButton />
        </div>
      </div>
    </div>
  );
}

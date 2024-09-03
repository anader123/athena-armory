import Image from "next/image";

export default function ForgingItem() {
  return (
    <div className="flex sm:flex-row flex-col-reverse w-full justify-center sm:gap-40 gap-8 sm:my-20 my-10">
      <div className="flex flex-col justify-between sm:px-0 px-6 lg:w-[20%] md:w-[25%] w-full">
        <div className="w-full">
          <div className="display-table w-full animate-pulse">
            <h2 className="text-3xl border-b border-white m-0 inline">
              Forging New Item...
            </h2>
            <p className="font-open-sans text-gray-500 table-caption p-1 mt-2 text-md">
              The Gods are currently working on creating a new item for the
              armory. Almost ready...
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center sm:w-[30vw] sm:h-[30vw] sm:px-0 px-6">
        <Image
          className="border-2 border-gray-700 rounded-lg h-full object-cover opacity-80"
          src="/forge-loading.webp"
          alt="item-img"
          height={1024}
          width={1024}
        />
      </div>
    </div>
  );
}

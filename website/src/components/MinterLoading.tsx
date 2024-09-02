export default function MinterLoading() {
  return (
    <div className="flex sm:flex-row flex-col-reverse w-full justify-center sm:gap-40 gap-8 sm:my-20 my-10">
      <div className="flex flex-col justify-between sm:px-0 px-6 lg:w-[20%] md:w-[25%] w-full">
        <div className="w-full">
          <div className="w-full">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-700 rounded w-full animate-pulse"></div>
        </div>
      </div>

      <div className="flex justify-center sm:w-[30vw] w-full sm:h-[30vw] h-[80vw] sm:px-0 px-6">
        <div className="border-2 border-gray-700 rounded-md h-full w-full bg-gray-700 animate-pulse"></div>
      </div>
    </div>
  );
}

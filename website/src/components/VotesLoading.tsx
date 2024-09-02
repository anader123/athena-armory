export default function VotesLoading() {
  if (true) {
    return (
      <div className="flex flex-col sm:p-16 px-8 gap-10 mb-10">
        <div className="display-table">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-3 animate-pulse"></div>
        </div>
        <div className="flex sm:flex-row flex-col sm:gap-20 gap-8 w-full">
          {[1, 2, 3].map((_, i) => (
            <div
              className="flex sm:flex-row flex-col sm:gap-4 gap-1 sm:w-[33%]"
              key={i}
            >
              <div className="flex-shrink-0">
                <div className="rounded-md bg-gray-700 sm:w-[125px] w-[100px] h-[125px] animate-pulse"></div>
              </div>
              <div className="text-sm flex flex-col justify-between w-full">
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

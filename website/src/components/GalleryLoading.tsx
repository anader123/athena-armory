export default function GalleryLoading() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-8 h-8 bg-gray-700 rounded sm:w-1/6 w-1/3 animate-pulse"></h1>
      <div className="w-full grid relative grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:gap-x-16 gap-y-9">
        {[...Array(6)].map((_, i) => (
          <ItemLoading key={i} />
        ))}
      </div>
    </div>
  );
}

function ItemLoading() {
  return (
    <div className="text-white p-6 bg-gray-900 border border-gray-600 rounded-md">
      <div className="flex flex-col items-center w-full">
        <div className="rounded-md border border-gray-600 bg-gray-700 h-[50vh] w-full animate-pulse"></div>
        <div className="mt-4 w-full flex items-center">
          <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse"></div>
          <div className="bg-gray-700 px-5 py-2 ml-4 rounded-md w-1/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

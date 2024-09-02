import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiFetcher } from "@/utils/fetcher";
import GalleryLoading from "./GalleryLoading";
import Image from "next/image";
export default function Gallery() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["fetchCurrentGallery"],
    queryFn: () => apiFetcher("gallery"),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <GalleryLoading />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-8">Gallery</h1>
      <div className="w-full grid relative grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:gap-x-16 gap-y-9">
        {data.map(({ token }: any, i: number) => {
          return (
            <Item
              key={token.name + token.tokenId}
              name={token.name}
              tokenId={token.tokenId}
              image={token.image}
              index={i}
            />
          );
        })}
      </div>
    </div>
  );
}

function Item({
  name,
  tokenId,
  image,
  index,
}: {
  name: string;
  tokenId: string;
  image: string;
  index: number;
}) {
  return (
    <div className="text-white p-6 bg-gray-900 border border-gray-600 rounded-md">
      <div className="flex flex-col items-center w-full">
        <Image
          src={image}
          alt={name}
          className="rounded-md border border-gray-600"
        />
        {index === 0 ? (
          <div className="mt-4 w-full flex items-center">
            <h4 className="text-lg w-full">{name}</h4>
            <Link
              className="font-open-sans bg-gray-600 px-5 rounded-md text-lg hover:opacity-70"
              href="/"
            >
              Mint
            </Link>
          </div>
        ) : (
          <h4 className="mt-4 text-lg sm:w-full">{name}</h4>
        )}
      </div>
    </div>
  );
}

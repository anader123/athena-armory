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
    <div className="sm:p-8 p-6">
      <h1 className="text-2xl mb-8">Gallery</h1>
      <div className="w-full grid relative grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:gap-x-16 gap-y-9">
        {data.map(({ token }: any, i: number) => {
          if (!token || !token.name || !token.tokenId || !token.image) {
            return null;
          }

          return (
            <Item
              key={token.name + token.tokenId}
              name={token.name}
              description={token.description}
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
  description,
  tokenId,
  image,
  index,
}: {
  name: string;
  description: string;
  tokenId: string;
  image: string;
  index: number;
}) {
  return (
    <div className="text-white rounded-md">
      <div className="flex flex-col items-center w-full">
        <h4 className="text-lg w-full">{name}</h4>

        <Image
          src={image}
          alt={name}
          className="rounded-md border-2 sm:border-gray-500 border-gray-600"
          width={1024}
          height={1024}
        />
        <p className="font-open-sans text-gray-400 text-sm my-5 mx-1">
          {description}
        </p>
      </div>
    </div>
  );
}

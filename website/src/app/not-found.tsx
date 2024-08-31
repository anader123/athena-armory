import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex items-center justify-center h-screen text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-8 font-open-sans">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/" className="hover:underline mt-5">
          Click here to go back to the Armory ⚔️
        </Link>
      </div>
    </div>
  );
}

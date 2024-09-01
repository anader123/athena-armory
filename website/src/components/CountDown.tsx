import { useEffect, useState } from "react";

export default function CountDown() {
  const [now, setNow] = useState(Date.now());
  const EPOCH_DURATION = 86400; // 1 Day
  const STARTED_AT = +(process.env.NEXT_PUBLIC_STARTED_AT as string);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(timer);
  }, []);

  const difference =
    EPOCH_DURATION - (Math.floor(now / 1_000 - STARTED_AT) % EPOCH_DURATION);
  const hours = Math.floor((difference / (60 * 60)) % 24);
  const minutes = Math.floor((difference / 60) % 60);
  const seconds = Math.floor(difference % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="sm:mt-8 mt-4 inline-block">
      <p>Mint Ends In:</p>
      <p className="text-xl mt-1">
        {[hours, minutes, seconds].map(pad).join(":")}
      </p>
    </div>
  );
}

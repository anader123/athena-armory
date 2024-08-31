import { useState } from "react";

export default function Minter() {
  const [howMany, setHowMany] = useState(1);

  return (
    <div className="flex flex-row w-full justify-center gap-40 my-20">
      <div className="flex flex-col justify-between h-[30vw]">
        <div>
          <div className="display-table">
            <h2 className="text-3xl border-b border-white m-0">
              Medusa’s Gorgon Shield
            </h2>
            <p className="font-open-sans text-gray-500 table-caption p-1 mt-2 text-sm">
              A beautifully crafted shield embellished with Medusa’s head,
              featuring majestic golden wings and intricate etchings.
            </p>
          </div>
          <div className="mt-8 inline-block">
            <p>Mint Ends In:</p>
            <p className="text-xl mt-1">21:53:43</p>
          </div>
        </div>

        <div>
          <Stepper
            value={howMany}
            onChange={(newHowMany) => {
              setHowMany(newHowMany);
            }}
          />
          <button className="w-full font-open-sans text-black bg-gray-300 rounded-md py-2">
            Mint
          </button>
          <p className="w-full text-center font-open-sans mt-4 text-gray-500 text-sm">
            {0.000777 * howMany} ETH
          </p>
        </div>
      </div>

      <div className="flex items-center w-[30vw] h-[30vw]">
        <img
          className="border-2 border-gray-300 rounded-md h-full object-cover "
          src="/test.png"
          alt="item-img"
        />
      </div>
    </div>
  );
}

function Stepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const options = [
    1, 2, 3, 4, 5, 7, 10, 15, 20, 25, 30, 40, 42, 50, 69, 75, 100, 200, 300,
    420, 690, 1000,
  ];
  const index = options.findLastIndex((option) => option <= value);
  const prev = options[index - 1] ?? 1;
  const next = options[index + 1] ?? 1000;

  return (
    <div className="flex flex-row items-center text-gray-300 justify-center gap-8 mint my-4 font-open-sans">
      <button
        type="button"
        className="w-8 h-8 rounded-md bg-[--accent] font-viga text-xl active:pt-0.5 "
        onClick={() => onChange(prev)}
        disabled={value <= 1}
      >
        -
      </button>
      <div className="tabular-nums text-xl">
        <p>{value}</p>
      </div>
      <button
        type="button"
        className="w-8 h-8 rounded-md bg-[--accent] font-viga text-xl active:pt-0.5 "
        onClick={() => onChange(next)}
        disabled={value >= 1000}
      >
        +
      </button>
    </div>
  );
}

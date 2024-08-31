export default function Stepper({
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

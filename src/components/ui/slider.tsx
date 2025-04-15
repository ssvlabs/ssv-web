import type { ChangeEvent } from "react";

const Slider = ({
  value,
  setValue,
  maxValue = 100,
}: {
  value: number;
  setValue: (value: number) => void;
  maxValue: number;
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(Number(e.target.value).toFixed(2));
    setValue(newValue);
  };

  return (
    <div className="relative w-[280px] h-1.5 bg-primary-100 rounded-full">
      <div
        className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
        style={{ width: `${(value / maxValue) * 100}%` }}
      ></div>
      <input
        type="range"
        min="0"
        max={maxValue}
        step="0.01"
        value={value}
        onChange={handleChange}
        className="absolute w-full h-full appearance-none bg-transparent cursor-pointer"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </div>
  );
};

export default Slider;

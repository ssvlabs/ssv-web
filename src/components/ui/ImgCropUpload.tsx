import type { ChangeEvent } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip.tsx";

const ImgCropUpload = ({
  value,
  setValue,
}: {
  value: File | string;
  setValue: (value: File | string) => void;
  defaultValue?: string;
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValue(selectedFile);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center rounded-[8px] overflow-hidden cursor-pointer group"
      style={{
        width: "82px",
        height: "82px",
        border: value ? "none" : "1px solid #d3d3d3",
        backgroundImage: value
          ? `url(${value instanceof File ? URL.createObjectURL(value) : value})`
          : "url('/images/operator_default_background/operatorNoLogoBG.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {value ? (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 hover:opacity-60 transition-opacity duration-300">
          <label>
            <FaArrowsRotate
              title="Change Logo"
              className="text-[24px] size-5 text-white text-xl cursor-pointer opacity-100"
            />
            <input
              type="file"
              onChange={handleChange}
              accept=".png, .jpg"
              style={{
                display: "none",
              }}
            />
          </label>
        </div>
      ) : (
        <label className="text-primary-500 text-xs cursor-pointer flex items-center justify-center w-full h-full">
          <span className="text-primary-500 text-xs">Add Image</span>
          <input
            type="file"
            onChange={handleChange}
            accept=".png, .jpg"
            style={{
              opacity: 0,
              position: "absolute",
              cursor: "pointer",
              width: "100%",
              height: "100%",
            }}
          />
        </label>
      )}
    </div>
  );
};

export default ImgCropUpload;

import type { ChangeEvent } from "react";
import { FaArrowRightArrowLeft, FaArrowsRotate, FaEye } from "react-icons/fa6";

const ImgCropUpload = ({
  value,
  setValue,
  defaultValue,
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

  const handleDelete = () => {
    setValue(defaultValue || "");
  };

  const handlePreview = () => {
    if (value instanceof File) {
      window.open(URL.createObjectURL(value), "_blank");
    } else {
      window.open(value, "_blank");
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
          : "url('/images/operator_default_background/light.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {value ? (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 hover:opacity-60 transition-opacity duration-300">
          <FaEye
            className="text-[24px] size-5 text-white text-xl cursor-pointer opacity-100"
            onClick={handlePreview}
            title="Preview"
          />
          <label>
            <FaArrowRightArrowLeft
              className="text-[24px] size-5 text-white text-xl cursor-pointer opacity-100"
              title="Change Photo"
            />
            <input
              type="file"
              onChange={handleChange}
              accept="image/*"
              style={{
                display: "none",
              }}
            />
          </label>
          {value instanceof File && (
            <FaArrowsRotate
              className="text-[10px] size-5 text-white text-xl cursor-pointer opacity-100"
              onClick={handleDelete}
              title="Delete"
            />
          )}
        </div>
      ) : (
        <label className="text-primary-500 font-semibold text-xs cursor-pointer flex items-center justify-center w-full h-full">
          <span className="text-primary-500 font-semibold text-xs">
            Add Image
          </span>
          <input
            type="file"
            onChange={handleChange}
            accept="image/*"
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

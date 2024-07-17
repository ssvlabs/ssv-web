import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { useKeystoreValidation } from "@/hooks/use-keystore-validation";
import { createClusterFlow } from "@/signals/create-cluster-signals";
import { Paperclip } from "lucide-react";
import { type ComponentPropsWithoutRef, type FC } from "react";
import { DropzoneOptions } from "react-dropzone";

export type GenerateKeySharesOnlineProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof GenerateKeySharesOnlineProps> &
    GenerateKeySharesOnlineProps
>;
const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </>
  );
};

export const GenerateKeySharesOnline: FCProps = () => {
  const dropZoneConfig: DropzoneOptions = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: {
      "application/json": [".json"],
    },
  };

  const files = createClusterFlow.keystoreFile.value
    ? [createClusterFlow.keystoreFile.value]
    : null;

  const validation = useKeystoreValidation(
    createClusterFlow.keystoreFile.value,
  );

  return (
    <FileUploader
      value={files}
      onValueChange={(files) => {
        return (createClusterFlow.keystoreFile.value = files?.at(-1) ?? null);
      }}
      dropzoneOptions={dropZoneConfig}
      className="relative bg-background rounded-lg p-2"
    >
      <FileInput className="outline-dashed outline-1 outline-white">
        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
          <FileSvgDraw /> {validation.isPending ? "checking file..." : ""}
          {validation.error ? (
            <div className="text-red-500 text-xs mt-2">invalid file</div>
          ) : null}
        </div>
      </FileInput>
      <FileUploaderContent>
        {files &&
          files.length > 0 &&
          files.map((file, i) => (
            <FileUploaderItem key={i} index={i}>
              <Paperclip className="h-4 w-4 stroke-current" />
              <span>{file.name}</span>
            </FileUploaderItem>
          ))}
      </FileUploaderContent>
    </FileUploader>
  );
};

GenerateKeySharesOnline.displayName = "GenerateKeySharesOnline";

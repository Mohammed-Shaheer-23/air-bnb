"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUploadComponent: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleUpload = (result: any) => {
    if (result?.info?.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  if (!isClient) return null; // Prevents SSR rendering

  return (
    <CldUploadWidget
      uploadPreset="sample"
      options={{ maxFiles: 1, folder: "" }}
      onSuccess={(result: any) => handleUpload(result)}
    >
      {({ open }) => (
        <div
          onClick={() => open?.()}
          className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
        >
          {!value ? (
            <>
              <TbPhotoPlus size={50} />
              <div className="font-semibold text-lg">Click to upload</div>
            </>
          ) : (
            <div className="relative w-64 h-64"> {/* Specify a container size */}
              <Image
                alt="Uploaded image"
                src={value}
                layout="fill" // Ensures the image fills the parent container
                objectFit="cover" // Maintains aspect ratio and covers the area
                className="rounded-md" // Optional: add rounded corners
              />
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default ImageUploadComponent;

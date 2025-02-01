'use client';

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures that Cloudinary loads only on the client side
  }, []);

  
 const handleUpload = (result : any) =>  {
  console.log("Upload Result:", result); // Debugging
  if (result?.info?.secure_url) {
    
    // Add the uploaded image URL to the existing array
   // onChange([...value, result.info.secure_url]);
   onChange(result.info.secure_url);
  }
 }
  if (!isClient) {
    return null; // Avoid rendering Cloudinary on the server side
  }

  return (
    <div>
      <CldUploadWidget
       onUpload={(result) => {
        console.log("Cloudinary onUpload fired:", result); // Debugging
        handleUpload(result);
      }}
        uploadPreset="sample" // Your Cloudinary upload preset
        options={{
          maxFiles: 1, // Allow only one file at a time
          folder: '', // Cloudinary folder to save uploads
        }}
      >
        {({ open }) => (
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
          >
            {!value.length ? (
              // Display upload prompt if no image is uploaded
              <>
                <TbPhotoPlus size={50} />
                <div className="font-semibold text-lg">Click to upload</div>
              </>
            ) : (
              // Display uploaded images
              <div className="absolute inset-0 w-full h-full">
                {value.map((src, index) => (
                  <Image
                    key={index}
                    alt={`Uploaded image ${index + 1}`}
                    src={src}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;

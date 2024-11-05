"use client";

import React, { useCallback, useEffect, useState } from "react"; 
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEdgeStore } from "../../../lib/edgestore";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [file, setFile] = useState<File | null>(null); 
  const [uploadProgress, setUploadProgress] = useState<number>(0); 
  const [uploadComplete, setUploadComplete] = useState<boolean>(false); 
  const [imageData, setImageData] = useState<{ _id: string; image: string } | null>(null); // State to hold fetched image data
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  useEffect(() => {
    // Fetch the image data on component mount
    const fetchImageData = async () => {
      try {
        const response = await fetch("/api/img"); // Adjust this URL to your actual endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch image data.");
        }
        const data = await response.json();
        setImageData(data[0]); // Assuming data returns an array and we want the first item
      } catch (error) {
        console.error(error);
        toast.error("Failed to load image data.");
      }
    };

    fetchImageData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadProgress(0);
      setUploadComplete(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadProgress(0);
      setUploadComplete(false);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const response = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress: number) => {
            setUploadProgress(progress); 
          },
        });

        const updateResponse = await fetch("/api/updateProfileImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: response.url }), 
        });

        if (!updateResponse.ok) {
          throw new Error("Failed to update profile image in database.");
        }

        setUploadComplete(true);
        setUploadProgress(0);
        setFile(null); 

      } catch (error) {
        console.error(error);
        toast.error("Failed to update profile image.");
      }
    }
  };

  useEffect(() => {
    if (uploadComplete) {
      toast.success("Upload successful!");
      window.location.reload(); 
    }
  }, [uploadComplete]);

  return (
    <ContentLayout title="Profile">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Upload Your Profile Picture</h2>
        <p className="text-gray-600 mb-4">
          Please drag and drop an image file here, or click to select one.
        </p>

        {/* Preview Component */}
        {imageData && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Current Profile Picture:</h3>
            <img src={imageData.image} alt="Profile" className="rounded-lg border-2 border-gray-300" />
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer ${
            file ? "border-green-500" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          {file ? (
            <p className="text-gray-700">File: {file.name}</p>
          ) : (
            <p className="text-gray-400">Drag and drop your file here, or click to upload.</p>
          )}
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <button
          onClick={handleUpload}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Upload
        </button>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">{uploadProgress}%</p>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}

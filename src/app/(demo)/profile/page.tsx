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
import { toast } from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CSpinner } from "@coreui/react";
import { Upload, ImageIcon, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [imageData, setImageData] = useState<{ _id: string; image: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch("/api/img");
        if (!response.ok) {
          throw new Error("Failed to fetch image data.");
        }
        const data = await response.json();
        setImageData(data[0]);
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upload Your Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {imageData && (
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Current Picture</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary cursor-pointer hover:opacity-80 transition-opacity">
                      <img src={imageData.image} alt="Profile" className="object-inherit w-full h-full" />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Profile Picture</DialogTitle>
                      <DialogDescription>Your current profile picture</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 relative aspect-square w-full max-h-[80vh] overflow-hidden rounded-md">
                      <img src={imageData.image} alt="Profile" className="object-inherit w-full h-full" />
                    </div>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(false)}>Close</Button>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            <div className="flex flex-col items-center justify-center">
              <div
                className={`w-full h-40 border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  file ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary hover:bg-primary/5"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                {file ? (
                  <>
                    <ImageIcon className="w-12 h-12 text-primary mb-2" />
                    <p className="text-sm text-gray-600">{file.name}</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">
                      Drag and drop your file here, or click to upload
                    </p>
                  </>
                )}
              </div>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />

              <Button
                onClick={handleUpload}
                className="mt-4 w-full"
                disabled={!file || uploadProgress > 0}
              >
                {uploadProgress > 0 ? 'Uploading...' : 'Upload'}
              </Button>

              {uploadProgress > 0 && (
                <div className="w-full mt-4">
                  <CSpinner className="w-full" />
                  <p className="text-sm text-gray-600 mt-1 text-center">{uploadProgress}%</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}


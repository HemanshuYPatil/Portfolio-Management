"use client";

import Link from "next/link";
import { Eye, Trash2, ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CSpinner } from '@coreui/react';

interface WorkItem {
  _id: string;
  title: string;
  date: string;
  description: string;
  link: string;
}

async function fetchWorkData(): Promise<WorkItem[]> {
  const res = await fetch("/api/unactive-projects/fetch");
  const data = await res.json();
  return data;
}

async function deleteWorkItem(id: string) {
  const response = await fetch("/api/unactive-projects/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  if (!response.ok) {
    toast.error("Failed to delete project.");
  }

  return await response.json();
}

export default function WorkCards() {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedWorkItem, setSelectedWorkItem] = useState<WorkItem | null>(null);
  const [deletebtn, setdeletebtn] = useState(false);

  useEffect(() => {
    async function loadWorkData() {
      const data = await fetchWorkData();
      setWorkItems(data);
    }
    loadWorkData();
  }, []);

  const handleDelete = async () => {
    if (selectedWorkItem) {
      setdeletebtn(true);
      try {
        await deleteWorkItem(selectedWorkItem._id);
        setWorkItems((prev) =>
          prev.filter((item) => item._id !== selectedWorkItem._id)
        );
        setdeletebtn(false);
        setDeleteDialogOpen(false);
        setSelectedWorkItem(null);
        toast.success("Project Deleted successfully!");
      } catch (error) {
        console.error("Failed to delete the project:", error);
      }
    }
  };

  return (
    <div className="overflow-y-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workItems.map((item, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{item.date}</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <Button 
                  className="flex-1 gap-2"
                  onClick={() => {
                    setSelectedWorkItem(item);
                    setViewDialogOpen(true);
                  }}
                >
                  <Eye />
                  View Details
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 md:flex-none w-auto text-sm px-2 py-1 flex items-center gap-1"
                  onClick={() => {
                    setSelectedWorkItem(item);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Dialog for Deletion Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this project?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>

            {deletebtn ? (
              <Button variant="destructive" onClick={handleDelete} disabled>
                <CSpinner as="span" size="sm" aria-hidden="true" />
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Viewing Project Details */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedWorkItem?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p><strong>Date:</strong> {selectedWorkItem?.date}</p>
            <p><strong>Description:</strong> {selectedWorkItem?.description}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => window.open(selectedWorkItem?.link, '_blank')}
              className="gap-2"
            >
              Visit Site
              <ExternalLink className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


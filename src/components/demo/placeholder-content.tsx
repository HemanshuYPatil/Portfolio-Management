"use client";

import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
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
}

async function fetchWorkData(): Promise<WorkItem[]> {
  const res = await fetch("/api/work");
  const data = await res.json();
  return data;
}

async function deleteWorkItem(id: string) {
  const response = await fetch("/api/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });



  if (response.ok) {
    
  } else {
    
    toast.error("Failed to delete project.");
  }

  return await response.json();
}

export default function WorkCards() {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [deletebtn, setdeletebtn] = useState(false);

  useEffect(() => {
    async function loadWorkData() {
      const data = await fetchWorkData();
      setWorkItems(data);
    }
    loadWorkData();
  }, []);

  const handleDelete = async () => {
    if (selectedWorkId) {
      setdeletebtn(true);
      try {
        await deleteWorkItem(selectedWorkId);
        setWorkItems((prev) =>
          prev.filter((item) => item._id !== selectedWorkId)
        );
        setdeletebtn(false);
        setDialogOpen(false);
        setSelectedWorkId(null);
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
                <Button className="flex-1 gap-2">
                  <Eye />
                  <Link href={`/projects/${item._id}`}>View Projects</Link>
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 md:flex-none w-auto text-sm px-2 py-1 flex items-center gap-1"
                  onClick={() => {
                    setSelectedWorkId(item._id);
                    setDialogOpen(true);
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this project?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
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
    </div>
  );
}

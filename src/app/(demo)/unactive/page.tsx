'use client'

import { useState } from "react";
import Link from "next/link";

import UnactiveCard from "@/components/demo/unactive";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
// import UnactiveProjects from "@/components/demo/unactive";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function UnactiveProjects() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectData, setProjectData] = useState({
    title: '',
    date: '',
    link: '',
    description: '',
    technologies: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newProject = {
      title: projectData.title,
      date: projectData.date,
      link: projectData.link,
      description: projectData.description,
      technologies: projectData.technologies.split(',').map(tech => tech.trim()),
    };
  
    
      
    try {
      const response = await fetch("/api/unactive-projects/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });
  
      if (response.ok) {
        toast.success("Project created successfully!");
      } else {
        toast.error("Failed to create project.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the project.");
    }
    
    // Close the dialog and reset the form
    setIsDialogOpen(false);
    setProjectData({
        title: '',
        date: '',
        link: '',
        description: '',
        technologies: '',
      });
  };
  

  return (
    <ContentLayout title="Unactive Projects">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Unactive Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={projectData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    value={projectData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    name="link"
                    type="url"
                    value={projectData.link}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={projectData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                  <Input
                    id="technologies"
                    name="technologies"
                    value={projectData.technologies}
                    onChange={handleInputChange}
                    placeholder="React, Next.js, TypeScript"
                    required
                  />
                </div>
                <Button type="submit">Add</Button>
              </form>
            </DialogContent>
          </Dialog>
        </BreadcrumbList>
      </Breadcrumb>


      <UnactiveCard />
      
    </ContentLayout>
  );
}


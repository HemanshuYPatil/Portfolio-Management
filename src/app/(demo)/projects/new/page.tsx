"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useRouter } from 'next/navigation'

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [id, setImageId] = useState("");
  const [link, setLink] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");

  const handleAddRole = () => {
    if (newRole.trim() !== "") {
      setRoles((prevRoles) => Array.from(new Set([...prevRoles, newRole.trim()])));
      setNewRole("");
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRoles((prevRoles) => prevRoles.filter((role) => role !== roleToRemove));
  };

  const handleSubmit = async () => {
    const updatedPost = {
      id, 
      title,
      // details: {
        description,
        summary,
      // },
      date,
      roles: [...new Set(roles)],
      links: [{ type: "web", text: "Visit Site", link }],
    };

    try {
      const response = await fetch("/api/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        toast.success("Project created successfully!");
        router.push('/projects');
      } else {
        toast.error("Failed to create project.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the project.");
    }
  };

  

  return (
    <ContentLayout title="New Post">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/posts">Project</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 space-y-8">
        {/* Form for editing post */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white">Title</label>
            <Input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Date</label>
            <Input
              type="text"
              placeholder="Enter date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium text-white">Summary</label>
            <Select onValueChange={setSummary}>
              <SelectTrigger>
                <SelectValue placeholder="Select Summary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web Application">Web Application</SelectItem>
                <SelectItem value="Android Application">Android Application</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <label className="block text-sm font-medium text-white">Image Id</label>
            <Select onValueChange={setImageId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Image Id" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grillzzy">grillzzy</SelectItem>
                <SelectItem value="kic">kic</SelectItem>
                <SelectItem value="kwa">kwa</SelectItem>
                <SelectItem value="lcml">lcml</SelectItem>
                <SelectItem value="slickscroll">slickscroll</SelectItem>
                <SelectItem value="v1">v1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-white">Description</label>
            <Textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Link</label>
          <Input
            type="text"
            placeholder="Enter Link of Project"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Roles Management */}
        <div className="bg-gray-800 p-4 rounded-md">
          <h3 className="text-lg font-medium text-white">Technology Management</h3>
          <div className="flex items-center space-x-2 mt-4">
            <Input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Add a new technology"
            />
            <Button onClick={handleAddRole} className="whitespace-nowrap">
              Add Role
            </Button>
          </div>
          <div className="mt-4">
            <p className="text-white">Current Technologies:</p>
            {roles.map((role, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700 rounded-md p-2 mt-2">
                <span className="text-white">{role}</span>
                <Button onClick={() => handleRemoveRole(role)} variant="destructive">
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSubmit} className="w-full">
            Create Project
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
  
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    async function fetchWorkData() {
      try {
        const res = await fetch(`/api/pro/${id}`);
        const data = await res.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    }

    fetchWorkData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updatedPost = {
        id: post.id,
        title: post.title,
        details: {
          description: post.details.description,
          summary: post.details.summary
        },
        date: post.date,
        roles: [...new Set(post.roles)], // Ensure unique roles
        links: Array.isArray(post.links)
          ? post.links.map((link: { type: any; text: any; link: any; }) => ({
              type: link.type || "web", // Ensure default 'type' if not provided
              text: link.text || "Visit Site", // Ensure default 'text' if not provided
              link: link.link || "" // Ensure 'link' field exists
            }))
          : [] // Ensure links is an array with correct structure
      };

      const res = await fetch(`/api/update-project/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedPost)
      });

      if (res.ok) {
        toast.success("Data Updated.");
      } else {
        const errorData = await res.json();
        toast.error(`${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post.");
    }
  };

  const handleAddRole = () => {
    if (newRole.trim() !== "") {
      setPost((prevPost: { roles: any; }) => ({
        ...prevPost,
        roles: Array.from(new Set([...prevPost.roles, newRole.trim()])) // Prevent duplicates
      }));
      setNewRole(""); // Clear the input after adding
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setPost((prevPost: { roles: any[]; }) => ({
      ...prevPost,
      roles: prevPost.roles.filter((role: string) => role !== roleToRemove) // Remove the specified role
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>No post found.</div>;
  }

  interface Link {
    link: string;
    type?: string;
    text?: string;
  }
  
  interface Post {
    links: Link[];
    // Add other properties of 'post' as needed
  }
  
 
  
  return (
    <ContentLayout title={`${post.title}`}>
      {/* Breadcrumbs */}
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
              <Link href="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 space-y-8">
        {/* Form for editing post */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white">
              Title
            </label>
            <Input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Date</label>
            <Input
              type="text"
              value={post.date}
              onChange={(e) => setPost({ ...post, date: e.target.value })}
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium text-white">
              Summary
            </label>

            <Select
              value={post.details.summary}
              onValueChange={(value) =>
                setPost({
                  ...post,
                  details: { ...post.details, summary: value }
                })
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {post.details.summary || "Select option"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Web Application</SelectItem>
                <SelectItem value="option2">Android Application</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-white">
              Image Id
            </label>

            <Select
              value={post.id}
              onValueChange={(value) =>
                setPost({
                  ...post,
                  id: value
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={post.id || "Select Image ID"} />
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
            <label className="block text-sm font-medium text-white">
              Description
            </label>
            <Textarea
              value={post.details.description}
              onChange={(e) =>
                setPost({
                  ...post,
                  details: { ...post.details, description: e.target.value }
                })
              }
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-white">
              Links
            </label>

            {post.links && post.links.length > 0 ? (
              post.links.map((link: Link, index: number) => (
                <div key={index} className="flex items-center mt-2">
                  <Input
                    type="text"
                    value={link.link} // Set the value to the link
                    onChange={(e) => {
                      // Update the link on change
                      const updatedLinks = [...post.links];
                      updatedLinks[index].link = e.target.value;
                      setPost({ ...post, links: updatedLinks });
                    }}
                    className="mr-2 flex-grow"
                  />
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {/* {link.text || "Visit Site"} */}
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No links available</p>
            )}
          </div>

        {/* Roles Management */}
        <div className="bg-gray-800 p-4 rounded-md">
          <h3 className="text-lg font-medium text-white">
            Technology Management
          </h3>
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
            {post.roles.map((role: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 rounded-md p-2 mt-2"
              >
                <span className="text-white">{role}</span>
                <Button
                  onClick={() => handleRemoveRole(role)}
                  variant="destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleUpdate} className="w-full">
            Update
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}

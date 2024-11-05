"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Fetch data from API
async function fetchWorkData() {
  const res = await fetch("/api/work");
  const data = await res.json();
  return data;
}

export default function WorkCards() {
  const [workItems, setWorkItems] = useState([]);

  useEffect(() => {
    async function loadWorkData() {
      const data = await fetchWorkData();
      setWorkItems(data);
    }
    loadWorkData();
  }, []);

  return (
    <div className=" overflow-y-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workItems.map((item, index) => (
          <Card key={index} className={cn("w-full")}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none"> {item.date}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full gap-2">
                <Eye /> <Link href={`/projects/${item._id}`}>View Projects</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

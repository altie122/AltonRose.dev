"use client";

import { useEffect, useState } from "react";
import * as Card from "./ui/card";
import type { githubStatsType, projectsType } from "@/lib";
import { Badge } from "./ui/badge";
import GithubButton from "./github-button";

export function ProjectCard({ project }: { project: projectsType }) {
  // Use a more descriptive state for loading/data/error
  const [githubDataState, setGithubDataState] = useState<
    { status: "idle" } | { status: "loading" } | { status: "success"; data: githubStatsType } | { status: "error" }
  >(
    typeof project.opensource === "string" ? { status: "loading" } : { status: "idle" }
  );

  useEffect(() => {
    if (typeof project.opensource === "string" && githubDataState.status === "loading") {
      fetch(`/api/githubstats/${project.opensource}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: githubStatsType) => {
          setGithubDataState({ status: "success", data: data });
        })
        .catch((error) => {
          console.error("Error fetching GitHub data:", error);
          setGithubDataState({ status: "error" });
        });
    }
  }, [project.opensource, githubDataState.status]);

  const showOpenSourceBadge = githubDataState.status === "success" || githubDataState.status === "loading";

  return (
    <Card.LinkedCard href={`/portfolio/${project.id}`}>
      <Card.CardHeader>
        <Card.CardTitle className='flex flex-row justify-between gap-2'>
          <div className='flex flex-row gap-2'>
            {project.title}
            {showOpenSourceBadge && <Badge variant={"outline"}>Open Source</Badge>}
          </div>
          {typeof project.opensource === "string" && (
            // Conditionally render GithubButton based on the state
            githubDataState.status === "success" ? (
              <GithubButton repoPath={project.opensource} stars={githubDataState.data.stars} />
            ) : githubDataState.status === "loading" ? (
              // You can show a skeleton or a disabled button here
              <GithubButton repoPath={project.opensource} />
            ) : (
              // Handle error state or just render the button without stars if there was an error
              <GithubButton repoPath={project.opensource} />
            )
          )}
        </Card.CardTitle>
        <Card.CardDescription>{project.description}</Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent>
        <img
          src={project.imageURL}
          alt={project.title}
          className='w-full h-auto object-cover rounded-lg'
        />
      </Card.CardContent>
    </Card.LinkedCard>
  );
}
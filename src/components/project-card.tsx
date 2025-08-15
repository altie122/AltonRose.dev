"use client";

import { useEffect, useState } from "react";
import * as Card from "./ui/card";
import type { githubStatsType, projectsType } from "@/lib";
import { Badge } from "./ui/badge";
import GithubButton from "./github-button";

export function ProjectCard({ project }: { project: projectsType }) {
  const [githubData, setGithubData] = useState<githubStatsType | true | null>(typeof project.opensource === "string" ? true : null)
  return (
    <Card.LinkedCard href={`/portfolio/${project.id}`}>
      <Card.CardHeader>
        <Card.CardTitle className="flex flex-row justify-between gap-2"><div className="flex flex-row gap-2">{project.title}{githubData && <Badge variant={"outline"}>Open Source</Badge>}</div>{githubData && <GithubButton repoPath={project.opensource as string} />}</Card.CardTitle>
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

import type { githubStatsType } from "@/lib";
import type { APIRoute } from "astro";
import { Octokit } from "octokit";

export const GET: APIRoute = async ({ request }) => {
  // Get the Referer header
  const referer = request.headers.get("referer");

  if (!referer) {
    return new Response(JSON.stringify({ error: "Missing Referer header" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // Extract the domain from the Referer header
    const refererUrl = new URL(referer);
    const refererDomain = refererUrl.hostname;

    // Extract the domain of the current request
    const currentUrl = new URL(request.url);
    const currentDomain = currentUrl.hostname;

    // Compare the domains
    if (refererDomain !== currentDomain && refererDomain !== "altonrose.dev") {
      return new Response(
        JSON.stringify({ error: "Referer domain does not match" }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid Referer header" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Proceed with the rest of the logic

  const octokit = new Octokit()
  const repo = new URL(request.url).searchParams.get("repo");

  if (!repo) {
    return new Response(JSON.stringify({ error: "No repo provided" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const repoObject = {owner: repo.split("/")[0], repo: repo.split("/")[1]}

  const data = await octokit.rest.repos.get(repoObject)

  const response: githubStatsType = {
    stars: data.data.stargazers_count
  }
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
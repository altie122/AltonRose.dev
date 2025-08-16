import type { githubStatsType } from "@/lib";
import type { APIRoute } from "astro";
import { db, eq, GithubStatsCache } from "astro:db";
import { Octokit } from "octokit";

export const GET: APIRoute = async ({ request, params }) => {
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
        }
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

  const octokit = new Octokit();
  const repo_owner = params.owner;
  const repo_repo = params.repo;
  const repo = repo_owner && repo_repo && `${repo_owner}/${repo_repo}`;

  if (!repo) {
    return new Response(JSON.stringify({ error: "No repo provided" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const dbResponse = (
    await db
      .select()
      .from(GithubStatsCache)
      .where(eq(GithubStatsCache.id, repo))
  )[0];

  let response: githubStatsType;

  const currentTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!dbResponse) {
    const repoObject = { owner: repo_owner, repo: repo_repo };

    const data = await octokit.rest.repos.get(repoObject);

    response = {
      stars: data.data.stargazers_count,
    };

    await db
      .insert(GithubStatsCache)
      .values({ id: repo, stars: data.data.stargazers_count });
  } else if (dbResponse.cacheExpiresAt <= currentTimestampSeconds) {
    const repoObject = { owner: repo_owner, repo: repo_repo };

    const data = await octokit.rest.repos.get(repoObject);

    response = {
      stars: data.data.stargazers_count,
    };

    await db.update(GithubStatsCache).set({
      id: repo,
      stars: data.data.stargazers_count,
      currentCycleStartedAt: currentTimestampSeconds,
      cacheExpiresAt:
        currentTimestampSeconds +
        Math.floor(Math.random() * (10 * 24 * 60 * 60 - 5 * 24 * 60 * 60 + 1)) +
        5 * 24 * 60 * 60,
    });
  } else {
    response = {
      stars: dbResponse.stars,
    };
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// pages/api/roast.ts (or pages/api/roast.js if using JavaScript)

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Helper function to fetch user repos
async function fetchUserRepos(username: string, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
        const response = await axios.get(
            `https://api.github.com/users/${username}/repos`,
            {headers}  
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching repos:", error);
        throw new Error(`Error fetching repos for user ${username}`);
    }
}

// Helper function to fetch commit history for a given repo
async function fetchRepoCommits(repoUrl: string, accessToken?:string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    try {
        const response = await axios.get(repoUrl,{ headers , params: { per_page: 50 }}
        );
        return response.data
    } catch (error){
        console.error(`Error fetching commits for ${repoUrl}`, error)
        throw new Error(`Error fetching commits for ${repoUrl}`)
    }
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");
//   const accessToken = searchParams.get("accessToken");


  if (!handle) {
    return NextResponse.json({ error: "GitHub handle is required" }, { status: 400 });
  }

  try {
    //1. Fetch User Information
    const userResponse = await axios.get(`https://api.github.com/users/${handle}`);
    const userData = userResponse.data;
    const username = userData.login

    //2. Fetch Repositories
    const repos = await fetchUserRepos(username, "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");

    if (!repos || repos.length === 0) {
      return NextResponse.json({ message: "No public repos found for this user." }, { status: 200 });
    }

    // 3. Extract Commits from each repo
    const allCommits = await Promise.all(
        repos.map(async (repo: any) => {
            const commitsUrl = repo.commits_url.replace("{/sha}", "")
            return fetchRepoCommits(commitsUrl, "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");
        })
    )

    //4. Process Commits
    const processedCommits = allCommits.flat().map((commit: any) => ({
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: commit.html_url,
    }))

    // For demonstration purposes, we are only returning the user data and processed commits
    console.log(processedCommits);
    

    return NextResponse.json({
      user: userData,
      commits: processedCommits,
      message: "commits successfully fetched",
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error in /api/roast:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch data" }, { status: 500 });
  }
}
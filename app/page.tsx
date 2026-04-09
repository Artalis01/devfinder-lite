"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"stars" | "updated">("stars");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (document.activeElement === inputRef.current) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const fetchUserData = async () => {
    if (!username) {
      setError("Please enter a username.");
      return;
    }
    
    setLoading(true);
    setError("");
    setUserData(null);
    setRepos([]);

    try {
      //fetch user data from GitHub API
      const userResponse = await fetch(`https://api.github.com/users/${username}`);

      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          throw new Error("User not found.");
        }
        throw new Error("An error occurred while fetching data.");  
      } 

      const data = await userResponse.json();
      setUserData(data);

      //fetch user repos
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);

      if (!reposResponse.ok) {
        throw new Error("An error occurred while fetching repositories.");
      }

      const reposData = await reposResponse.json();
      setRepos(reposData);

    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const sortedRepos = [...repos].sort((a, b) => {
    if (sortBy === "stars") {
      return b.stargazers_count - a.stargazers_count;
    } else {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const displayRepos = sortedRepos.slice(0,5);

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-center text-gray-900">
        DevFinder Lite
      </h1>

      <p className="text-gray-500 mt-2 text-center">
        Search and explore GitHub users
      </p>

      <div className="flex gap-2 mt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!username.trim()) return;
            fetchUserData();}}
          className="flex gap-2 mt-6"
        > 
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-64"
          />

          <button
            type="submit"
            disabled={!username.trim() || loading}
            className="bg-blue-500 text-white px-4 py-2 rounded
                      hover:bg-blue-600
                      disabled:opacity-50
                      disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
      <div className="mt-4">
        {!userData && !loading && !error && (
          <div className="mt-10 text-gray-500 text-center">
            <p>Search for a GitHub user</p>
            <p className="text-sm">Try: artalis01</p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-500 font-semibold">{error}</p>
            <p className="text-sm text-gray-500 mt-1">
              Please try another username.
            </p>
          </div>
        )}

        {userData && (
          <div className="relative mt-6 bg-white p-4 rounded shadow w-full max-w-md text-center">
            
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            <img
              src={userData.avatar_url} alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto"
            />
            <h2 className="text-xl font-bold mt-2">
              <a
                href={userData.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {userData.name || userData.login}
              </a>
            </h2>
            <p className="text-sm text-gray-500">@{userData.login}</p>
            <p className="mt-2 text-sm text-gray-600">
              {userData.bio || "No bio available"}
            </p>
            <p className="mt-2">Followers: {userData.followers}</p>
            <p className="mt-1 text-sm text-gray-500">
              {userData.public_repos} repositories
            </p>
            <a
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm mt-3 inline-block hover:underline"
            >
              View GitHub Profile
            </a>
          </div>
        )}
        {repos.length > 0 && (
          <div className="mt-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Repositories</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "stars" | "updated")}
                className="border p-1 rounded text-sm"
              >
                <option value="stars">Top Stars</option>
                <option value="updated">Recently Updated</option>
              </select>
            </div>
            <div className="max-h-64 overflow-y-auto pr-2 border rounded p-2">
              <ul className="space-y-3">
                {displayRepos.map((repo) => (
                  <li key={repo.id} className="bg-white p-3 rounded shadow hover:scale-[1.02] transition-transform hover:shadow-lg">
                    <p className="font-semibold text-gray-900">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        {repo.name}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">{repo.stargazers_count} stars</p>
                    <p>{repo.language || "Unknown Language"}</p>
                    <p className="text-xs text-gray-400">
                      Updated {timeAgo(repo.updated_at)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Showing top 5 repositories
            </p>
          </div>
        )}

        {repos.length > 5 && (
          <a
            href={`https://github.com/${username}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm block mt-2 text-center hover:underline"
          >
            View all repositories on GitHub
          </a>
        )}

        {userData && repos.length === 0 && (
          <p className="mt-4 text-gray-500 text-center">
            No repositories found.
          </p>
        )}
      </div>
    </main>
  );
}

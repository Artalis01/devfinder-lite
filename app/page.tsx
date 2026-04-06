"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

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

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-5xl font-bold tracking-tight text-center text-gray-900 dark:text-white sm:text-left">
        Find any GitHub user by their username
      </h1>
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>
      <div className="mt-4">
        {loading && <p className="mt-4 animate-pulse">Loading...</p>}

        {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}

        {userData && (
          <div className="mt-6 bg-white p-4 rounded shadow w-full max-w-md text-center">
            <img
              src={userData.avatar_url} alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto"
            />
            <h2 className="text-xl font-bold mt-2">Name: {userData.login || userData.name}</h2>
            <p className="text-gray-600">Bio: {userData.bio}</p>
            <p className="mt-2">Followers: {userData.followers}</p>
          </div>
        )}
        {repos.length > 0 && (
          <div className="mt-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">Repositories:</h2>
            <div className="max-h-64 overflow-y-auto pr-2 border rounded p-2">

              <ul className="space-y-3">
                {repos.map((repo) => (
                  <li key={repo.id} className="bg-white p-3 rounded shadow">
                    <p className="font-bold">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        {repo.name}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">{repo.stargazers_count} stars</p>
                    <p>{repo.language || "Unknown Language"}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

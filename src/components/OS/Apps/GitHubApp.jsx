import React, { useState, useEffect } from 'react';
import './App.css';

const GitHubApp = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const username = 'whyujjwal';

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('Could not fetch GitHub profile');
        const userData = await userResponse.json();
        
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        if (!reposResponse.ok) throw new Error('Could not fetch GitHub repositories');
        const reposData = await reposResponse.json();
        
        setGithubData({ user: userData, repos: reposData });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const openInBrowser = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="app github-app">
      <div className="app-header">
        <h2>GitHub Profile</h2>
      </div>
      <div className="app-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading GitHub profile...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => openInBrowser(`https://github.com/${username}`)}>
              Open GitHub in Browser
            </button>
          </div>
        ) : (
          <div className="github-container">
            <div className="github-profile">
              <div className="github-avatar">
                <img src={githubData.user.avatar_url} alt={`${username}'s avatar`} />
              </div>
              <div className="github-info">
                <h3>{githubData.user.name || username}</h3>
                <a 
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-username"
                >
                  @{username}
                </a>
                {githubData.user.bio && <p className="github-bio">{githubData.user.bio}</p>}
                
                <div className="github-stats">
                  <div className="stat">
                    <span className="stat-count">{githubData.user.public_repos}</span>
                    <span className="stat-label">Repositories</span>
                  </div>
                  <div className="stat">
                    <span className="stat-count">{githubData.user.followers}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                  <div className="stat">
                    <span className="stat-count">{githubData.user.following}</span>
                    <span className="stat-label">Following</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="github-repos">
              <h4>Recent Repositories</h4>
              <div className="repos-list">
                {githubData.repos.map(repo => (
                  <div key={repo.id} className="repo-card">
                    <h5 className="repo-name">{repo.name}</h5>
                    {repo.description && <p className="repo-description">{repo.description}</p>}
                    <div className="repo-details">
                      {repo.language && <span className="repo-language">{repo.language}</span>}
                      <span className="repo-stars">⭐ {repo.stargazers_count}</span>
                      <span className="repo-forks">🍴 {repo.forks_count}</span>
                    </div>
                    <a 
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-link"
                    >
                      View Repository
                    </a>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="github-view-all"
              onClick={() => openInBrowser(`https://github.com/${username}`)}
            >
              View Full Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubApp;

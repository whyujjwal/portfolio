import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch, faStar, faExclamationTriangle, faCodeFork, faUsers, faBook, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import './App.css';
import './GitHubApp.css';

const GitHubApp = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const username = 'whyujjwal';

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user profile data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('Could not fetch GitHub profile');
        const userData = await userResponse.json();
        
        // Fetch repositories with more details
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (!reposResponse.ok) throw new Error('Could not fetch GitHub repositories');
        const reposData = await reposResponse.json();
        
        // Get contribution data if needed
        // Note: GitHub doesn't provide official API for contribution graph
        // We could parse from HTML but that's beyond the scope

        setGithubData({ user: userData, repos: reposData });
        setLoading(false);
      } catch (err) {
        console.error('GitHub API Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const openInBrowser = (url) => {
    window.open(url, '_blank');
  };

  // Component for repository cards with animations
  const RepoCard = ({ repo }) => {
    return (
      <div className="github-repo-card paper-card" onClick={() => openInBrowser(repo.html_url)}>
        <h4 className="repo-title">{repo.name}</h4>
        {repo.description && <p className="repo-description">{repo.description}</p>}
        
        <div className="repo-stats">
          {repo.language && (
            <div className="repo-language">
              <span 
                className="language-color" 
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              ></span>
              {repo.language}
            </div>
          )}
          <div className="repo-stat">
            <FontAwesomeIcon icon={faStar} />
            <span>{repo.stargazers_count}</span>
          </div>
          <div className="repo-stat">
            <FontAwesomeIcon icon={faCodeFork} />
            <span>{repo.forks_count}</span>
          </div>
        </div>
      </div>
    );
  };

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className="github-skeleton">
      <div className="skeleton-profile">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-info">
          <div className="skeleton-name"></div>
          <div className="skeleton-username"></div>
          <div className="skeleton-bio"></div>
          <div className="skeleton-stats">
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
          </div>
        </div>
      </div>
      <div className="skeleton-tabs"></div>
      <div className="skeleton-repos">
        <div className="skeleton-repo"></div>
        <div className="skeleton-repo"></div>
        <div className="skeleton-repo"></div>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = ({ message }) => (
    <div className="github-error paper-card">
      <div className="error-icon">
        <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
      </div>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      <button 
        className="paper-button"
        onClick={() => openInBrowser(`https://github.com/${username}`)}
      >
        <FontAwesomeIcon icon={faGithub} /> View on GitHub
      </button>
    </div>
  );

  // Helper function to determine language colors
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Python: '#3572A5',
      Java: '#b07219',
      // Add more languages as needed
    };
    return colors[language] || '#858585';
  };

  // Profile Stats Card Component
  const ProfileStatsCard = ({ user }) => (
    <div className="profile-stats-container paper-card">
      <div className="stat-item">
        <FontAwesomeIcon icon={faBook} />
        <div className="stat-value">{user.public_repos}</div>
        <div className="stat-label">Repositories</div>
      </div>
      <div className="stat-item">
        <FontAwesomeIcon icon={faUsers} />
        <div className="stat-value">{user.followers}</div>
        <div className="stat-label">Followers</div>
      </div>
      <div className="stat-item">
        <FontAwesomeIcon icon={faUsers} />
        <div className="stat-value">{user.following}</div>
        <div className="stat-label">Following</div>
      </div>
    </div>
  );

  return (
    <div className="app github-app">
      <div className="app-header github-header paper-card-header">
        <div className="github-title">
          <FontAwesomeIcon icon={faGithub} className="github-header-icon" />
          <h2>GitHub Profile</h2>
        </div>
      </div>
      
      <div className="app-content github-content">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : (
          <>
            <div className="github-profile-container paper-card">
              <div className="github-profile-header">
                <div className="github-avatar">
                  <img src={githubData.user.avatar_url} alt={`${username}'s avatar`} />
                </div>
                <div className="github-basic-info">
                  <h2>{githubData.user.name || username}</h2>
                  <h3 className="github-username">@{githubData.user.login}</h3>
                  {githubData.user.bio && <p className="github-bio">{githubData.user.bio}</p>}
                  
                  <div className="github-profile-links">
                    {githubData.user.location && (
                      <div className="profile-link">
                        <FontAwesomeIcon icon={faGlobe} />
                        <span>{githubData.user.location}</span>
                      </div>
                    )}
                    
                    <div className="profile-link github-link" onClick={() => openInBrowser(githubData.user.html_url)}>
                      <FontAwesomeIcon icon={faGithub} />
                      <span>View on GitHub</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <ProfileStatsCard user={githubData.user} />
            </div>
            
            <div className="github-tabs paper-card">
              <div 
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </div>
              <div 
                className={`tab ${activeTab === 'repositories' ? 'active' : ''}`}
                onClick={() => setActiveTab('repositories')}
              >
                Repositories
              </div>
            </div>
            
            <div className="github-tab-content">
              {activeTab === 'overview' ? (
                <div className="github-overview">
                  <h3>Recent Repositories</h3>
                  <div className="github-repos-grid">
                    {githubData.repos.slice(0, 3).map(repo => (
                      <RepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                  
                  <div className="github-contribution-section paper-card">
                    <h3>Activity Summary</h3>
                    <p>Repositories: {githubData.user.public_repos}</p>
                    <p>Profile created: {new Date(githubData.user.created_at).toLocaleDateString()}</p>
                    <p>Last updated: {new Date(githubData.user.updated_at).toLocaleDateString()}</p>
                    
                    <button 
                      className="paper-button primary" 
                      onClick={() => openInBrowser(`https://github.com/${username}`)}
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="github-repositories">
                  <div className="github-repos-grid">
                    {githubData.repos.map(repo => (
                      <RepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                  
                  <button 
                    className="paper-button view-more"
                    onClick={() => openInBrowser(`https://github.com/${username}?tab=repositories`)}
                  >
                    View All Repositories
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubApp;

import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Fetch all projects
const projects = await fetchJSON('./lib/projects.json');

// Find the container on the homepage
const projectsContainer = document.querySelector('.projects');

// Render the 3 latest projects (guard against a failed fetch)
if (projects && projectsContainer) {
  renderProjects(projects.slice(0, 3), projectsContainer, 'h2');
}

// Fetch GitHub data (make sure username is in quotes!)
const githubData = await fetchGitHubData('karinashah');

// Find the GitHub profile stats container
const profileStats = document.querySelector('#profile-stats');

// Dynamically insert GitHub stats into the page.
// The unauthenticated GitHub API is rate-limited (60 requests/hour per IP),
// so fall back to a link instead of throwing and leaving an empty box.
if (profileStats) {
  if (githubData && typeof githubData.public_repos === 'number') {
    profileStats.innerHTML = `
      <dl>
        <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
        <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
        <dt>Followers:</dt><dd>${githubData.followers}</dd>
        <dt>Following:</dt><dd>${githubData.following}</dd>
      </dl>
    `;
  } else {
    profileStats.innerHTML = `
      <p>GitHub stats are unavailable right now.
        <a href="https://github.com/karinashah" target="_blank" rel="noopener noreferrer">View my profile on GitHub</a>
      </p>
    `;
  }
}

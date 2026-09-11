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
    const memberSince = new Date(githubData.created_at).getFullYear();

    // Each stat is wrapped in a <div> so the grid can reflow to 2 columns on phones.
    profileStats.innerHTML = `
      <dl>
        <div><dt>Public Repos:</dt><dd>${githubData.public_repos}</dd></div>
        <div><dt>Followers:</dt><dd>${githubData.followers}</dd></div>
        <div><dt>Following:</dt><dd>${githubData.following}</dd></div>
        <div><dt>Member Since:</dt><dd>${memberSince}</dd></div>
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

import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Fetch all projects
const projects = await fetchJSON('./lib/projects.json');

// Filter the first 3 projects
const latestProjects = projects.slice(0, 3);

// Find the container on the homepage
const projectsContainer = document.querySelector('.projects');

// Render the 3 latest projects
renderProjects(latestProjects, projectsContainer, 'h2');

// Fetch GitHub data (make sure username is in quotes!)
const githubData = await fetchGitHubData('karinashah');
console.log(githubData);

// Find the GitHub profile stats container
const profileStats = document.querySelector('#profile-stats');

// Dynamically insert GitHub stats into the page
if (profileStats) {
  profileStats.innerHTML = `
    <dl>
      <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
      <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
      <dt>Followers:</dt><dd>${githubData.followers}</dd>
      <dt>Following:</dt><dd>${githubData.following}</dd>
    </dl>
  `;
}

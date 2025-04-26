import { fetchJSON, renderProjects } from './global.js';

// Fetch all projects
const projects = await fetchJSON('./lib/projects.json');

// Filter the first 3 projects
const latestProjects = projects.slice(0, 3);

// Find the container on the homepage
const projectsContainer = document.querySelector('.projects');

// Render the 3 latest projects
renderProjects(latestProjects, projectsContainer, 'h2');

// 1. Import the functions
import { fetchJSON, renderProjects } from '../global.js';

// 2. Fetch the project data
const projects = await fetchJSON('../lib/projects.json');

// 3. Select the container where projects should be inserted
const projectsContainer = document.querySelector('.projects');

// 4. Render the projects into the container
renderProjects(projects, projectsContainer, 'h2');

// Select the title element
const titleElement = document.querySelector('.projects-title');

// Update the title with the number of projects
if (titleElement) {
  titleElement.textContent = `${projects.length} Projects`;
}

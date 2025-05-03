// 1. Import the functions
import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

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

let arc = d3.arc().innerRadius(0).outerRadius(50)({
  startAngle: 0,
  endAngle: 2 * Math.PI,
});

d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

// 1. Import the functions
import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// 2. Fetch the project data
const projects = await fetchJSON('../lib/projects.json');

// 3. Select containers
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

// 4. Render all projects on load
renderProjects(projects, projectsContainer, 'h2');
if (titleElement) titleElement.textContent = `${projects.length} Projects`;

// -----------------------------
// Pie Chart + Legend Renderer
// -----------------------------
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie().value((d) => d.value);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

function renderPieChart(projectsGiven) {
  // Rollup project count by year
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  // Clear old chart and legend
  const svg = d3.select('svg#projects-pie-plot');
  svg.selectAll('*').remove();

  const legend = d3.select('.legend');
  legend.selectAll('*').remove();

  // Draw pie slices
  let arcData = sliceGenerator(data);
  arcData.forEach((d, idx) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(idx))
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
  });

  // Draw legend items
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Call once initially
renderPieChart(projects);

// -----------------------------
// Search functionality
// -----------------------------
let query = '';
searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
  if (titleElement) titleElement.textContent = `${filteredProjects.length} Projects`;
});

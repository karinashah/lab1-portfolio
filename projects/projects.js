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

let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);

// Convert rolled data into objects
let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});

// -----------------------------
// Draw pie chart with labels
// -----------------------------
let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let sliceGenerator = d3.pie()
  .value((d) => d.value); // access value in { value, label }

let arcData = sliceGenerator(data);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Clear existing SVG just in case
const svg = d3.select('svg#projects-pie-plot');
svg.selectAll('*').remove();

// Draw pie slices
arcData.forEach((d, idx) => {
  svg.append('path')
    .attr('d', arcGenerator(d))
    .attr('fill', colors(idx))
    .attr('stroke', 'white')
    .attr('stroke-width', 1);
});

// -----------------------------
// Step 2.2: Build legend
// -----------------------------
let legend = d3.select('.legend');
legend.selectAll('*').remove(); // clear old legend if needed

data.forEach((d, idx) => {
  legend.append('li')
    .attr('style', `--color:${colors(idx)}`)
    .attr('class', 'legend-item')
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});
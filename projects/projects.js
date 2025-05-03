// 1. Import the functions
import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// 2. Fetch the project data
const projects = await fetchJSON('../lib/projects.json');

// 3. Select containers
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

// 4. Initial render
renderProjects(projects, projectsContainer, 'h2');
if (titleElement) titleElement.textContent = `${projects.length} Projects`;

// Shared D3 variables
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie().value((d) => d.value);
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let selectedIndex = -1;

// Function to render pie + legend
function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(projectsGiven, v => v.length, d => d.year);
  let data = rolledData.map(([year, count]) => ({ value: count, label: year }));

  let svg = d3.select('svg#projects-pie-plot');
  svg.selectAll('*').remove();

  let legend = d3.select('.legend');
  legend.selectAll('*').remove();

  let arcData = sliceGenerator(data);

  // Render wedges
  arcData.forEach((d, idx) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(idx))
      .attr('class', selectedIndex === idx ? 'selected' : null)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        // Filter projects if selected
        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2');
          if (titleElement) titleElement.textContent = `${projects.length} Projects`;
        } else {
          const year = data[selectedIndex].label;
          const filtered = projects.filter(p => p.year === year);
          renderProjects(filtered, projectsContainer, 'h2');
          if (titleElement) titleElement.textContent = `${filtered.length} Projects`;
        }

        // Re-render chart + legend to reflect selection
        renderPieChart(selectedIndex === -1 ? projects : projects.filter(p => p.year === data[selectedIndex].label));
      });
  });

  // Render legend
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', selectedIndex === idx ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2');
          if (titleElement) titleElement.textContent = `${projects.length} Projects`;
        } else {
          const year = data[selectedIndex].label;
          const filtered = projects.filter(p => p.year === year);
          renderProjects(filtered, projectsContainer, 'h2');
          if (titleElement) titleElement.textContent = `${filtered.length} Projects`;
        }

        renderPieChart(selectedIndex === -1 ? projects : projects.filter(p => p.year === data[selectedIndex].label));
      });
  });
}

// Initial pie render
renderPieChart(projects);

// Search functionality
let query = '';
searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  let filtered = projects.filter((p) =>
    Object.values(p).join('\n').toLowerCase().includes(query.toLowerCase())
  );

  renderProjects(filtered, projectsContainer, 'h2');
  renderPieChart(filtered);
  if (titleElement) titleElement.textContent = `${filtered.length} Projects`;
});

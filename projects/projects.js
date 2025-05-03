import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedIndex = -1;

renderProjects(projects, projectsContainer, 'h2');
if (titleElement) titleElement.textContent = `${projects.length} Projects`;

renderPieChart(projects);

// -----------------------------
// PIE CHART + LEGEND FUNCTION
// -----------------------------
function renderPieChart(projectsGiven) {
  const svg = d3.select('svg#projects-pie-plot');
  const legend = d3.select('.legend');

  svg.selectAll('path').remove();
  legend.selectAll('*').remove();

  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  const data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  const sliceGenerator = d3.pie().value((d) => d.value);
  const arcData = sliceGenerator(data);
  const arcs = arcData.map((d) => arcGenerator(d));
  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  // Draw pie wedges with click interaction
  arcs.forEach((arc, i) => {
    svg.append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg.selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        legend.selectAll('li')
          .attr('class', (_, idx) =>
            idx === selectedIndex ? 'selected legend-item' : 'legend-item'
          );

        if (selectedIndex === -1) {
          renderProjects(projectsGiven, projectsContainer, 'h2');
          if (titleElement)
            titleElement.textContent = `${projectsGiven.length} Projects`;
        } else {
          const selectedYear = data[selectedIndex].label;
          const filteredProjects = projectsGiven.filter(
            (p) => p.year === selectedYear
          );
          renderProjects(filteredProjects, projectsContainer, 'h2');
          if (titleElement)
            titleElement.textContent = `${filteredProjects.length} ${filteredProjects.length === 1 ? 'Project' : 'Projects'} from ${selectedYear}`;
        }
      });
  });

  // Draw legend items
  data.forEach((d, i) => {
    legend.append('li')
      .attr('style', `--color:${colors(i)}`)
      .attr('class', i === selectedIndex ? 'selected legend-item' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg.selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        legend.selectAll('li')
          .attr('class', (_, idx) =>
            idx === selectedIndex ? 'selected legend-item' : 'legend-item'
          );

        if (selectedIndex === -1) {
          renderProjects(projectsGiven, projectsContainer, 'h2');
          if (titleElement)
            titleElement.textContent = `${projectsGiven.length} Projects`;
        } else {
          const selectedYear = data[selectedIndex].label;
          const filteredProjects = projectsGiven.filter(
            (p) => p.year === selectedYear
          );
          renderProjects(filteredProjects, projectsContainer, 'h2');
          if (titleElement)
            titleElement.textContent = `${filteredProjects.length} ${filteredProjects.length === 1 ? 'Project' : 'Projects'} from ${selectedYear}`;
        }
      });
  });
}

// -----------------------------
// SEARCH FUNCTIONALITY
// -----------------------------
searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  selectedIndex = -1;

  const filteredProjects = projects.filter((project) => {
    const values = Object.values(project).join(' ').toLowerCase();
    return values.includes(query);
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
  if (titleElement)
    titleElement.textContent = `${filteredProjects.length} ${filteredProjects.length === 1 ? 'Project' : 'Projects'}`;
});

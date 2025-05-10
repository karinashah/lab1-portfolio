import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function loadData() {
  const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: +row.line,
    depth: +row.depth,
    length: +row.length,
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));
  return data;
}

function processCommits(data) {
  return d3
    .groups(data, d => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;

      let ret = {
        id: commit,
        url: 'https://github.com/vis-society/lab-7/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        enumerable: false,
        writable: false,
        configurable: false,
      });

      return ret;
    });
}

let data = await loadData();
let commits = processCommits(data);
console.log(commits);


function renderCommitInfo(data, commits) {
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    // Basic stats
    dl.append('dt').html('Total <abbr title="Lines of Code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
  
    // Advanced stats
    const numFiles = d3.groups(data, d => d.file).length;
    const avgFileLength = d3.mean(
      d3.rollups(data, v => d3.max(v, d => d.line), d => d.file),
      d => d[1]
    );
    const avgLineLength = d3.mean(data, d => d.length);
    const maxDepth = d3.max(data, d => d.depth);
    const longestLine = d3.greatest(data, d => d.length);
    const timeOfDayGroups = d3.rollups(
      data,
      v => v.length,
      d => d.datetime.toLocaleString('en', { hour: 'numeric', hour12: false })
    );
    const busiestHour = d3.greatest(timeOfDayGroups, d => d[1])?.[0];
  
    // Render extras
    dl.append('dt').text('Number of files');
    dl.append('dd').text(numFiles);
  
    dl.append('dt').text('Average file length (lines)');
    dl.append('dd').text(avgFileLength.toFixed(1));
  
    dl.append('dt').text('Average line length (chars)');
    dl.append('dd').text(avgLineLength.toFixed(1));
  
    dl.append('dt').text('Maximum depth');
    dl.append('dd').text(maxDepth);
  
    dl.append('dt').text('Longest line');
    dl.append('dd').text(longestLine?.content || '—');
  
    dl.append('dt').text('Busiest hour');
    dl.append('dd').text(`${busiestHour}:00`);
  }

  function renderScatterPlot(data, commits) {
    const width = 1000;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };
  
    const usableArea = {
      top: margin.top,
      right: width - margin.right,
      bottom: height - margin.bottom,
      left: margin.left,
      width: width - margin.left - margin.right,
      height: height - margin.top - margin.bottom,
    };
  
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible');
  
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(commits, d => d.datetime))
      .range([usableArea.left, usableArea.right])
      .nice();
  
    const yScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([usableArea.bottom, usableArea.top]);

      // Add horizontal gridlines before axes
const gridlines = svg
  .append('g')
  .attr('class', 'gridlines')
  .attr('transform', `translate(${usableArea.left}, 0)`);

gridlines.call(
  d3.axisLeft(yScale)
    .tickFormat('') // no labels
    .tickSize(-usableArea.width) // extend ticks across width
);

    // Draw dots
    const dots = svg.append('g').attr('class', 'dots');
  
    dots
      .selectAll('circle')
      .data(commits)
      .join('circle')
      .attr('cx', d => xScale(d.datetime))
      .attr('cy', d => yScale(d.hourFrac))
      .attr('r', 5)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.7)
      .attr('stroke', 'white')
      .attr('stroke-width', 1);


    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => String(d % 24).padStart(2, '0') + ':00');
  
    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0, ${usableArea.bottom})`)
      .call(xAxis);
  
    // Add Y axis
    svg
      .append('g')
      .attr('transform', `translate(${usableArea.left}, 0)`)
      .call(yAxis);
  }  

  renderCommitInfo(data, commits);
  renderScatterPlot(data, commits);


  
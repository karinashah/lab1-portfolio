let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "resume/", title: "Resume" },
  { url: "contact/", title: "Contact" },
  { url: "meta/", title: "Meta" },
  { url: "https://github.com/karinashah", title: "Github" },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"
  : "/lab1-portfolio/";

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith('http') ? BASE_PATH + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  if (a.host !== location.host) {
    a.target = "_blank";
  }
}

// Insert theme toggle
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);

let select = document.querySelector('.color-scheme select');

function setColorScheme(colorScheme) {
  document.documentElement.classList.remove('light', 'dark', 'auto');

  if (colorScheme === 'light dark') {
    document.documentElement.classList.add('auto');
  } else {
    document.documentElement.classList.add(colorScheme);
  }

  select.value = colorScheme;
}

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
} else {
  setColorScheme('light dark'); // Default to auto
}

select.addEventListener('input', function (event) {
  localStorage.colorScheme = event.target.value;
  setColorScheme(event.target.value);
});

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    console.log(response); // See the full response in dev tools

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    // Parse the response into JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) {
    console.error('Invalid container element provided.');
    return;
  }

  containerElement.innerHTML = '';

  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadings.includes(headingLevel)) {
    console.warn(`Invalid heading level "${headingLevel}" provided. Defaulting to h2.`);
    headingLevel = 'h2';
  }

  for (const project of projects) {
    const article = document.createElement('article');
    const title = project.title || 'Untitled Project';
    const image = project.image || 'default-image.png';
    const description = project.description || 'No description available.';
    const year = project.year || '';

    if (project.link) {
      const link = document.createElement('a');
      link.href = project.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'project-link';
      link.innerHTML = `
        <${headingLevel}>${title}</${headingLevel}>
        <img src="${image}" alt="${title}">
        <div class="project-text">
          <p>${description}</p>
          <p class="project-year">${year}</p>
        </div>
      `;
      article.appendChild(link);
    } else {
      article.innerHTML = `
        <${headingLevel}>${title}</${headingLevel}>
        <img src="${image}" alt="${title}">
        <div class="project-text">
          <p>${description}</p>
          <p class="project-year">${year}</p>
        </div>
      `;
    }

    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  // Use the fetchJSON function you already made!
  return fetchJSON(`https://api.github.com/users/${username}`);
}

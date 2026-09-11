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

// Insert theme toggle: a single sun/moon button.
// Shows a moon in light mode (click for dark) and a sun in dark mode (click for light).
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <button class="color-scheme" type="button" aria-label="Switch to dark mode" title="Switch to dark mode">
    <svg class="icon-moon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="currentColor" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
    </svg>
    <svg class="icon-sun" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="currentColor"/>
      <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="2" x2="12" y2="4.5"/>
        <line x1="12" y1="19.5" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="4.5" y2="12"/>
        <line x1="19.5" y1="12" x2="22" y2="12"/>
        <line x1="4.9" y1="4.9" x2="6.7" y2="6.7"/>
        <line x1="17.3" y1="17.3" x2="19.1" y2="19.1"/>
        <line x1="4.9" y1="19.1" x2="6.7" y2="17.3"/>
        <line x1="17.3" y1="6.7" x2="19.1" y2="4.9"/>
      </g>
    </svg>
  </button>`
);

const themeButton = document.querySelector('.color-scheme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Which scheme is actually showing right now (resolves "auto" to light/dark).
function currentScheme() {
  const saved = localStorage.colorScheme;
  if (saved === 'light' || saved === 'dark') return saved;
  return prefersDark.matches ? 'dark' : 'light';
}

function setColorScheme(colorScheme) {
  document.documentElement.classList.remove('light', 'dark', 'auto');

  if (colorScheme === 'light dark') {
    document.documentElement.classList.add('auto');
  } else {
    document.documentElement.classList.add(colorScheme);
  }

  const isDark = currentScheme() === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
  themeButton.dataset.scheme = isDark ? 'dark' : 'light';
}

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
} else {
  setColorScheme('light dark'); // Default to auto (follows the OS setting)
}

themeButton.addEventListener('click', () => {
  const next = currentScheme() === 'dark' ? 'light' : 'dark';
  localStorage.colorScheme = next;
  setColorScheme(next);
});

// If the user hasn't chosen explicitly, keep the icon in sync with the OS.
prefersDark.addEventListener('change', () => {
  if (!('colorScheme' in localStorage)) setColorScheme('light dark');
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
    // Thumbnails live in one place (images/projects/) instead of being
    // duplicated in every folder that renders projects.
    const image = project.image
      ? `${BASE_PATH}images/projects/${project.image}`
      : `${BASE_PATH}images/projects/default-image.png`;
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

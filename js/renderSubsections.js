// Get the current page the user is on
let pathname = window.location.pathname;

// Determine which language site the user is on
let currLanguage = 'en'; // Default to English
let isRevamped = false;

for (language in supportedLanguages) {
  const langPath = `/${supportedLanguages[language]}/`;

  if (pathname.includes(langPath)) {
    currLanguage = supportedLanguages[language];
    // Remove the language from the path so we can grab the classname
    pathname = pathname.replace(langPath.slice(0, -1), '');

    if (revampedLanguageSites.includes(currLanguage)) {
      isRevamped = true;
    }
  }
}

let classname = pathname.replace('/', '.').replaceAll('/', '-');

// Append the cards for each of the subsections on the index page
const appendCards = (section) => {
  // Get the div to append the subsection cards to
  const wrapper = document.querySelector('.subsection-wrapper');
  // Get the link, title, and corresponding icon to be displayed
  const href = section.href;
  const title = section.innerText;
  let image = href.split('/').slice(3, -1).join('/').toLowerCase();
  let imagePath = `/images/index-pages/${image}.png`;

  // Modify the image paths so that it uses the absolute path
  if (isRevamped) {
    image = image.replace(`${currLanguage}/`, '');
    imagePath = imagePath.replace(`${currLanguage}/`, '');
  }

  // Add the subsection to the index page
  wrapper.innerHTML += `
  <div class="card">
    <a href=${href}>
      <h2 class="title">${title}</h2>
      <img class="icon" src="${imagePath}" onerror="this.src='/images/index-pages/blank.png'; this.onerror = null">
    </a>
  </div>
  `;
};

// if user is on one of the main pages, add a `.main-page` class for styling purposes
const addClassToContent = () => {
  const mainPages = ['builders', 'node-operators', 'tokens', 'learn'];
  const isMainPage = (mainPage) => {
    return `.${mainPage}-` === classname;
  };
  if (mainPages.find(isMainPage)) {
    const innerContent = document.querySelector('.md-content__inner');
    innerContent.classList.add('main-page');
  }
};

if (classname !== '.') {
  const section = document.querySelector(classname);
  // Add the subsection title to the index page
  const subsectionTitle = document.querySelector('.subsection-title');
  subsectionTitle.innerText = section.parentNode.children[0].innerText.trim();
  // Go through the nav items to find out what the titles are for each section of the nav
  // so we can display them on the index page
  if (section && section.children) {
    for (subsection of section.children) {
      // If it's a directory and is nested, we'll need to dig deeper to get the information for each nav item
      if (subsection.classList.contains('md-nav__item--nested')) {
        appendCards(subsection.children[1].children[0]);
      } else {
        appendCards(subsection.children[0]);
      }
    }
  }
  addClassToContent();
}

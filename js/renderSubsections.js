// Get the current page the user is on
const pathname = window.location.pathname;
const classname = pathname.replace('/', '.').replaceAll('/', '-');

if (classname !== '.') {
  const section = document.querySelector(classname);

  // Get the div to append the subsection cards to
  const wrapper = document.querySelector('.subsection-wrapper');

  // Append the cards
  const appendCards = (section) => {
    const href = section.href;
    const image = href.split('/').slice(3, -1).join('/').toLowerCase();
    const title = section.innerText;

    wrapper.innerHTML += `
    <div class="card">
      <a href=${href}>
        <h2 class="title">${title}</h2>
        <img class="icon" src="/images/index-pages/${image}.png" onerror="this.src='/images/index-pages/blank.png'; this.onerror = null">
      </a>
    </div>
    `;
  };

  if (section && section.children) {
    for (subsection of section.children) {
      // If it's a directory and is nested, we'll need to dig deeper to get the information for each nav item
      if (subsection.classList.contains('md-nav__item--nested')) {
        appendCards(subsection.children[1].children[1]);
      } else {
        appendCards(subsection.children[0]);
      }
    }
  }
}

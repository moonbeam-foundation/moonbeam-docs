const selectWrapper = document.querySelector('.language-select-wrapper');
const openArrow = document.querySelector('.selector-open');
const closedArrow = document.querySelector('.selector-closed');

/* Add event listeners */
selectWrapper.addEventListener('click', (e) => {
  e.preventDefault();

  selectWrapper.classList.toggle('active');
  openArrow.classList.toggle('active');
  closedArrow.classList.toggle('active');
});

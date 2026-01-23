document.body.addEventListener('click', (event) => {
  if (event.target.tagName === 'ASK-COOKBOOK') {
    event.target.addEventListener('keydown', (event) => {
      event.stopPropagation();
    });
  }
});

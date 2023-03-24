const dateLabels = document.querySelectorAll(
  '.git-revision-date-localized-plugin-date'
);

// Only make modifications on pages with dates
if (dateLabels.length > 0) {
  const lastUpdate = dateLabels[0].innerHTML;
  const created = dateLabels[1].innerHTML;

  const lastUpdateDate = new Date(lastUpdate);
  const createdDate = new Date(created);

  // If the created date is after the last updated date,
  // default to using the last updated date
  if (lastUpdateDate < createdDate) {
    dateLabels[1].innerHTML = lastUpdate;
  }
}

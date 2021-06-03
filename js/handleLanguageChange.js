const selectWrapper = document.querySelector(".select-wrapper");
const languageSelect = document.querySelector(".language-select");
const languageOptions = document.querySelectorAll(".select-wrapper .language-select li");
const selectLabel = document.querySelector(".select-label");
const supportedLanguages = ["cn"];
const english = document.querySelector(".en");
const selected = "selected";
let isStaging = false;

/* Get current language and path */
let currentLanguage;
let currentPath = window.location.pathname;

// If user is on staging site, no modifications to the currentPath are necessary and the
// language will be in the host object instead of the pathname object
if (window.location.origin.includes("stage")){
  isStaging = true;
  // If user is on a language other than English, the language will be the 2nd item in the array
  if (supportedLanguages.includes(window.location.host.split('-')[1])) {
    currentLanguage = window.location.host.split('-')[1];
  } else {
    currentLanguage = "en";
  }
} else {
  currentPath = window.location.pathname.split('/');
  // If user is on a language other than English, the language will be the 2nd item in the array
  if (supportedLanguages.includes(currentPath[1])){
    currentLanguage = currentPath[1]; 
    // Remove the language from the path
    currentPath = currentPath.join('/').slice(3);
  } else {
    currentLanguage = "en";
    currentPath = currentPath.join('/');
  };
}

/* Show user the current language on the dropdown */
if (currentLanguage === "en"){
  english.classList.add(selected, selected);
  selectLabel.textContent = "English";
} else {
  const currentLanguageElement = document.querySelector(`.${currentLanguage}`);
  selectLabel.textContent = currentLanguageElement.textContent;
  currentLanguageElement.classList.add(selected, selected);
}

/* Add event listeners */
selectWrapper.addEventListener("click", (e) => {
  e.preventDefault();
  selectWrapper.classList.toggle("active");
})

languageOptions.forEach(option => {
  option.addEventListener("click", (e) => {
    e.preventDefault();
    const destinationLanguage = option.attributes.value.value;
    // Redirect users to the destination language
    if (supportedLanguages.includes(destinationLanguage)){
      if (isStaging){
        window.location = `http://docs-${destinationLanguage}-stage.moonbeam.network/${currentPath}`
      } else {
        window.location = `${window.location.origin}/${destinationLanguage}${currentPath}`;
      }
    } else {
      // Default to English
      if (isStaging){
        window.location = `http://docs-stage.moonbeam.network/${currentPath}`
      } else {
        window.location = `${window.location.origin}${currentPath}`
      }
    }
  })
})

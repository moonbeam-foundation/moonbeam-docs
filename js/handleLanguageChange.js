const selectWrapper = document.querySelector(".select-wrapper");
const languageSelect = document.querySelector(".language-select");
const languageOptions = document.querySelectorAll(".select-wrapper .language-select li");
const selectLabel = document.querySelector(".select-label");
const supportedLanguages = ["cn"];
const english = document.querySelector(".en");
const selected = "selected";

const resetSelected = () => {
  for (let languageOption of languageSelect.children){
    languageOption.classList.remove(selected);
  }
};

const setEnglish = () => {
  resetSelected();
  english.classList.add(selected, selected);
  selectLabel.textContent = "English";
}

const setSelected = (language) => {
  if (supportedLanguages.includes(language)){
    resetSelected();
    const selectedLanguage = document.querySelector(`.${language}`);
    console.log(selectedLanguage.textContent);
    selectLabel.textContent = selectedLanguage.textContent;
    selectedLanguage.classList.add(selected, selected);
  } else {
    // we're on the english site or we don't support it so default to english
    setEnglish()
  }
};

window.onload = () => {
  selectWrapper.addEventListener("click", (e) => {
    e.preventDefault();
    selectWrapper.classList.toggle("active");
  })

  languageOptions.forEach(option => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const language = option.attributes.value.value;
      if (language !== "en"){
        if (window.location.origin.includes("stage")){
          window.location = `http://docs-${language}-stage.moonbeam.network/`;
        } else {
          window.location = `${window.location.origin}/${language}`
        }
      } else {
        if (window.location.origin.includes("stage")){
          window.location = `http://docs-stage.moonbeam.network/`
        } else {
          window.location = window.location.origin;
        }
      }
    })
  })

  if (window.location.origin.includes("stage")) {
    // If it is another language, it'll be the 2nd item in the array
    const languagePath = window.location.host.split('-')[1]; 
    setSelected(languagePath);
  } else {
    if (window.location.pathname === "/") {
      // User is definitely on the English site
      setEnglish();
    } else {
      // User is possibly on another language site
      // If it is another language, it'll be the 2nd item in the array
      const languagePath = window.location.pathname.split('/')[1]; 
      setSelected(languagePath);
    }
  }
}

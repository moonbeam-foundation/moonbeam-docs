const languageSelect = document.querySelector(".language-select");
const supportedLanguages = ["cn"];
const english = document.querySelector(".en");
const selected = "selected";

const resetSelected = () => {
  for (let languageOption of languageSelect.children){
    languageOption.removeAttribute(selected);
  }
};

const setEnglish = () => {
  resetSelected();
  english.setAttribute(selected, selected);
}

const setSelected = (language) => {
  if (supportedLanguages.includes(language)){
    resetSelected();
    const selectedLanguage = document.querySelector(`.${language}`);
    selectedLanguage.setAttribute(selected, selected);
  } else {
    // we're on the english site or we don't support it so default to english
    setEnglish()
  }
};

languageSelect.onchange = (e) => {
  const language = e.target.value;
  if (language !== "en"){
    setSelected(language);
    if (window.location.origin.includes("stage")){
      window.location = `http://docs-${language}-stage.moonbeam.network/`;
    } else {
      window.location = `${window.location.origin}/${language}`
    }
  } else {
    setEnglish();
    if (window.location.origin.includes("stage")){
      window.location = `http://docs-stage.moonbeam.network/`
    } else {
      window.location = window.location.origin;
    }
  }
}

window.onload = () => {
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
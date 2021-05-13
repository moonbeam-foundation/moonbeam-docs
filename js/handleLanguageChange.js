const languageSelect = document.querySelector(".language-select");
const english = document.querySelector(".en");
const selected = "selected";

const resetSelected = () => {
  for (let languageOption of languageSelect.children){
    languageOption.removeAttribute(selected);
  }
};

languageSelect.onchange = (e) => {
  if (e.target.value !== "en"){
    resetSelected();
    const language = e.target.value;
    const selectedLanguage = document.querySelector(`.${language}`);
    selectedLanguage.setAttribute(selected, selected);
    if (window.location.origin.includes("stage")){
      window.location = `http://docs-${language}-stage.moonbeam.network/`;
    } else {
      window.location = `${window.location.origin}/${language}`
    }
  } else {
    resetSelected();
    english.setAttribute(selected, selected);
    if (window.location.origin.includes("stage")){
      window.location = `http://docs-stage.moonbeam.network/`
    } else {
      window.location = window.location.origin;
    }
  }
}
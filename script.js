const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  selectTags = document.querySelectorAll("select"), // Renamed variable for clarity
  icons = document.querySelectorAll(".row i"),
  translateBtn = document.querySelector("button");

selectTags.forEach((selectTag, id) => {
  for (let countries_code in countries) {
    let selected =
      id === 0
        ? countries_code === "en-GB" ? "selected" : ""
        : countries_code === "hi-IN" ? "selected" : "";
    let option = `<option ${selected} value="${countries_code}">${countries[countries_code]}</option>`;
    selectTag.insertAdjacentHTML("beforeend", option);
  }
});

exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTags[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
    translateFrom = selectTags[0].value,
    translateTo = selectTags[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((match) => {
        if (match.id === 0) {
          toText.value = match.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value || !toText.value) return;
    if (target.classList.contains("fa-copy")) {
      if (target.id === "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (target.id === "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTags[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTags[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});

const FLAG_DIR = "Flag name game/Flags/";

const FLAGS = [
  { letter: "A", name: "Alfa", file: "Alfa_flag.svg.webp" },
  { letter: "B", name: "Bravo", file: "Bravo_flag.svg.webp" },
  { letter: "C", name: "Charlie", file: "Charlie_flag.svg.webp" },
  { letter: "D", name: "Delta", file: "Delta flag.png" },
  { letter: "E", name: "Echo", file: "Echo flag.png" },
  { letter: "F", name: "Foxtrot", file: "Foxtrot_flag.svg.webp" },
  { letter: "G", name: "Golf", file: "Golf_flag.svg.webp" },
  { letter: "H", name: "Hotel", file: "Hotel_flag.svg.webp" },
  { letter: "I", name: "India", file: "india.gif" },
  { letter: "J", name: "Juliett", file: "images.png" },
  { letter: "K", name: "Kilo", file: "Kilo_flag.svg.webp" },
  { letter: "L", name: "Lima", file: "Lima_flag.svg.webp" },
  { letter: "M", name: "Mike", file: "Mike_flag.svg.webp" },
  { letter: "N", name: "November", file: "Signal_flag_november.svg.webp" },
  { letter: "O", name: "Oscar", file: "Oscar_flag.svg.webp" },
  { letter: "P", name: "Papa", file: "Papa_flag.svg.webp" },
  { letter: "Q", name: "Quebec", file: "ICS_Quebec.svg.webp" },
  { letter: "R", name: "Romeo", file: "Romeo_flag.svg.webp" },
  { letter: "S", name: "Sierra", file: "Sierra_flag.svg.webp" },
  { letter: "T", name: "Tango", file: "SignalFlagTango-USNSpec.svg.webp" },
  { letter: "U", name: "Uniform", file: "ICS_Uniform.svg.webp" },
  { letter: "V", name: "Victor", file: "Victor_flag.svg.webp" },
  { letter: "W", name: "Whiskey", file: "Whiskey_flag.svg.webp" },
  { letter: "X", name: "X-ray", file: "Xray_flag.svg.webp" },
  { letter: "Y", name: "Yankee", file: "Yankee_flag.svg.webp" },
  { letter: "Z", name: "Zulu", file: "Zulu_flag.svg.webp" }
];

const chartEl = document.getElementById("chart");
const printEl = document.getElementById("print-sheet");
const spellingEl = document.getElementById("spelling-output");
const undoEl = document.getElementById("undo-selection");
const clearEl = document.getElementById("clear-selection");
const enterEl = document.getElementById("enter");
const resultDialogEl = document.getElementById("result-dialog");
const selectedLetters = [];

function flagUrl(file) {
  return encodeURI(FLAG_DIR + file);
}

function flagImage(flag, className) {
  const img = document.createElement("img");
  img.src = flagUrl(flag.file);
  img.alt = flag.name + " signal flag";
  img.className = className || "";
  return img;
}

function renderChart() {
  chartEl.replaceChildren();
  FLAGS.forEach((flag) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "chart-card";
    card.dataset.letter = flag.letter;
    card.setAttribute("aria-label", "Add " + flag.letter + ", " + flag.name);
    card.setAttribute("aria-pressed", "false");
    card.appendChild(flagImage(flag));
    const caption = document.createElement("div");
    caption.className = "caption";
    caption.innerHTML =
      '<span class="glyph">' + flag.letter + "</span>" +
      '<span class="name">' + flag.name + "</span>";
    card.appendChild(caption);
    card.addEventListener("click", () => {
      selectedLetters.push(flag.letter);
      updateSpelling();
    });
    chartEl.appendChild(card);
  });
}

function updateSpelling() {
  if (selectedLetters.length) {
    spellingEl.textContent = selectedLetters.join(" ");
    spellingEl.classList.add("is-active");
  } else {
    spellingEl.textContent = "No letters selected yet";
    spellingEl.classList.remove("is-active");
  }
  undoEl.disabled = selectedLetters.length === 0;
  clearEl.disabled = selectedLetters.length === 0;

  const selectedCounts = new Map();
  selectedLetters.forEach((letter) => {
    selectedCounts.set(letter, (selectedCounts.get(letter) || 0) + 1);
  });
  chartEl.querySelectorAll(".chart-card").forEach((card) => {
    const selected = selectedCounts.has(card.dataset.letter);
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
}

function renderPrintSheet() {
  printEl.replaceChildren();

  const flagsToPrint = selectedLetters.length
    ? selectedLetters.map((letter) => FLAGS.find((flag) => flag.letter === letter))
    : FLAGS;
  const subtitle = selectedLetters.length
    ? "Your spelling: " + selectedLetters.join("")
    : "International Code of Signals · A to Z";
  const printedName = selectedLetters.length
    ? selectedLetters.join("")
    : "A–Z";
  const resultNameClass = selectedLetters.length > 9
    ? "result-name is-long"
    : "result-name";
  const currentDate = new Date().toLocaleDateString();

  const header = document.createElement("div");
  header.className = "print-header";
  header.innerHTML =
    '<div><h1 id="result-title">My Signal Flags</h1><p>' + subtitle + "</p></div>" +
    '<div class="print-meta"><span class="' + resultNameClass + '">' + printedName + "</span><span>Date - " + currentDate + "</span></div>";

  const grid = document.createElement("div");
  grid.className = "print-grid";
  const columns = Math.min(flagsToPrint.length, 9, Math.max(2, Math.floor(window.innerWidth / 180)));
  grid.style.setProperty("--result-columns", columns);
  grid.style.setProperty("--result-rows", Math.ceil(flagsToPrint.length / columns));

  flagsToPrint.forEach((flag) => {
    const card = document.createElement("article");
    card.className = "print-card";
    card.appendChild(flagImage(flag));
    const caption = document.createElement("div");
    caption.className = "caption";
    caption.innerHTML =
      '<span class="glyph">' + flag.letter + "</span>" +
      '<span class="name">' + flag.name + "</span>";
    card.appendChild(caption);
    grid.appendChild(card);
  });

  printEl.append(header, grid);
}

undoEl.addEventListener("click", () => {
  selectedLetters.pop();
  updateSpelling();
});
clearEl.addEventListener("click", () => {
  selectedLetters.length = 0;
  updateSpelling();
});
enterEl.addEventListener("click", () => {
  renderPrintSheet();
  resultDialogEl.showModal();
});
document.getElementById("close-result").addEventListener("click", () => {
  resultDialogEl.close();
});
resultDialogEl.addEventListener("click", (event) => {
  if (event.target === resultDialogEl) {
    resultDialogEl.close();
  }
});

renderChart();
renderPrintSheet();

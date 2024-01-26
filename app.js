const main = document.querySelector("main");
const basicArray = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];

let exerciceArray = [];

(() => {
  if (localStorage.exercices) {
    exerciceArray = JSON.parse(localStorage.exercices);
  } else {
    exerciceArray = basicArray;
  }
})(); // fonction anonyme

class Exercice {
  constructor() {
    this.index = 0;
    this.minutes = exerciceArray[this.index].min;
    this.seconds = 0;
  }
  updateCountdown() {
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
    setTimeout(() => {
      if (this.minutes === 0 && this.seconds == "00") {
        this.index++;
        this.ring();
        if (this.index < exerciceArray.length) {
          this.minutes = exerciceArray[this.index].min;
          this.seconds = 0;
          this.updateCountdown();
        } else {
          return page.finish();
        }
      } else if (this.seconds === "00") {
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        this.seconds--;
        this.updateCountdown();
      }
    }, 1000);
    return (main.innerHTML = `
      <div class="exercice-container">
        <p>${this.minutes}:${this.seconds}</p>
        <img src="./img/${exerciceArray[this.index].pic}.png">
        <div>${this.index + 1}/${exerciceArray.length}</div>
      </div>
      `);
  }
  ring() {
    const audio = new Audio();
    audio.src = "ring.mp3";
    audio.play();
  }
}

const utils = {
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  handleEventMinutes: function () {
    const inputs = document.querySelectorAll("input[type=number]");
    inputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        exerciceArray.forEach((exo) => {
          if (exo.pic == e.target.id) {
            exo.min = parseInt(e.target.value);
            this.store();
          }
        });
      });
    });
  },
  handlleEventArrow: function () {
    const arrow = document.querySelectorAll(".arrow");
    arrow.forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0;
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.dataset.pic && position !== 0) {
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            page.lobby();
            this.store();
          } else {
            position++;
          }
        });
      });
    });
  },
  deleteItem: function () {
    buttons = document.querySelectorAll(".delete-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        exerciceArray = exerciceArray.filter(
          (exo) => exo.pic != e.target.dataset.pic
        );
        page.lobby();
        this.store();
      });
    });
  },
  reboot: function () {
    exerciceArray = basicArray;
    page.lobby();
    this.store();
  },
  store: function () {
    localStorage.exercices = JSON.stringify(exerciceArray);
  },
};

const page = {
  lobby: function () {
    let mapArray = exerciceArray
      .map(
        (exo) =>
          `
      <li>
        <div class="card-header">
          <div class="card-title">
            <input type="number" id=${exo.pic} min="1" max="10" value=${exo.min}>
            <span>min</span>
          </div>
          <img src="./img/${exo.pic}.png">
          <div class="card-arrow">
            <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
            <i class="fas fa-times-circle delete-btn" data-pic=${exo.pic}></i>
          </div>
        </div>
      </li>
    `
      )
      .join("");

    utils.pageContent(
      "Paramétrage <i id='reboot' class='fas fa-undo'></i>",
      "<ul>" + mapArray + "</ul>",
      "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>"
    );
    utils.handleEventMinutes();
    utils.handlleEventArrow();
    utils.deleteItem();
    reboot.addEventListener("click", () => {
      utils.reboot();
    });
    start.addEventListener("click", () => {
      this.routine();
    });
  },
  routine: function () {
    const exercice = new Exercice();
    utils.pageContent("Routine", exercice.updateCountdown(), null);
  },
  finish: function () {
    utils.pageContent(
      "C'est terminé ! ",
      "<button id='start'>Recommencer</button>",
      "<button id='reboot' class ='btn-reboot'>Réinitialiser <i class='fas fa-times-circle'></i></button>"
    );
    start.addEventListener("click", () => this.routine());
    reboot.addEventListener("click", () => utils.reboot());
  },
};

page.lobby();
page.handleEventMinutes();

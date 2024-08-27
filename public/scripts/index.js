let state = {
  cardIndex: 0,
  lvlIndex: -2,
  checkAnswer: false,
  name: "",
  age: 0,
  skillLevel: "",
  score: 0,
  confirmation: false,
  questionScore: [0, 0],
};

function setState(newState, data) {
  state = { ...state, ...newState };

  render(data);
}

window.onDragStart = function (event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  // event.currentTarget.style.backgroundColor = 'rgb(253, 255, 210)';
};

window.onDragOver = function (event) {
  event.preventDefault();
};

window.onDrop = function (event) {
  event.preventDefault();
  const id = event.dataTransfer.getData("text");
  const draggableElement = document.getElementById(id);
  let dropzone = event.target;

  if (!dropzone.classList.contains("label-dropzone")) {
    dropzone = dropzone.closest(".label-dropzone");
  }

  if (dropzone && dropzone.children.length === 0) {
    dropzone.appendChild(draggableElement);
    draggableElement.style.backgroundColor = "rgb(253, 255, 210)";
  } else {
    alert("This drop zone can only have one label.");
    draggableElement.style.backgroundColor = "#FFB4C2";
  }

  event.dataTransfer.clearData();
};

function render(data) {
  var cardHTML = ``;

  if (state.lvlIndex == -1) {
    document.getElementById("title1").textContent = "Fill in your details";
    document.getElementById("title1").style.marginTop = "-3rem";
    document.getElementById("title1").style.width = "30rem";
    cardHTML = `
        <div id="skill-level">
            <div id="nameInput">
                <label for="name" id="name-label">Name </label><br>
                <input type="text" id="name" name="name">
            </div>
            <div id="ageInput">
                <label for="age" id="age-label">Age </label><br>
                <input type="number" id="age" name="age">
            </div>
        </div>
        `;

    document.getElementById("subtitle1").remove();
    document.getElementById("render").innerHTML = cardHTML;
    document.getElementById("skill-level").style.fontSize = "2rem";
    document.getElementById("skill-level").style.marginLeft = "2rem";
    document.getElementById("skill-level").style.marginBottom = "2rem";
    document.getElementById("nameInput").style.display = "flex";
    document.getElementById("nameInput").style.gap = "0.5rem";
    document.getElementById("nameInput").style.margin = "1rem";
    document.getElementById("name").style.border = "0.1rem solid black";

    document.getElementById("ageInput").style.display = "flex";
    document.getElementById("ageInput").style.gap = "0.5rem";
    document.getElementById("ageInput").style.margin = "1rem";
    document.getElementById("age").style.border = "0.1rem solid black";

    document.getElementById("age").style.marginLeft = "1rem";

    // document.getElementById("startBtn").style.marginLeft = "3.5rem";
    // document.getElementById("startBtn").style.marginTop = "-1rem";

    const mediaQuery = window.matchMedia("(min-width: 1800px)");

    function handleScreenSizeChange(event) {
      if (event.matches) {
        document.getElementById("title1").style.marginLeft = "10rem";

        document.getElementById("startBtn").style.marginLeft = "-5rem";

        document.getElementById("age").style.fontSize = "4.5rem";
        document.getElementById("name").style.fontSize = "4.5rem";

        document.getElementById("ageInput").style.marginBottom = "3rem";
        document.getElementById("nameInput").style.marginBottom = "2rem";
      }
    }

    handleScreenSizeChange(mediaQuery);
  } else if (state.lvlIndex >= 0) {
    if (data[state.lvlIndex].type == "vocab") {
      globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      document.getElementById("sec1").style.width = "0%";
      document.getElementById("sec3").style.width = "0%";
      let vocabHtml = `
<div class="vocab${state.lvlIndex}" style="display: flex; flex-direction: column; align-items: center">
  <h1 id="title2">${data[state.lvlIndex].title}</h1>
  <p id="subtitle2">${data[state.lvlIndex].desc}</p>
  <p id="info2">Click on ⋮ => playback speed to slow down or speed the audio</p>
  <div class="table-wrap">
    <table id="table">
      <tr>
        <th>Image</th>
        <th>Spanish</th>
        <th>English</th>
        <th>Pronouncation</th>
      </tr>
      <tr>
        <td><img src="${data[state.lvlIndex].elements[state.cardIndex].img}" alt=""></td>
        <td>${data[state.lvlIndex].elements[state.cardIndex].spanish}</td>
        <td>${data[state.lvlIndex].elements[state.cardIndex].english}</td>
        <td style="width: 25%;">
        <audio controls>
          <source src="${data[state.lvlIndex].elements[state.cardIndex].audio}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </tr>
    </table>
  </div>
  <button id="startBtn" onclick="Navigate();">Next</button>
</div>
        `;
      document.getElementById("data").innerHTML = vocabHtml;
      state.confirmation = true;
    } else if (data[state.lvlIndex].type == "MCQ") {
      let subHTML = data[state.lvlIndex].elements[state.cardIndex].choices
        .map(
          (e, x) =>
            `
              <div class="MCQ-choice">
                  <input type="radio" id="choice${x}" name="choice" value="${e}">
                  <label for="choice${x}" class="MCQ-label">${e}</label><br>
                </div>
                     `
        )
        .join("");

      questionHTML = `
            <div id="Q${state.lvlIndex}">
                <h1 id="title-MCQ">${data[state.lvlIndex].title}</h1>
                <h4 id="subtitle-MCQ">${data[state.lvlIndex].desc}</h4>
                <div class="elementMCQ">
                    <div class="vocab-img">
                      <img src="${data[state.lvlIndex].elements[state.cardIndex].img}" alt="${data[state.lvlIndex].elements[state.cardIndex].english}">
                    </div>
                    <div id="choices">
                      ${subHTML}
                    </div>
                </div>
                <button id="startBtn" style="margin:1rem; margin-left:50%" onclick="Navigate();">Next</button>
            </div>
            `;
      document.getElementById("data").innerHTML = questionHTML;
      state.checkAnswer = true;
    } else if (data[state.lvlIndex].type == "sort") {
      const choicesHTML = data[state.lvlIndex].elements[state.cardIndex].labels
        .map(
          (c, i) => `
          <div id="word-${i}" class="label-dropzone" ondragover="onDragOver(event);" ondrop="onDrop(event);" ${c.ignore == false ? 'style="background-color:#B5CFB7"' : 'style="background-color:rgba(0, 0, 0, 0);"'} >
                <div id="draggable-${i}" class="draggable-label" ${c.ignore == false ? 'draggable="true" style="position: relative;"' : 'draggable="false" style="position: relative; background-color: rgba(0, 0, 0, 0);"'} draggable="true" ondragstart="onDragStart(event);">
                    ${c.txt}
                </div>
          </div>
            `
        )
        .join("");

      const sortedHTML = data[state.lvlIndex].elements[state.cardIndex].answer
        .map(
          (c, i) => `
            <div id="zone-${i}" class="label-dropzone" ondragover="onDragOver(event);" ondrop="onDrop(event);" ${c.ignore == false ? "" : ' style="background-color: rgba(0, 0, 0, 0);"'}">
            ${c.ignore == true ? `${c.txt}` : ""}
            </div>
            `
        )
        .join("");

      cardHTML = `   
            <h1 id="data-title-2">${data[state.lvlIndex].title}</h1>
            <h4 id="data-subtitle-2">${data[state.lvlIndex].desc}</h4>
            <div class="sort-area">
                    <div class="labels-to-sort">
                    ${choicesHTML}
                    </div>
                    <div class="sorted-labels">
                    ${sortedHTML}
                    </div>
                    <div id="sentence"></div>
            </div>
            `;

      var areaHTML = `
            <div id="Q${state.lvlIndex}">
                <h1 id="title2">${data[state.lvlIndex].title}</h1>
                <h4 id="subtitle2">${data[state.lvlIndex].desc}</h4>
                <div class="element">
                                        <div class="labels-to-sort">
                    ${choicesHTML}
                    </div>
                    <div class="sorted-labels">
                    ${sortedHTML}
                    </div>
                    <div id="sentence"></div>
                </div>
                <button id="startBtn" style="margin:1rem; margin-left:50%" onclick="Navigate();">Next</button>
            </div>
            `;
      document.getElementById("data").innerHTML = areaHTML;

      state.checkAnswer = true;
    }
  }
}

function checkAnswer(data) {
  if (data[state.lvlIndex].type == "MCQ") {
    var answer = document.querySelector(`input[name="choice"][value="${data[state.lvlIndex].elements[state.cardIndex].answer}"]`);

    var label = document.querySelector(`label[for="${answer.id}"]`);

    let selectedChoice = document.querySelector('input[name="choice"]:checked');

    if (selectedChoice == null) {
      alert("You need to select an answer");
      state.checkAnswer = true;
    } else if (selectedChoice != null && answer.id != selectedChoice.id) {
      label.style.backgroundColor = "lightgreen";
      document.querySelector(`label[for="${selectedChoice.id}"]`).style.backgroundColor = "lightsalmon";
      state.checkAnswer = false;
    } else {
      label.style.backgroundColor = "lightgreen";
      state.score = state.score + 10;
      state.questionScore[0] = state.questionScore[0] + 10;
      state.checkAnswer = false;
      state.confirmation = false;
    }
  } else if (data[state.lvlIndex].type == "sort") {
    var unanswered = false;
    var unansweredSort = [];

    var sortedLabelDivs = document.querySelectorAll(".sorted-labels");
    var dropZones = Array.from(sortedLabelDivs).flatMap((d) => Array.from(d.querySelectorAll(".label-dropzone")));

    Array.from(dropZones).forEach((d, i) => {
      if (d && d.children.length === 0) {
        if (window.getComputedStyle(d).backgroundColor === "rgba(0, 0, 0, 0)") {
        } else {
          unanswered = true;
          unansweredSort.push(d);
        }
      } else {
        d.style.border = "none";
      }
    });

    var questions = document.getElementsByClassName("sort-area");

    if (unanswered == true) {
      alert("Please make sure that all the questions have been answered.");
      unansweredSort.forEach((q) => {
        q.style.border = "1rem solid red";
      });
    } else {
      data[state.lvlIndex].elements[state.cardIndex].answer.forEach((a, i) => {
        if (a.ignore == false) {
          var studentAns = document.getElementById(`zone-${i}`).textContent.replace(/\s+/g, "");

          if (studentAns.toLowerCase() == a.txt.toLowerCase()) {
            document.getElementById(`zone-${i}`).style.backgroundColor = "lightgreen";
            state.score = state.score + 10;
            state.questionScore[1] = state.questionScore[1]+10
          } else {
            document.getElementById(`zone-${i}`).style.backgroundColor = "lightsalmon";
          }
        }
        state.checkAnswer = false;
        state.confirmation = false;
      });

      var sentence = data[state.lvlIndex].elements[state.cardIndex].answer.map((item) => item.txt).join(" ");
      document.getElementById("sentence").innerHTML += `<h4>Answer: ${sentence}</h4>`;
      document.getElementById("sentence").style.backgroundColor = "lightgreen";
      document.getElementById("sentence").style.borderRadius = "10px";
      document.getElementById("sentence").style.textShadow = "0 0 15px white, 0 0 25px white, 0 0 50px white";
      document.getElementById("sentence").style.fontSize = "2rem";
    }
  }
}

fetch("/api/spanishTrip")
  .then((response) => response.json())
  .then((data) => {
    window.Navigate = async function () {
      if (state.checkAnswer == true) {
        checkAnswer(data);
      } else if (state.lvlIndex >= 0) {
        if (state.confirmation == true) {
          document.getElementById("startBtn").innerHTML = `
            If you go to next section, You cannot go back. Click again to confirm.
            `;
          state.confirmation = !state.confirmation;
        } else if (state.cardIndex + 1 == data[state.lvlIndex].elements.length) {          
          if(state.lvlIndex+1 == data.length){
              let user = {
                userName: state.name,
                age: state.age,
                questionScore: {
                  MCQ: state.questionScore[0],
                  sort: state.questionScore[1],
                },
                totalScore: state.score,
              };
              const response = await fetch("/api/scores", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
              });
              document.getElementById("sec1").style.width = "75%";
              document.getElementById("sec3").style.width = "75%";
  
              var endHTML = `
                <svg id="title-card" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M35.2,-64C46.2,-54.6,56.1,-46.4,65.8,-35.9C75.4,-25.4,84.7,-12.7,87.9,1.9C91.2,16.5,88.5,33,77.1,40.4C65.7,47.7,45.5,45.8,31.2,43.5C16.9,41.2,8.4,38.5,-1.5,41.1C-11.5,43.8,-23,51.7,-33.7,52C-44.4,52.2,-54.4,44.6,-64.7,34.7C-75.1,24.8,-85.8,12.4,-86.1,-0.1C-86.3,-12.7,-76,-25.3,-65.1,-34.3C-54.2,-43.2,-42.6,-48.5,-31.7,-58C-20.7,-67.4,-10.4,-81,0.9,-82.5C12.1,-84,24.2,-73.4,35.2,-64Z" transform="translate(100 100)" />
                  <div id="title-area">
                    <h1 id="end-title">- End -</h1>
                  </div>
                </svg>
                `;
  
              document.getElementById("data").innerHTML = endHTML;
          } else{
            setState(
            {
              cardIndex: 0,
              lvlIndex: ++state.lvlIndex,
              checkAnswer: false,
              score: state.score,
              name: state.name,
              age: state.age,
              skillLevel: state.value,
              confirmation: state.confirmation,
              questionScore: state.questionScore,
            },
            data
          );}
        } else {
            setState(
              {
                cardIndex: ++state.cardIndex,
                lvlIndex: state.lvlIndex,
                checkAnswer: false,
                score: state.score,
                name: state.name,
                age: state.age,
                skillLevel: state.value,
                confirmation: state.confirmation,
                questionScore: state.questionScore,
              },
              data)
          }
      }
    };

    document.getElementById("startBtn").onclick = () => {
      if (state.checkAnswer == true) {
        checkAnswer(data);
      } else if (state.lvlIndex == -2) {
        setState(
          {
            cardIndex: 0,
            lvlIndex: ++state.lvlIndex,
            checkAnswer: false,
            score: state.score,
            name: state.name,
            age: state.age,
            skillLevel: state.skillLevel,
            confirmation: state.confirmation,
            questionScore: state.questionScore,
          },
          data
        );
      } else if (state.lvlIndex == -1) {
        var userName = document.getElementById("name").value;
        var userAge = document.getElementById("age").value;

        if (userName == "") {
          document.getElementById("name").style.border = "0.2rem solid red";
        }
        if (userAge == "") {
          document.getElementById("age").style.border = "0.2rem solid red";
        }
        if (userName != "" && userAge != "") {
          setState(
            {
              cardIndex: 0,
              lvlIndex: ++state.lvlIndex,
              checkAnswer: false,
              score: state.score,
              name: userName,
              age: userAge,
              skillLevel: state.value,
              confirmation: state.confirmation,
              questionScore: state.questionScore,
            },
            data
          );
        }
      }
    };

    render(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

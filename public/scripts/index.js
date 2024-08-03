let state = {
    cardIndex: 0,
    lvlIndex: -2,
    checkAnswer: false,
    name: "",
    age: 18,
    score: 0
}

function setState(newState,data) {
    state = { ...state, ...newState };

    render(data);
}

window.onDragStart = function(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.currentTarget.style.backgroundColor = 'rgb(253, 255, 210)';
};


window.onDragOver = function(event) {
    event.preventDefault();
};

window.onDrop = function(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    let dropzone = event.target;

    // Ensure the dropzone is correctly identified
    if (!dropzone.classList.contains('label-dropzone')) {
        dropzone = dropzone.closest('.label-dropzone');
    }

    // Check if the dropzone already has a child element
    if (dropzone && dropzone.children.length === 0) {
        dropzone.appendChild(draggableElement);
    } else {
        alert("This drop zone can only have one label.");
        draggableElement.style.backgroundColor = '#FFB4C2';
    }

    event.dataTransfer.clearData();
};

function render(data) {
    var cardHTML = ``

    if(state.lvlIndex == -1){
        document.getElementById("title1").textContent = "How much Spanish do you know?"
        document.getElementById("title1").style.marginLeft = "5rem"
        cardHTML =`
        <div id="skill-level">
            <div id="nameInput">
                <label for="name">Name </label><br>
                <input type="text" id="name" name="name">
            </div>
            <div id="ageInput">
                <label for="age">Age </label><br>
                <input type="number" id="age" name="age">
            </div>
            <input type="radio" id="new" name="skill" value="new">
            <label for="new">I'm new to Spanish</label><br>
            <input type="radio" id="common" name="skill" value="common">
            <label for="common">I know some common words</label><br>
            <input type="radio" id="conversation" name="skill" value="conversation">
            <label for="conversation">I can have basic conversation</label><br>
        </div>
        `

        document.getElementById("subtitle1").remove();
        document.getElementById('render').innerHTML = cardHTML
        document.getElementById('skill-level').style.fontSize="2rem";
        document.getElementById("skill-level").style.margin="2rem";
        document.getElementById("nameInput").style.display="flex";
        document.getElementById("nameInput").style.gap="0.5rem";
        document.getElementById("nameInput").style.margin="1rem";
        document.getElementById("name").style.border="0.1rem solid black";
        document.getElementById("name").style.fontSize="2rem";
        document.getElementById("ageInput").style.display="flex";
        document.getElementById("ageInput").style.gap="0.5rem";
        document.getElementById("ageInput").style.margin="1rem";
        document.getElementById("age").style.border="0.1rem solid black";
        document.getElementById("age").style.fontSize="2rem";
    } else if(state.lvlIndex >= 0){
        if(state.lvlIndex == 0){
            document.getElementById("title-card").remove()
            document.getElementById("title-area").remove()
        }

        if(data[state.lvlIndex].type=="vocab"){
            globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });

            document.getElementById("sec1").style.width="0%"
            document.getElementById("sec3").style.width="0%"
            let vocabHtml = `
            <div class="vocab${state.lvlIndex}" style="display:flex; flex-direction:column; align-items:center;">
                <h1 style="text-align:center;font-size:3rem;margin:1rem;">${data[state.lvlIndex].title}</h1>
                <p style="font-size:2rem;margin:0.5rem;">${data[state.lvlIndex].desc}</p>
                <p>You can slow down the pronouncation by using ︙-> playback speed</p>
                <div class="table-wrap">
                    <table>
                        <tr>
                            <th>Image</th>
                            <th>Spanish</th>
                            <th>English</th>
                            <th>Pronouncation</th>
                        </tr>
                        ${
                            data[state.lvlIndex].elements.map(d => `
                            <tr>
                                <td><img src="${d.img}" alt="${d.english}"></td>
                                <td>${d.spanish}</td>
                                <td>${d.english}</td>
                                <td>
                                    <audio controls>
                                        <source src="${d.audio}" type="audio/mpeg">
                                        Your browser does not support the audio element.
                                    </audio>
                                </td>
                            </tr>
                        `).join('')
                        }
                    </table>
                </div>
                <button id="startBtn" style="margin:1rem;" onclick="Navigate();">Next</button>
            </div>
        `
            document.getElementById("data").innerHTML = vocabHtml
        }else if(data[state.lvlIndex].type=="MCQ"){
            globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });

            let subHTML = data[state.lvlIndex].elements.map((e, x) =>
                `
                <div id="MCQ${x}" class="MCQ">
                    <div class="vocab-img">
                        <img src="${e.img}" alt="???">
                    </div>
                    <div class="choices">
                        ${
                            e.choices.map((c, i) => `
                            <input type="radio" id="choice-${x}-${i}" name="choice${x}" value="${c}">
                            <label for="choice-${x}-${i}">${c}</label><br>
                        `).join('')
                        }
                    </div>
                </div>
                `
            ).join('')
    
            questionHTML = `
            <div id="Q${state.lvlIndex}">
                <h1 style="text-align:center;font-size:3rem;margin:1rem;">${data[state.lvlIndex].title}</h1>
                <h4 style="font-size:2rem;margin:0.5rem;">${data[state.lvlIndex].desc}</h4>
                <div class="element">
                    ${subHTML}
                </div>
                <button id="startBtn" style="margin:1rem;" onclick="Navigate();">Next</button>
            </div>
            `
            document.getElementById("data").innerHTML = questionHTML
            state.checkAnswer = true

            document.getElementById("sec1").style.width="75%"
            document.getElementById("sec3").style.width="75%"
        }else if(data[state.lvlIndex].type=="sort"){
            globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });

            document.getElementById("sec1").style.width="0%"
            document.getElementById("sec3").style.width="0%"

            var wordsHTML =``
            var areaHTML = ``
            var allQuestionsHTML = ``

            data[state.lvlIndex].elements.forEach((q,x)=>{
                wordsHTML = q.labels.map((c, i) => `
                    <div id="draggable-${x}-${i}" class="draggable-label" ${c.ignore==false ? 'draggable="true"' : 'draggable="false" style="background-color: rgb(0, 0, 0,0);"'} draggable="true" ondragstart="onDragStart(event);">
                        ${c.txt}
                    </div>
                `).join('')

                areaHTML = q.answer.map((c, i) => `
                    <div id="zone-${x}-${i}" class="label-dropzone" ondragover="onDragOver(event);" ondrop="onDrop(event);" ${c.ignore==false ? '' : ' style="background-color: rgba(0, 0, 0, 0);"'}">
                    ${c.ignore==true?`${c.txt}`:''}
                    </div>
                `).join('');

                var questionHTML = `
                <div class="sort-area" id="sort-${x}">
                    <div class="labels-to-sort" id="labels-${x}">
                        ${wordsHTML}
                    </div>
                    <div class="sorted-labels" id="answer-${x}">
                        ${areaHTML}
                    </div>
                    <div id="sentence-${x}"></div>
                </div>
                `

                allQuestionsHTML += questionHTML
            })

            var areaHTML = `
            <div id="Q${state.lvlIndex}">
                <h1 style="text-align:center;font-size:3rem;margin:1rem;">${data[state.lvlIndex].title}</h1>
                <h4 style="font-size:2rem;margin:0.5rem;">${data[state.lvlIndex].desc}</h4>
                <div class="element">
                    ${allQuestionsHTML}
                </div>
                <button id="startBtn" style="margin:1rem;" onclick="Navigate();">Next</button>
            </div>
            `
            document.getElementById("data").innerHTML = areaHTML

            state.checkAnswer = true
        }
    } 
}

function checkAnswer(data){
    globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    if(data[state.lvlIndex].type=="MCQ"){
        var questions = document.getElementsByClassName("MCQ")
        var unanswered = false
        var unansweredMCQ = []
        Array.from(questions).forEach((q,i) =>{
            let selectedChoice = document.querySelector(`input[name="choice${i}"]:checked`);

            if(selectedChoice == null){
                unanswered = true
                unansweredMCQ.push(i)
            } else{
                document.getElementById(`MCQ${i}`).style.border = "none"
            }
        })
        
        if(unanswered == true){
            alert("Please make sure that all the questions have been answered.");
            unansweredMCQ.forEach(q => {
                document.getElementById(`MCQ${q}`).style.border = "0.1rem solid red"
            })
        } else{
            Array.from(questions).forEach((q,i) =>{
                document.getElementById(`MCQ${i}`).style.border = "none"
                var answer = document.querySelector(`input[name="choice${i}"][value="${data[state.lvlIndex].elements[i].answer}"]`);
                var label = document.querySelector(`label[for="${answer.id}"]`);
                label.style.backgroundColor = "lightgreen"
    
                let selectedChoice = document.querySelector(`input[name="choice${i}"]:checked`);
    
                if(selectedChoice!= null && answer.id!=selectedChoice.id){
                    var wrongLabel =document.querySelector(`label[for="${selectedChoice.id}"]`);
                    wrongLabel.style.backgroundColor = "lightsalmon"
                }else if(selectedChoice ==null){
        
                } 
                else{
                    state.score = state.score+100
                }
            })

            state = {
                cardIndex: state.cardIndex,
                lvlIndex: state.lvlIndex,
                checkAnswer: false,
                score: state.score,
                name: state.name
            }
        }
        
    } else if(data[state.lvlIndex].type=="sort"){
        var questions = document.getElementsByClassName("sort-area")
        Array.from(questions).forEach((q,x) =>{
            data[state.lvlIndex].elements[x].answer.forEach((a,i) => {
                if(a.ignore == false){
                    var studentAns = document.getElementById(`zone-${x}-${i}`).textContent.replace(/\s+/g, '')
                    
                    if(studentAns.toLowerCase()==a.txt.toLowerCase()){
                        document.getElementById(`zone-${x}-${i}`).style.backgroundColor= "lightgreen"
                        state.score = state.score+100
                    }else{
                        document.getElementById(`zone-${x}-${i}`).style.backgroundColor= "lightsalmon"
                    }
                }
            });

            var sentence = data[state.lvlIndex].elements[x].answer.map(item => item.txt).join(' ');
            document.getElementById(`sentence-${x}`).innerHTML =`<h4>Answer: ${sentence}</h4>`
            document.getElementById(`sentence-${x}`).style.textAlign = "center";
            document.getElementById(`sentence-${x}`).style.fontSize = "2rem";

            state = {
                cardIndex: state.cardIndex,
                lvlIndex: state.lvlIndex,
                checkAnswer: false,
                score: state.score,
                name: state.name
            }
        })
    }
}

fetch("/api/spanishTrip")
.then((response) => response.json())
.then((data) => {
    window.Navigate = async function(){
        if(state.checkAnswer == true){
            checkAnswer(data)
        } else if(data[state.lvlIndex].id == data.length){
            let user = {
                "userName":state.name,
                "age": state.age,
                "score": state.score,
            } 
            const response = await fetch('/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            document.getElementById("sec1").style.width="75%"
            document.getElementById("sec3").style.width="75%"
            
            var endHTML = `
            <svg id="title-card" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M35.2,-64C46.2,-54.6,56.1,-46.4,65.8,-35.9C75.4,-25.4,84.7,-12.7,87.9,1.9C91.2,16.5,88.5,33,77.1,40.4C65.7,47.7,45.5,45.8,31.2,43.5C16.9,41.2,8.4,38.5,-1.5,41.1C-11.5,43.8,-23,51.7,-33.7,52C-44.4,52.2,-54.4,44.6,-64.7,34.7C-75.1,24.8,-85.8,12.4,-86.1,-0.1C-86.3,-12.7,-76,-25.3,-65.1,-34.3C-54.2,-43.2,-42.6,-48.5,-31.7,-58C-20.7,-67.4,-10.4,-81,0.9,-82.5C12.1,-84,24.2,-73.4,35.2,-64Z" transform="translate(100 100)" />
              <div id="title-area">
                <h1 id="title1">- End -</h1>
              </div>
            </svg>
            `

            document.getElementById("data").innerHTML = endHTML
        }
        else if(state.lvlIndex >= 0){
            setState(
                { 
                    cardIndex: 0,
                    lvlIndex: ++state.lvlIndex,
                    checkAnswer: false,
                    score: state.score,
                    name: state.name,
                    age: state.age
                },
                data)
        }
    }

    document.getElementById("startBtn").onclick = () => {
        if(state.checkAnswer == true){
            checkAnswer(data)
        }  else if(state.lvlIndex== -2){
            setState(
                { 
                    cardIndex: 0,
                    lvlIndex: ++state.lvlIndex,
                    checkAnswer: false,
                    score: state.score,
                    name: state.name,
                    age: state.age
                },
                data)
        } else if(state.lvlIndex== -1){
            var userName = document.getElementById("name").value
            var userAge = document.getElementById("age").value
            
            if(userName==""){                
                document.getElementById("name").style.border="0.2rem solid red"
            }
            if(userAge == ""){
                document.getElementById("age").style.border="0.2rem solid red"
            }
            if(userName != "" && userAge != ""){
                setState(
                    { 
                        cardIndex: 0,
                        lvlIndex: ++state.lvlIndex,
                        checkAnswer: false,
                        score: state.score,
                        name: userName,
                        age: userAge
                    },
                    data)
            }
        }
    }
    
    render(data);
})
.catch((error) => {
  console.error("Error:", error);
});
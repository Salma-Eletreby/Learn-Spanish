fetch("https://salma-eletreby.github.io/Learn-Spanish/Data/spanishFood.json")
.then((response) => response.json())
.then((data) => {
    const questionData = data.filter(d => d.type != "vocab");
    questionData.forEach(q => {
        console.log(q);
        if(q.type=="MCQ")
        {   
            let subHTML = q.elements.map(e =>
                `
                    <div class="vocab-img">
                        <img src="${e.img}" alt="???">
                    </div>
                <div class="choices">
                    ${
                        e.choices.map((c, i) => `
                        <input type="radio" id="choice${i}" name="choice" value="${c}">
                        <label for="choice${i}">${c}</label><br>
                    `).join('')
                    }
                <div>
                `
            ).join('')

            questionHTML = `
            <h1>${q.title}</h1>
            <h4>${q.desc}</h4>
            <div class="element">
                ${subHTML}
            </div>
            `
            document.getElementById("exam").innerHTML += questionHTML
        } 
    });


})
.catch((error) => {
  console.error("Error:", error);
});
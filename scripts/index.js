fetch("https://salma-eletreby.github.io/Learn-Spanish/Data/spanishFood.json")
.then((response) => response.json())
.then((data) => {
    const vocabData = data.filter(d => d.type === "vocab");
    let scoreHtml = vocabData.map((v, i) => `
                <div class="category">
                    <h4>${v.title}</h4>
                    <p>${v.desc}</p>
                    <table>
                        <tr>
                            <th>Image</th>
                            <th>Spanish</th>
                            <th>English</th>
                            <th>Arabic</th>
                            <th>Pronouncation</th>
                        </tr>
                        ${
                          v.elements.map(d => `
                            <tr>
                                <td><img src="${d.img}" alt="${d.english}"></td>
                                <td>${d.spanish}</td>
                                <td>${d.english}</td>
                                <td>${d.arabic}</td>
                                <td>
                                    <audio controls>
                                        <source src="${d.audio}" type="audio/mpeg">
                                        Your browser does not support the audio element.
                                    </audio>
                                </td>
                            </tr>
                        `).join('')
                        }
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                </div>
            `).join('')


    document.getElementById("vocab").innerHTML += scoreHtml
})
.catch((error) => {
  console.error("Error:", error);
});
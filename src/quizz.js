document.addEventListener("DOMContentLoaded", function () {
  ajouterQuestion(); // Ajouter une première question par défaut
});

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

let questionCount = 0; // Compteur de questions pour identifier unique

function ajouterQuestion() {
  questionCount++;

  const encodingSection = document.getElementById("encodingSection");
  const questionHTML = `

  <div class="questionBlock bg-white p-4 rounded-lg mb-4">
  <div class="mb-2">

  <input type="text" 
  
  
  placeholder="URL de l'image (optionnel)" 
  
  
  id="imageUrl${questionCount}" class="imageUrl bg-gray-100 rounded border border-gray-300 p-2 w-full">
</div>

  <div class="font-bold mb-2">Question ${questionCount}: <input type="text" placeholder="Votre question ici" id="question${questionCount}" class="input bg-gray-100 rounded border border-gray-300 p-2 focus:outline-none focus:border-blue-500 w-full"></div>
  <div class="flex items-center mb-2">
    <input type="text" class="reponse${questionCount} bg-gray-100 rounded border border-gray-300 p-2 focus:outline-none focus:border-blue-500 mr-2 w-full" placeholder="Réponse 1">
    <input type="radio" name="correct${questionCount}" value="1" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
  </div>


  <div class="flex items-center mb-2">

    <input type="text" class="reponse${questionCount}
     bg-gray-100 rounded border border-gray-300 p-2 focus:outline-none focus:border-blue-500 mr-2 w-full" placeholder="Réponse 2">
    <input type="radio" name="correct${questionCount}" value="2" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
  </div>

  <div class="flex items-center mb-2">
    <input type="text" class="reponse${questionCount} bg-gray-100 rounded border border-gray-300 p-2 focus:outline-none focus:border-blue-500 mr-2 w-full" placeholder="Réponse 3">
    <input type="radio" name="correct${questionCount}" value="3" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
  </div>
</div>

        <br>`;
  encodingSection.insertAdjacentHTML("beforeend", questionHTML);
}

function genererPreview() {
  let totalPreviewHTML = `<style>
  .questionBlock {
    padding-bottom: 30px;
    }
    
    .question {
      padding-bottom: 15px;
      font-weight: bold;
    }
      
    
        button {
      background-color: #4CAF50; /* Couleur de fond verte */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 12px; /* Bordures arrondies */
      transition: background-color 0.3s ease; /* Transition douce au survol */
    }
    
    button:hover {
      background-color: #45a049; /* Couleur au survol */
    }
      #resultats {
        padding-top: 10px;
        font-weight: bolder;
      }
  </style>`; // Accumuler tout le HTML pour la prévisualisation
  let correctAnswersScript = "const correctAnswers = {\n"; // Initialiser le script des réponses correctes

  const questionBlocks = document.querySelectorAll(".questionBlock");
  questionBlocks.forEach((block, index) => {
    const questionNumber = `q${index + 1}`;
    const question = block.querySelector(`#question${index + 1}`).value;
    const imageUrl = block.querySelector(`#imageUrl${index + 1}`).value;
    const reponses = block.querySelectorAll(`.reponse${index + 1}`);
    const correctInput = block.querySelector(
      `input[name='correct${index + 1}']:checked`
    ).value;

    let imageHtml = "";
    if (imageUrl && isValidHttpUrl(imageUrl)) {
      imageHtml = `<img src="${imageUrl}" alt="Image pour la question ${index + 1
        }" class="mb-2 max-w-xs mx-auto"/>`;
    } else if (imageUrl) {
      alert(
        "L'URL fournie pour l'image de la question " +
        (index + 1) +
        " n'est pas valide."
      );
      return;
    }

    correctAnswersScript += `    "${questionNumber}": "${correctInput}",\n`;

    let previewHTML = `<div class="question">${imageHtml}Question ${index + 1
      }: ${question}</div>`;
    reponses.forEach((reponse, idx) => {
      previewHTML += `<div><input type="radio" name="${questionNumber}" value="${idx + 1
        }"> ${reponse.value}</div>`;
    });

    totalPreviewHTML += `<div class="questionBlock">${previewHTML}</div>`;
  });

  correctAnswersScript += "};\n";
  totalPreviewHTML += `<button onclick="correction()">Soumettre</button><div id="resultats"></div>`;

  const correctionScript = `
    <script>
    ${correctAnswersScript}

    function correction() {
        let score = 0;
        const questionBlocks = document.querySelectorAll('.questionBlock');

        questionBlocks.forEach((block, index) => {
            const questionNumber = \`q\${index + 1}\`;
            const correctAnswer = correctAnswers[questionNumber];
            const options = block.querySelectorAll(\`input[name='\${questionNumber}']\`);

            options.forEach(option => {
                const isCorrect = option.value === correctAnswer;
                option.parentElement.classList.remove('correct', 'incorrect');
                if (isCorrect) {
                    if (option.checked) {
                        score++;
                    }
                    option.parentElement.style.backgroundColor = 'lightgreen'; // Correct answer
                } else {
                    option.parentElement.style.backgroundColor = 'lightcoral'; // Incorrect answer
                }
            });
        });

        const resultatDiv = document.getElementById("resultats");
        resultatDiv.innerHTML = \`Vous avez obtenu \${score} sur \${questionBlocks.length} réponses correctes.\`;
    }
    </script>`;

  // Mettre à jour le contenu de codeOutput
  const codeOutput = document.getElementById("codeOutput");
  codeOutput.value = totalPreviewHTML + correctionScript;
}

document.getElementById("btnGenerer").addEventListener("click", function () {
  const codeOutput = document.getElementById("codeOutput").value;
  genererPreview(); // Génère le contenu pour codeOutput
  insererContenuDansIframe(codeOutput); // Insère le contenu de codeOutput dans l'iframe
});

function copierCode() {
  const codeOutput = document.getElementById("codeOutput");
  navigator.clipboard
    .writeText(codeOutput.value)
    .then(() => alert("Code copié dans le presse-papiers !"))
    .catch((err) => console.error("Erreur lors de la copie :", err));
}

function insererContenuDansIframe(code) {
  // Obtenir le parent de l'iframe actuelle
  const iframeContainer = document.getElementById("vueLive").parentNode;
  const oldIframe = document.getElementById("vueLive");

  // Créer une nouvelle iframe
  const newIframe = document.createElement("iframe");
  newIframe.id = oldIframe.id;
  newIframe.name = oldIframe.name;
  newIframe.style.width = oldIframe.style.width; // Copiez d'autres attributs au besoin
  newIframe.style.height = oldIframe.style.height;

  // Supprimer l'ancienne iframe et ajouter la nouvelle au conteneur
  iframeContainer.removeChild(oldIframe);
  iframeContainer.appendChild(newIframe);

  // Utiliser la nouvelle iframe pour le contenu
  const iframe = newIframe;
  const doc = iframe.contentDocument || iframe.contentWindow.document;

  // Procédez comme avant pour insérer le contenu
  doc.open();
  doc.write("..");
  doc.close();

  const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/gi;
  let scriptContent = "";
  let htmlContent = code.replace(scriptRegex, function (match, group1) {
    scriptContent += group1 + "\n";
    return ""; // Supprime le script du HTML
  });

  const contenu = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

  doc.open();
  doc.write(contenu);

  if (scriptContent.trim() !== "") {
    const scriptTag = doc.createElement("script");
    scriptTag.textContent = scriptContent;
    doc.body.appendChild(scriptTag);
  }

  doc.close();
}

document.getElementById("btnGenerer").addEventListener("click", function () {
  const codeOutput = document.getElementById("codeOutput").value;
  insererContenuDansIframe(codeOutput);
});

document.getElementById("openModal").addEventListener("click", function () {
  document.getElementById("modal").classList.remove("hidden");
});

document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("modal").classList.add("hidden");
});

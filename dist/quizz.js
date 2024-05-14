document.addEventListener("DOMContentLoaded", function () {
    ajouterQuestion(); // Ajouter une première question par défaut
  });
  
  let questionCount = 0; // Compteur de questions pour identifier unique
  
  function ajouterQuestion() {
    questionCount++;
    const encodingSection = document.getElementById("encodingSection");
    const questionHTML = `
          <div class="questionBlock">
              <div>Question ${questionCount}: <input type="text" placeholder="Votre question ici" id="question${questionCount}"></div>
              <div>Réponse 1: <input type="text" class="reponse${questionCount}"><input type="radio" name="correct${questionCount}" value="1"></div>
              <div>Réponse 2: <input type="text" class="reponse${questionCount}"><input type="radio" name="correct${questionCount}" value="2"></div>
              <div>Réponse 3: <input type="text" class="reponse${questionCount}"><input type="radio" name="correct${questionCount}" value="3"></div>
          </div>
          <br>`;
    encodingSection.insertAdjacentHTML("beforeend", questionHTML);
  }
  
  function genererPreview() {
    const previewSection = document.getElementById("previewSection");
    previewSection.innerHTML = ""; // Nettoyer la prévisualisation précédente
    let totalPreviewHTML = ""; // Accumuler tout le HTML pour la prévisualisation
    let correctAnswersScript = "const correctAnswers = {\n"; // Initialiser le script des réponses correctes
  
    const questionBlocks = document.querySelectorAll(".questionBlock");
    questionBlocks.forEach((block, index) => {
      const questionNumber = `q${index + 1}`;
      const question = block.querySelector(`input[type='text']`).value;
      const reponses = block.querySelectorAll(`.reponse${index + 1}`);
      const correctInput = block.querySelector(
        `input[name='correct${index + 1}']:checked`
      ).value;
      correctAnswersScript += `    "${questionNumber}": "${correctInput}",\n`; // Ajouter la réponse correcte au script
  
      let previewHTML = `<div class="question">Question ${
        index + 1
      }: ${question}</div>`;
      reponses.forEach((reponse, idx) => {
        previewHTML += `<div><input type="radio" name="${questionNumber}" value="${
          idx + 1
        }"> ${reponse.value}</div>`;
      });
  
      totalPreviewHTML += `<div class="questionBlock">${previewHTML}</div>`;
    });
  
    correctAnswersScript += "};\n"; // Fermer l'objet des réponses correctes
  
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
  
    previewSection.innerHTML = totalPreviewHTML; // Mettre à jour la prévisualisation visuelle
  
    // Copie le contenu généré et le script de correction dans codeOutput
    const codeOutput = document.getElementById("codeOutput");
    codeOutput.value = totalPreviewHTML + correctionScript; // Ajouter le script de correction
  }
  
  function copierCode() {
    const codeOutput = document.getElementById("codeOutput");
    navigator.clipboard
      .writeText(codeOutput.value)
      .then(() => alert("Code copié dans le presse-papiers !"))
      .catch((err) => console.error("Erreur lors de la copie :", err));
  }
  
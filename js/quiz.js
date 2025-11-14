

let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;

async function loadQuizData() {
    try {
        const response = await fetch('data/quiz.json');
        const quizData = await response.json();
        return quizData;
    } catch (error) {
        console.error('Erreur lors du chargement des quiz:', error);
        return {};
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    const quizData = await loadQuizData();
    displayQuizSelection(quizData);
});


function displayQuizSelection(quizData) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class="flex flex-col items-center gap-9 mt-8">
            ${Object.keys(quizData).map(quizKey => {
                const quiz = quizData[quizKey];
                return `
                    <div class="quiz-item w-full sm:w-[300px] md:w-[350px] bg-[#92140C] font-bold h-[40px] w-[550px] border border-[2px] border-white flex items-center justify-center cursor-pointer transition-all duration-300" onclick="startQuiz('${quizKey}')">
                        ${quiz.titre}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}
async function startQuiz(quizKey) {
    const quizData = await loadQuizData();
    currentQuiz = quizData[quizKey];
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.questions.length).fill(null);
    score = 0;
    
    displayQuestion();
}


function displayQuestion() {
    if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length) {
        showResults();
        return;
    }

    const question = currentQuiz.questions[currentQuestionIndex];
    const container = document.getElementById('quiz-container');
    
    if (question.type === 'checkbox') {

        container.innerHTML = `
            <div class=" text-white rounded-2xl p-8 mx-auto max-w-2xl ">
                <div class="flex justify-between items-center mb-8">
                    <div class="question-progress font-bold  text-lg">Question ${currentQuestionIndex + 1}/${currentQuiz.questions.length}</div>
                </div>
                
                <div class="question-text text-2xl font-bold text-center mb-8 leading-relaxed">
                    ${question.question}
                </div>
                
                <div class="options-container space-y-4 mb-8">
                    ${question.options.map((option, index) => `
                        <div class="checkbox-option w-full border-2 border-gray-300 bg-[#92140C] p-4 text-left text-lg cursor-pointer" onclick="toggleCheckbox(${index})">
                            <span>${option}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="navigation-buttons flex justify-between gap-4">
                    <button class="nav-btn prev-btn bg-gray-600 text-white py-3 px-6 rounded-lg font-bold flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:bg-gray-700" onclick="previousQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                        ← Précédent
                    </button>
                    <button class="nav-btn next-btn bg-[#92140C] text-white py-3 px-6 rounded-lg font-bold flex-1 transition-all duration-300 hover:bg-[#7a1109]" onclick="nextQuestion()">
                        ${currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Terminer' : 'Suivant →'}
                    </button>
                </div>
            </div>
        `;
        

        if (userAnswers[currentQuestionIndex]) {
            userAnswers[currentQuestionIndex].forEach(selectedIndex => {
                const option = container.querySelectorAll('.checkbox-option')[selectedIndex];
                if (option) option.classList.add('selected');
            });
        }
        
    } else if (question.type === 'true_false') {

        container.innerHTML = `
            <div class=" text-white  p-8 mx-auto max-w-2xl ">
                <div class="flex justify-between items-center mb-8">
                    <div class="question-progress font-bold  text-lg">Question ${currentQuestionIndex + 1}/${currentQuiz.questions.length}</div>
                </div>
                
                <div class="question-text text-2xl font-bold text-center mb-8  leading-relaxed">
                    ${question.question}
                </div>
                
                <div class="options-container flex justify-center gap-8 mb-8">
                    <button class="true-false-btn text-black bg-white border-2 border-gray-300  p-6 text-lg font-bold w-32" onclick="selectTrueFalse(true)">
                        VRAI
                    </button>
                    <button class=" text-black true-false-btn bg-white border-2 border-gray-300 p-6 text-lg font-bold w-32" onclick="selectTrueFalse(false)">
                        FAUX
                    </button>
                </div>
                
                <div class="navigation-buttons flex justify-between gap-4">
                    <button class="nav-btn prev-btn bg-gray-600 text-white py-3 px-6  font-bold flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:bg-gray-700" onclick="previousQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                        ← Précédent
                    </button>
                    <button class="nav-btn next-btn bg-[#92140C] text-white py-3 px-6  font-bold flex-1 transition-all duration-300 hover:bg-[#7a1109]" onclick="nextQuestion()">
                        ${currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Terminer' : 'Suivant →'}
                    </button>
                </div>
            </div>
        `;
 
        if (userAnswers[currentQuestionIndex] !== null) {
            const buttons = container.querySelectorAll('.true-false-btn');
            if (userAnswers[currentQuestionIndex] === true) {
                buttons[0].classList.add('selected');
            } else {
                buttons[1].classList.add('selected');
            }
        }
    }
}


function toggleCheckbox(index) {
    const options = document.querySelectorAll('.checkbox-option');
    const option = options[index];
    
    option.classList.toggle('selected');

    if (!userAnswers[currentQuestionIndex]) {
        userAnswers[currentQuestionIndex] = [];
    }
    
    if (option.classList.contains('selected')) {
        userAnswers[currentQuestionIndex].push(index);
    } else {
        userAnswers[currentQuestionIndex] = userAnswers[currentQuestionIndex].filter(i => i !== index);
    }
}


function selectTrueFalse(value) {
    const buttons = document.querySelectorAll('.true-false-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    if (value === true) {
        buttons[0].classList.add('selected');
    } else {
        buttons[1].classList.add('selected');
    }
    
    userAnswers[currentQuestionIndex] = value;
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === null || 
        (currentQuiz.questions[currentQuestionIndex].type === 'checkbox' && 
         (!userAnswers[currentQuestionIndex] || userAnswers[currentQuestionIndex].length === 0))) {
        alert('Veuillez sélectionner une réponse');
        return;
    }
    
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        showResults();
    }
}


function showResults() {
    score = 0;
    currentQuiz.questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        
        if (question.type === 'checkbox') {
            
            if (userAnswer && arraysEqual(userAnswer.sort(), question.correctAnswer.sort())) {
                score += question.points;
            }
        } else if (question.type === 'true_false') {
           
            if (userAnswer === question.correctAnswer) {
                score += question.points;
            }
        }
    });
    
    
    
    
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <div class=" text-white rounded-2xl p-10 mx-auto max-w-2xl  text-center">
            <h2 class="results-title text-3xl font-bold mb-8  font-[Irish_Grover]">Résultats</h2>
            
            <div class="score-display flex flex-col justify-center items-center gap-8 mb-8">
                <div class="score-circle w-32 h-32 bg-[#92140C] rounded-full flex flex-col justify-center items-center text-white border-4 border-[#1E1E24]">
                    <div class="score-main text-4xl font-bold">${score} </div>
            </div>
            <div>
                    
            <button class="restart-btn bg-[#92140C] text-white py-3 px-8 rounded-lg font-bold text-lg transition-all duration-300 hover:bg-[#7a1109] hover:scale-105" onclick="restartQuiz()">
                Retour aux Quiz
            </button>
        </div>
    `;
}




async function restartQuiz() {
    currentQuiz = null;
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    const quizData = await loadQuizData();
    displayQuizSelection(quizData);
}


function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}
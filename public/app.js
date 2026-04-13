// Application state
let currentQuestion = 'start';
let sessionAnswers = [];
let totalQuestions = Object.keys(questionFlow).length;

// Initialize the app
function init() {
    showQuestion(currentQuestion);
    updateProgress();
}

// Display a question
function showQuestion(questionId) {
    const question = questionFlow[questionId];
    const container = document.getElementById('question-container');
    
    if (!question) {
        console.error('Question not found:', questionId);
        return;
    }
    
    container.innerHTML = `
        <div class="question">
            <h2>${question.question}</h2>
            <div class="answers">
                ${question.answers.map((answer, index) => `
                    <button class="btn" onclick="handleAnswer('${questionId}', '${answer.text}', '${answer.next || ''}', '${answer.result || ''}')">
                        ${answer.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

// Handle answer selection
function handleAnswer(questionId, answerText, nextQuestion, resultId) {
    // Record the answer
    sessionAnswers.push({
        question: questionId,
        answer: answerText
    });
    
    // Update progress
    updateProgress();
    
    // Either show next question or show result
    if (resultId) {
        showResult(resultId);
        saveSession();
    } else if (nextQuestion) {
        currentQuestion = nextQuestion;
        showQuestion(nextQuestion);
    }
}

// Show final result
function showResult(resultId) {
    const result = results[resultId];
    
    if (!result) {
        console.error('Result not found:', resultId);
        return;
    }
    
    document.getElementById('question-container').classList.add('hidden');
    
    const resultContainer = document.getElementById('result-container');
    resultContainer.classList.remove('hidden');
    resultContainer.className = `result-container ${result.type}`;
    
    document.getElementById('result-title').textContent = result.title;
    document.getElementById('result-message').textContent = result.message;
    
    // Set progress to 100%
    document.getElementById('progress').style.width = '100%';
}

// Update progress bar
function updateProgress() {
    const progress = (sessionAnswers.length / totalQuestions) * 100;
    document.getElementById('progress').style.width = `${Math.min(progress, 100)}%`;
}

// Restart the quiz
function restartQuiz() {
    currentQuestion = 'start';
    sessionAnswers = [];
    
    document.getElementById('question-container').classList.remove('hidden');
    document.getElementById('result-container').classList.add('hidden');
    
    showQuestion(currentQuestion);
    updateProgress();
}

// Save session to backend
async function saveSession() {
    try {
        const response = await fetch('http://localhost:3000/api/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answers: sessionAnswers
            })
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('Session saved:', data.sessionId);
        }
    } catch (error) {
        console.error('Error saving session:', error);
        // Continue anyway - don't break user experience
    }
}

// Start the app when page loads
document.addEventListener('DOMContentLoaded', init);

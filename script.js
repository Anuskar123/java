// Java Programming TCA Exam Application
class JavaExam {
    constructor() {
        this.examQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = new Map();
        this.timeLimit = 45 * 60; // 45 minutes in seconds
        this.timeRemaining = this.timeLimit;
        this.timerInterval = null;
        this.examStartTime = null;
        this.examEndTime = null;
        
        // Matching question state
        this.currentMatchingQuestion = null;
        this.selectedPrompt = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showStartScreen();
    }
    
    bindEvents() {
        // Start screen events
        document.getElementById('start-exam').addEventListener('click', () => this.startExam());
        
        // Question navigation events
        document.getElementById('prev-question').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        
        // Review screen events
        document.getElementById('review-answers').addEventListener('click', () => this.showReviewScreen());
        document.getElementById('back-to-questions').addEventListener('click', () => this.showQuestionScreen());
        document.getElementById('submit-exam').addEventListener('click', () => this.submitExam());
        
        // Results screen events
        document.getElementById('restart-exam').addEventListener('click', () => this.restartExam());
        document.getElementById('export-results').addEventListener('click', () => this.exportResults());
        
        // Modal events
        document.getElementById('modal-cancel').addEventListener('click', () => this.hideModal());
        document.getElementById('modal-confirm').addEventListener('click', () => this.confirmModalAction());
        
        // Special styling for 20 questions
        document.getElementById('question-count').addEventListener('change', (e) => {
            if (e.target.value === '20') {
                document.body.classList.add('questions-20');
            } else {
                document.body.classList.remove('questions-20');
            }
        });
        
        // Set initial state if 20 is selected
        if (document.getElementById('question-count').value === '20') {
            document.body.classList.add('questions-20');
        }
    }
    
    showStartScreen() {
        this.hideAllScreens();
        document.getElementById('start-screen').classList.add('active');
        document.getElementById('navigation-panel').style.display = 'none';
    }
    
    showQuestionScreen() {
        this.hideAllScreens();
        document.getElementById('question-screen').classList.add('active');
        document.getElementById('navigation-panel').style.display = 'block';
        this.updateQuestionDisplay();
        this.updateNavigationPanel();
    }
    
    showReviewScreen() {
        this.hideAllScreens();
        document.getElementById('review-screen').classList.add('active');
        document.getElementById('navigation-panel').style.display = 'none';
        this.updateReviewDisplay();
    }
    
    showResultsScreen() {
        this.hideAllScreens();
        document.getElementById('results-screen').classList.add('active');
        document.getElementById('navigation-panel').style.display = 'none';
        this.updateResultsDisplay();
    }
    
    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }
    
    startExam() {
        const questionCount = parseInt(document.getElementById('question-count').value);
        const randomize = document.getElementById('randomize-questions').checked;
        
        // Select questions
        if (randomize) {
            this.examQuestions = this.getRandomQuestions(questionCount);
        } else {
            this.examQuestions = questionBank.slice(0, questionCount);
        }
        
        // Reset exam state
        this.currentQuestionIndex = 0;
        this.userAnswers.clear();
        this.examStartTime = new Date();
        this.timeRemaining = this.timeLimit;
        
        // Start timer
        this.startTimer();
        
        // Show question screen
        this.showQuestionScreen();
        this.updateExamInfo();
    }
    
    getRandomQuestions(count) {
        const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, questionBank.length));
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = timeString;
        
        // Add warning class when less than 5 minutes
        if (this.timeRemaining <= 300) {
            document.getElementById('timer').classList.add('warning');
        }
    }
    
    timeUp() {
        clearInterval(this.timerInterval);
        this.showModal('Time\'s Up!', 'Your exam time has expired. Submitting your current answers.', () => {
            this.submitExam();
        });
    }
    
    updateExamInfo() {
        // Update question counter
        const questionCounter = document.getElementById('question-counter');
        if (questionCounter) {
            questionCounter.textContent = 
                `Question ${this.currentQuestionIndex + 1} of ${this.examQuestions.length}`;
        }
        
        // Update score if element exists
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            const answeredCount = this.userAnswers.size;
            const totalPoints = this.examQuestions.reduce((sum, q) => sum + q.points, 0);
            const earnedPoints = this.calculateCurrentScore().points;
            scoreElement.textContent = `Score: ${earnedPoints}/${totalPoints}`;
        }
    }
    
    updateQuestionDisplay() {
        const question = this.examQuestions[this.currentQuestionIndex];
        if (!question) return;
        
        // Update question header
        document.querySelector('.question-type').textContent = this.formatQuestionType(question.type);
        document.querySelector('.question-points').textContent = `${question.points} point${question.points !== 1 ? 's' : ''}`;
        
        // Update question text and handle code blocks
        this.displayQuestionText(question);
        
        // Clear previous options
        document.getElementById('question-options').innerHTML = '';
        document.getElementById('fill-blank-input').style.display = 'none';
        document.getElementById('matching-container').style.display = 'none';
        
        // Display options based on question type
        this.displayQuestionOptions(question);
        
        // Update navigation buttons
        document.getElementById('prev-question').disabled = this.currentQuestionIndex === 0;
        document.getElementById('next-question').textContent = 
            this.currentQuestionIndex === this.examQuestions.length - 1 ? 'Finish' : 'Next';
        
        // Update progress bar
        const progressPercent = ((this.currentQuestionIndex + 1) / this.examQuestions.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
    }
    
    displayQuestionText(question) {
        const questionText = question.question;
        const codeBlockRegex = /```[\s\S]*?```|`[^`]*`/g;
        const hasCodeBlock = codeBlockRegex.test(questionText);
        
        if (hasCodeBlock) {
            // Separate question text and code
            const parts = questionText.split(codeBlockRegex);
            const codes = questionText.match(codeBlockRegex) || [];
            
            let displayText = parts[0];
            if (codes.length > 0) {
                // Show the code block
                document.getElementById('code-block').style.display = 'block';
                const codeContent = codes[0].replace(/```/g, '').trim();
                document.getElementById('code-content').textContent = codeContent;
                
                // Add the rest of the question text
                if (parts[1]) {
                    displayText += parts[1];
                }
            }
            
            document.getElementById('question-text').textContent = displayText;
        } else {
            document.getElementById('question-text').textContent = questionText;
            document.getElementById('code-block').style.display = 'none';
        }
    }
    
    formatQuestionType(type) {
        const typeMap = {
            'single-choice': 'Single Choice',
            'multiple-choice': 'Multiple Choice',
            'fill-blank': 'Fill in the Blank',
            'matching': 'Matching'
        };
        return typeMap[type] || type;
    }
    
    displayQuestionOptions(question) {
        const optionsContainer = document.getElementById('question-options');
        
        switch (question.type) {
            case 'single-choice':
                this.displaySingleChoiceOptions(question, optionsContainer);
                break;
            case 'multiple-choice':
                this.displayMultipleChoiceOptions(question, optionsContainer);
                break;
            case 'fill-blank':
                this.displayFillBlankOption(question);
                break;
            case 'matching':
                this.displayMatchingOptions(question);
                break;
        }
    }
    
    displaySingleChoiceOptions(question, container) {
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            
            const savedAnswer = this.userAnswers.get(question.id);
            const isSelected = savedAnswer && savedAnswer.includes(index);
            if (isSelected) optionDiv.classList.add('selected');
            
            // Create HTML content first
            optionDiv.innerHTML = `
                <input type="radio" name="q${question.id}" value="${index}" 
                       ${isSelected ? 'checked' : ''}>
                <label>${this.formatOptionText(option)}</label>
            `;
            
            // Make entire option clickable - set after innerHTML
            optionDiv.onclick = (e) => {
                e.preventDefault();
                // Clear other radio buttons in this group
                document.querySelectorAll(`input[name="q${question.id}"]`).forEach(radio => {
                    radio.checked = false;
                    radio.parentElement.classList.remove('selected');
                });
                
                // Select this option
                const input = optionDiv.querySelector('input');
                input.checked = true;
                optionDiv.classList.add('selected');
                this.selectOption(question.id, index, 'single');
            };
            
            container.appendChild(optionDiv);
        });
    }
    
    displayMultipleChoiceOptions(question, container) {
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            
            const savedAnswer = this.userAnswers.get(question.id);
            const isSelected = savedAnswer && savedAnswer.includes(index);
            if (isSelected) optionDiv.classList.add('selected');
            
            // Create HTML content first
            optionDiv.innerHTML = `
                <input type="checkbox" name="q${question.id}" value="${index}" 
                       ${isSelected ? 'checked' : ''}>
                <label>${this.formatOptionText(option)}</label>
            `;
            
            // Make entire option clickable - set after innerHTML
            optionDiv.onclick = (e) => {
                e.preventDefault();
                const input = optionDiv.querySelector('input');
                input.checked = !input.checked;
                this.selectOption(question.id, index, 'multiple');
            };
            
            container.appendChild(optionDiv);
        });
    }
    
    formatOptionText(text) {
        // Handle code snippets in options
        if (text.includes('class ') || text.includes('public ') || text.includes('System.out')) {
            return `<code>${text}</code>`;
        }
        return text;
    }
    
    displayFillBlankOption(question) {
        document.getElementById('fill-blank-input').style.display = 'block';
        const input = document.getElementById('fill-blank-answer');
        const savedAnswer = this.userAnswers.get(question.id);
        input.value = savedAnswer ? savedAnswer[0] : '';
        input.oninput = () => this.saveFillBlankAnswer(question.id, input.value);
    }
    
    displayMatchingOptions(question) {
        document.getElementById('matching-container').style.display = 'block';
        const container = document.getElementById('matching-container');
        
        const savedMatches = this.userAnswers.get(question.id) || {};
        
        container.innerHTML = `
            <div class="matching-instructions">
                <p>Click on a prompt on the left, then click on the corresponding answer on the right to create a match.</p>
            </div>
            <div class="matching-content">
                <div class="matching-prompts">
                    <h4>Items to Match</h4>
                    ${question.prompts.map((prompt, index) => `
                        <div class="matching-item prompt-item" data-prompt-index="${index}" data-prompt-text="${prompt}">
                            <span class="prompt-text">${prompt}</span>
                            <span class="match-indicator">${savedMatches[prompt] ? '→ ' + savedMatches[prompt] : ''}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="matching-answers">
                    <h4>Answer Options</h4>
                    ${question.answers.map((answer, index) => `
                        <div class="matching-item answer-item" data-answer-index="${index}" data-answer-text="${answer}">
                            ${answer}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="matching-controls">
                <button type="button" class="btn btn-secondary" onclick="exam.clearAllMatches(${question.id})">Clear All Matches</button>
            </div>
        `;
        
        // Initialize matching state for this question
        this.currentMatchingQuestion = question.id;
        this.selectedPrompt = null;
        
        // Add event listeners to matching items
        this.addMatchingEventListeners(question);
    }
    
    selectOption(questionId, optionIndex, type) {
        if (type === 'single') {
            this.userAnswers.set(questionId, [optionIndex]);
        } else {
            let currentAnswers = this.userAnswers.get(questionId) || [];
            if (currentAnswers.includes(optionIndex)) {
                currentAnswers = currentAnswers.filter(index => index !== optionIndex);
            } else {
                currentAnswers.push(optionIndex);
            }
            this.userAnswers.set(questionId, currentAnswers);
        }
        
        this.updateOptionStyles(questionId);
        this.updateNavigationPanel();
        this.updateExamInfo();
    }
    
    updateOptionStyles(questionId) {
        const options = document.querySelectorAll('.option');
        const savedAnswer = this.userAnswers.get(questionId);
        
        options.forEach((option, index) => {
            const input = option.querySelector('input');
            const inputValue = parseInt(input.value);
            
            if (savedAnswer && savedAnswer.includes(inputValue)) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }
    
    saveFillBlankAnswer(questionId, answer) {
        this.userAnswers.set(questionId, [answer]);
        this.updateNavigationPanel();
        this.updateExamInfo();
    }
    
    addMatchingEventListeners(question) {
        // Add click listeners to prompt items
        document.querySelectorAll('.prompt-item').forEach(promptItem => {
            promptItem.addEventListener('click', () => {
                // Clear previous selection
                document.querySelectorAll('.prompt-item').forEach(item => item.classList.remove('selected'));
                
                // Select this prompt
                promptItem.classList.add('selected');
                this.selectedPrompt = {
                    text: promptItem.dataset.promptText,
                    element: promptItem
                };
            });
        });
        
        // Add click listeners to answer items
        document.querySelectorAll('.answer-item').forEach(answerItem => {
            answerItem.addEventListener('click', () => {
                if (this.selectedPrompt) {
                    this.createMatch(question.id, this.selectedPrompt.text, answerItem.dataset.answerText);
                    this.updateMatchingDisplay(question);
                    this.selectedPrompt = null;
                    document.querySelectorAll('.prompt-item').forEach(item => item.classList.remove('selected'));
                }
            });
        });
    }
    
    createMatch(questionId, promptText, answerText) {
        let currentMatches = this.userAnswers.get(questionId) || {};
        currentMatches[promptText] = answerText;
        this.userAnswers.set(questionId, currentMatches);
        this.updateNavigationPanel();
        this.updateExamInfo();
    }
    
    updateMatchingDisplay(question) {
        const savedMatches = this.userAnswers.get(question.id) || {};
        
        // Update match indicators
        document.querySelectorAll('.prompt-item').forEach(promptItem => {
            const promptText = promptItem.dataset.promptText;
            const matchIndicator = promptItem.querySelector('.match-indicator');
            if (savedMatches[promptText]) {
                matchIndicator.textContent = '→ ' + savedMatches[promptText];
                promptItem.classList.add('matched');
            } else {
                matchIndicator.textContent = '';
                promptItem.classList.remove('matched');
            }
        });
        
        // Update answer items to show if they're used
        document.querySelectorAll('.answer-item').forEach(answerItem => {
            const answerText = answerItem.dataset.answerText;
            const isUsed = Object.values(savedMatches).includes(answerText);
            if (isUsed) {
                answerItem.classList.add('used');
            } else {
                answerItem.classList.remove('used');
            }
        });
    }
    
    clearAllMatches(questionId) {
        this.userAnswers.set(questionId, {});
        const question = this.examQuestions.find(q => q.id === questionId);
        if (question) {
            this.updateMatchingDisplay(question);
        }
        this.updateNavigationPanel();
        this.updateExamInfo();
    }

    selectMatchingItem(type, index) {
        // Legacy function - kept for compatibility but functionality moved to addMatchingEventListeners
        console.log(`Selected ${type} ${index}`);
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.updateQuestionDisplay();
            this.updateNavigationPanel();
            this.updateExamInfo();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.examQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.updateQuestionDisplay();
            this.updateNavigationPanel();
            this.updateExamInfo();
        } else {
            this.showReviewScreen();
        }
    }
    
    goToQuestion(index) {
        this.currentQuestionIndex = index;
        this.showQuestionScreen();
    }
    
    updateNavigationPanel() {
        const grid = document.getElementById('question-grid');
        grid.innerHTML = '';
        
        this.examQuestions.forEach((question, index) => {
            const button = document.createElement('button');
            button.className = 'question-nav-btn';
            button.textContent = index + 1;
            button.onclick = () => this.goToQuestion(index);
            
            if (index === this.currentQuestionIndex) {
                button.classList.add('current');
            }
            
            if (this.userAnswers.has(question.id)) {
                button.classList.add('answered');
            }
            
            grid.appendChild(button);
        });
    }
    
    updateReviewDisplay() {
        const answeredCount = this.userAnswers.size;
        const remainingCount = this.examQuestions.length - answeredCount;
        
        document.getElementById('answered-count').textContent = answeredCount;
        document.getElementById('remaining-count').textContent = remainingCount;
        
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        document.getElementById('time-remaining').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = '';
        
        this.examQuestions.forEach((question, index) => {
            const item = document.createElement('div');
            item.className = 'review-item';
            
            if (!this.userAnswers.has(question.id)) {
                item.classList.add('unanswered');
            }
            
            const userAnswer = this.userAnswers.get(question.id);
            let userAnswerText = 'No answer';
            
            if (userAnswer) {
                try {
                    switch (question.type) {
                        case 'single-choice':
                        case 'multiple-choice':
                            if (Array.isArray(userAnswer) && question.options) {
                                userAnswerText = userAnswer.map(index => {
                                    return question.options[index] || `Option ${index}`;
                                }).join(', ');
                            }
                            break;
                        case 'fill-blank':
                            userAnswerText = Array.isArray(userAnswer) ? (userAnswer[0] || 'No answer') : userAnswer;
                            break;
                        case 'matching':
                            if (typeof userAnswer === 'object') {
                                userAnswerText = Object.entries(userAnswer).map(([k, v]) => `${k}: ${v}`).join('; ') || 'No matches';
                            }
                            break;
                    }
                } catch (error) {
                    userAnswerText = 'Error processing answer';
                }
            }
            
            const questionPreview = question.question ? question.question.replace(/```[\s\S]*?```/g, '[Code Block]').substring(0, 80) : 'Question text unavailable';
            
            item.innerHTML = `
                <div class="review-item-header">
                    <strong>Question ${index + 1} (${this.formatQuestionType(question.type)}) - ${question.points} pt${question.points !== 1 ? 's' : ''}</strong>
                    <span class="answer-status ${this.userAnswers.has(question.id) ? 'answered' : 'unanswered'}">${this.userAnswers.has(question.id) ? '✓ Answered' : '⚠ Not answered'}</span>
                </div>
                <p class="question-preview">${questionPreview}${question.question && question.question.length > 80 ? '...' : ''}</p>
                <div class="user-answer-preview">
                    <strong>Your answer:</strong> <span class="answer-text">${userAnswerText}</span>
                </div>
                <div class="explanation-preview">
                    <strong>Explanation:</strong> <span class="explanation-text">${question.explanation || 'No explanation available.'}</span>
                </div>
                <div class="review-actions">
                    <button class="btn-mini" onclick="event.stopPropagation(); exam.goToQuestion(${index})">Edit Answer</button>
                    <button class="btn-mini" onclick="event.stopPropagation(); exam.showExplanationModal('${(question.question || '').replace(/'/g, "\\'")}', '${(question.explanation || 'No explanation available.').replace(/'/g, "\\'")}')">View Full Explanation</button>
                </div>
            `;
            
            item.onclick = () => this.goToQuestion(index);
            reviewList.appendChild(item);
        });
    }
    
    submitExam() {
        this.examEndTime = new Date();
        clearInterval(this.timerInterval);
        
        const unansweredCount = this.examQuestions.length - this.userAnswers.size;
        let message = 'Are you sure you want to submit your exam? You cannot change your answers after submission.';
        
        if (unansweredCount > 0) {
            message += `\n\nNote: You have ${unansweredCount} unanswered question${unansweredCount !== 1 ? 's' : ''}.`;
        }
        
        this.showModal('Submit Exam', message, () => {
            this.showResultsScreen();
        });
    }
    
    calculateCurrentScore() {
        let totalPoints = 0;
        let earnedPoints = 0;
        
        this.examQuestions.forEach(question => {
            totalPoints += question.points;
            
            const userAnswer = this.userAnswers.get(question.id);
            if (userAnswer && this.isAnswerCorrect(question, userAnswer)) {
                earnedPoints += question.points;
            }
        });
        
        return { points: earnedPoints, total: totalPoints, percentage: Math.round((earnedPoints / totalPoints) * 100) };
    }
    
    isAnswerCorrect(question, userAnswer) {
        try {
            switch (question.type) {
                case 'single-choice':
                case 'multiple-choice':
                    if (!userAnswer || !Array.isArray(userAnswer) || userAnswer.length === 0) {
                        return false;
                    }
                    if (!question.correctAnswers || !Array.isArray(question.correctAnswers)) {
                        console.error('Invalid question structure for question:', question.id);
                        return false;
                    }
                    const correctAnswers = [...question.correctAnswers].sort((a, b) => a - b);
                    const userAnswers = [...userAnswer].sort((a, b) => a - b);
                    return JSON.stringify(correctAnswers) === JSON.stringify(userAnswers);
                
                case 'fill-blank':
                    if (!userAnswer || !Array.isArray(userAnswer) || userAnswer.length === 0) {
                        return false;
                    }
                    const userAnswerText = userAnswer[0];
                    if (typeof userAnswerText !== 'string' || !question.correctAnswer) {
                        return false;
                    }
                    return userAnswerText.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
                
                case 'matching':
                    if (!userAnswer || typeof userAnswer !== 'object' || !question.correctMatches) {
                        return false;
                    }
                    const correctMatches = question.correctMatches;
                    
                    // Check if all correct matches are present and correct
                    for (const [prompt, correctAnswer] of Object.entries(correctMatches)) {
                        if (!userAnswer[prompt] || userAnswer[prompt] !== correctAnswer) {
                            return false;
                        }
                    }
                    
                    // Check if there are any extra incorrect matches
                    for (const [prompt, userAnswerValue] of Object.entries(userAnswer)) {
                        if (!correctMatches[prompt] || correctMatches[prompt] !== userAnswerValue) {
                            return false;
                        }
                    }
                    
                    return true;
                
                default:
                    console.error('Unknown question type:', question.type);
                    return false;
            }
        } catch (error) {
            console.error('Error checking answer for question:', question.id, error);
            return false;
        }
    }
    
    updateResultsDisplay() {
        const score = this.calculateCurrentScore();
        
        // Update score display with error checking
        const finalPercentageElement = document.getElementById('final-percentage');
        const finalFractionElement = document.getElementById('final-fraction');
        const gradeElement = document.getElementById('final-grade');
        
        if (finalPercentageElement) finalPercentageElement.textContent = `${score.percentage}%`;
        if (finalFractionElement) finalFractionElement.textContent = `${score.points}/${score.total}`;
        
        const grade = this.calculateGrade(score.percentage);
        if (gradeElement) {
            gradeElement.textContent = grade;
            gradeElement.className = `grade ${grade}`;
        }
        
        // Update results list
        const resultsList = document.getElementById('results-list');
        if (!resultsList) {
            console.error('Results list element not found');
            return;
        }
        
        resultsList.innerHTML = '';
        
        this.examQuestions.forEach((question, index) => {
            const userAnswer = this.userAnswers.get(question.id);
            const isCorrect = userAnswer && this.isAnswerCorrect(question, userAnswer);
            
            const item = document.createElement('div');
            item.className = `result-item ${isCorrect ? 'correct' : 'incorrect'}`;
            
            // Get user answer display text
            let userAnswerText = 'No answer';
            let correctAnswerText = 'N/A';
            
            try {
                if (userAnswer) {
                    switch (question.type) {
                        case 'single-choice':
                        case 'multiple-choice':
                            if (Array.isArray(userAnswer) && question.options) {
                                userAnswerText = userAnswer.map(index => {
                                    return question.options[index] || `Option ${index}`;
                                }).join(', ');
                            }
                            if (question.correctAnswers && question.options) {
                                correctAnswerText = question.correctAnswers.map(index => {
                                    return question.options[index] || `Option ${index}`;
                                }).join(', ');
                            }
                            break;
                        case 'fill-blank':
                            userAnswerText = Array.isArray(userAnswer) ? (userAnswer[0] || 'No answer') : userAnswer;
                            correctAnswerText = question.correctAnswer || 'N/A';
                            break;
                        case 'matching':
                            if (typeof userAnswer === 'object') {
                                userAnswerText = Object.entries(userAnswer).map(([k, v]) => `${k}: ${v}`).join('; ') || 'No matches';
                            }
                            if (question.correctMatches) {
                                correctAnswerText = Object.entries(question.correctMatches).map(([k, v]) => `${k}: ${v}`).join('; ');
                            }
                            break;
                    }
                } else {
                    // Show correct answer even if user didn't answer
                    switch (question.type) {
                        case 'single-choice':
                        case 'multiple-choice':
                            if (question.correctAnswers && question.options) {
                                correctAnswerText = question.correctAnswers.map(index => {
                                    return question.options[index] || `Option ${index}`;
                                }).join(', ');
                            }
                            break;
                        case 'fill-blank':
                            correctAnswerText = question.correctAnswer || 'N/A';
                            break;
                        case 'matching':
                            if (question.correctMatches) {
                                correctAnswerText = Object.entries(question.correctMatches).map(([k, v]) => `${k}: ${v}`).join('; ');
                            }
                            break;
                    }
                }
            } catch (error) {
                console.error('Error processing answer for question', question.id, error);
                userAnswerText = 'Error processing answer';
                correctAnswerText = 'Error processing correct answer';
            }
            
            const questionPreview = question.question ? question.question.substring(0, 80) : 'Question text unavailable';
            
            item.innerHTML = `
                <div class="result-details">
                    <div class="result-header">
                        <strong>Question ${index + 1} (${this.formatQuestionType(question.type)}) - ${question.points} pt${question.points !== 1 ? 's' : ''}</strong>
                        <span class="result-status ${isCorrect ? 'correct' : 'incorrect'}" style="font-size: 1.2em;">
                            ${isCorrect ? '✓' : '✗'} ${isCorrect ? question.points : 0}/${question.points} pts
                        </span>
                    </div>
                    <p class="question-preview"><strong>Question:</strong> ${questionPreview}${question.question && question.question.length > 80 ? '...' : ''}</p>
                    <div class="answer-comparison">
                        <div class="user-answer">
                            <strong>Your answer:</strong> <span class="${isCorrect ? 'correct-answer' : 'incorrect-answer'}">${userAnswerText}</span>
                        </div>
                        ${!isCorrect ? `<div class="correct-answer-display"><strong>Correct answer:</strong> <span class="correct-answer">${correctAnswerText}</span></div>` : ''}
                    </div>
                    <div class="explanation-section">
                        <strong>Explanation:</strong> 
                        <div class="explanation-text">${question.explanation || 'No explanation available.'}</div>
                    </div>
                </div>
            `;
            
            // Add click to show explanation
            item.onclick = () => {
                const explanation = question.explanation || 'No explanation available.';
                this.showModal('Question Explanation', `${question.question || 'Question text unavailable'}\n\nExplanation: ${explanation}`, null);
            };
            
            item.style.cursor = 'pointer';
            item.title = 'Click to see explanation';
            
            resultsList.appendChild(item);
        });
        
        // Topic analysis
        this.updateTopicAnalysis();
    }
    
    updateTopicAnalysis() {
        const topics = {
            'OOP Concepts': [16, 29, 30, 44, 53],
            'Inheritance': [2, 3, 15, 21, 23, 25],
            'Interfaces': [1, 8, 24],
            'Exception Handling': [9, 12],
            'String Operations': [10, 11, 27],
            'Arrays & Collections': [13, 26, 28, 57],
            'Data Types & Variables': [17, 60],
            'Control Structures': [18],
            'UML & System Design': [31, 32, 45, 50, 51, 58],
            'SDLC & Methodologies': [48, 49, 54, 59],
            'Java Memory Management': [52, 55],
            'Design Patterns': [56]
        };
        
        const analysisContainer = document.getElementById('topic-analysis');
        analysisContainer.innerHTML = '';
        
        Object.entries(topics).forEach(([topicName, questionIds]) => {
            const topicQuestions = this.examQuestions.filter(q => questionIds.includes(q.id));
            if (topicQuestions.length === 0) return;
            
            let correctCount = 0;
            topicQuestions.forEach(question => {
                const userAnswer = this.userAnswers.get(question.id);
                if (userAnswer && this.isAnswerCorrect(question, userAnswer)) {
                    correctCount++;
                }
            });
            
            const percentage = Math.round((correctCount / topicQuestions.length) * 100);
            
            const topicItem = document.createElement('div');
            topicItem.className = 'topic-item';
            topicItem.innerHTML = `
                <span>${topicName}</span>
                <span class="topic-score">${correctCount}/${topicQuestions.length} (${percentage}%)</span>
            `;
            
            analysisContainer.appendChild(topicItem);
        });
    }
    
    calculateGrade(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    }
    
    restartExam() {
        this.showModal('Restart Exam', 'Are you sure you want to restart the exam? All your answers will be lost.', () => {
            this.showStartScreen();
        });
    }
    
    exportResults() {
        const score = this.calculateCurrentScore();
        const timeTaken = this.examEndTime - this.examStartTime;
        const minutes = Math.floor(timeTaken / 1000 / 60);
        const seconds = Math.floor((timeTaken / 1000) % 60);
        
        const results = {
            examType: 'Java Programming TCA',
            examDate: this.examStartTime.toISOString(),
            timeTaken: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            score: score,
            grade: this.calculateGrade(score.percentage),
            questions: this.examQuestions.map((question, index) => {
                const userAnswer = this.userAnswers.get(question.id);
                const isCorrect = userAnswer && this.isAnswerCorrect(question, userAnswer);
                
                return {
                    questionNumber: index + 1,
                    type: question.type,
                    question: question.question,
                    userAnswer: userAnswer,
                    correctAnswer: question.correctAnswers || question.correctAnswer || question.correctMatches,
                    isCorrect: isCorrect,
                    points: isCorrect ? question.points : 0,
                    maxPoints: question.points,
                    explanation: question.explanation
                };
            })
        };
        
        // Download as JSON
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `java-tca-exam-results-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    showModal(title, message, confirmCallback) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        
        if (!modal || !modalTitle || !modalMessage) {
            console.error('Modal elements not found');
            return;
        }
        
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.add('active');
        
        this.modalConfirmCallback = confirmCallback;
    }
    
    hideModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.modalConfirmCallback = null;
    }
    
    confirmModalAction() {
        if (this.modalConfirmCallback) {
            this.modalConfirmCallback();
        }
        this.hideModal();
    }

    showExplanationModal(questionText, explanation) {
        this.showModal('Question Explanation', `${questionText}\n\nExplanation: ${explanation}`, null);
    }
}

// Initialize the exam application
let exam;

document.addEventListener('DOMContentLoaded', () => {
    exam = new JavaExam();
});

// Prevent accidental page refresh during exam
window.addEventListener('beforeunload', (event) => {
    if (exam && exam.examStartTime && !exam.examEndTime) {
        event.preventDefault();
        event.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
        return event.returnValue;
    }
});

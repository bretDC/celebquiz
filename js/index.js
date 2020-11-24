// Template Generate Function
// Generates start screen HTML

function generateStartScreenHtml() {
    return `
      <div class="start-screen">
        <p>This quiz will test your celebrity knowelege.</p>
        <div class="instructions">
            <h3>Instructions:</h3>
            <ul class="instruction-list">
              <li>You will be prompted with 5 questions</li>
              <li>Questions must be answered to complete the quiz</li>
              <li>You will be given 4 different answers to choose from, select the correct answer then hit submit</li>
            </ul>
        </div>
        <button type="button" id="start">Let's Start</button>
      </div>
    `;
  }
  // Generates question number and score page

  function generateQuestionNumberAndScoreHtml() {
    return `
      <ul class="question-and-score">
        <li id="question-number">
          Question Number: ${STORE.currentQuestion + 1}/${STORE.questions.length}
        </li>
        <li id="score">
          Score: ${STORE.score}/${STORE.questions.length}
        </li>
      </ul>
    `;
  }
 // Generates
  function generateAnswersHtml() {
    const answersArray = STORE.questions[STORE.currentQuestion].answers
    let answersHtml = '';
    let i = 0;
  
    answersArray.forEach(answer => {
      answersHtml += `
        <div id="option-container-${i}">
          <input type="radio" name="options" id="option${i + 1}" value= "${answer}" answer-option ="${i + 1}" required> 
          <label for="option${i + 1}"> ${answer}</label>
        </div>
      `;
      i++;
    });
    return answersHtml;
  }
 // Generates page for single question 
  function generateQuestionHtml() {
    let currentQuestion = STORE.questions[STORE.currentQuestion];
    return `
      <form id="question-form" class="question-form">
        <fieldset>
          <div class="question">
            <panel> ${currentQuestion.question}</panel>
          </div>
          <div class="options">
            <div class="answers">
              ${generateAnswersHtml()}
            </div>
          </div>
          <button type="submit" id="submit-answer-btn" answer-option="5">Submit</button>
      
        </fieldset>
      </form >
    `;
  }
  
  // Generates results HTML
  function generateResultsScreen() {
    return `
      <div class="results">
        <form id="js-restart-quiz">
          <fieldset>
            <div class="row">
              <div class="col-12">
                <panel>Your Score is: ${STORE.score}/${STORE.questions.length}</panel>
              </div>
            </div>
          
            <div class="row">
              <div class="col-12">
                <button type="button" id="restart"> Restart Quiz </button>
              </div>
            </div>
          </fieldset>
      </form>
      </div>
    `;
  }
// Generates correct/incorrect HTML
  function generateResultHTML(answerStatus) {
    let correctAnswer = STORE.questions[STORE.currentQuestion].correctAnswer;
    let pageHtml = '';
    if (answerStatus === 'correct') {
      pageHtml = `
      
      <div class="right-answer">✅Correct</div>
      <button type="button" id="next-question-btn" answer-option="6">Continue</button>
      `;
    }
    else if (answerStatus === 'incorrect') {
      pageHtml = `
        <div class="wrong-answer">❌Incorrect. The answer is ${correctAnswer}.</div>
        <button type="button" id="next-question-btn" answer-option="6">Continue</button>
      `;
    }
    return pageHtml;
  }
  
// Render Function
  

  function render() {
    let pageHtml = '';
  
    if (STORE.quizStarted === false) {
      $('main').html(generateStartScreenHtml());
      return;
    }
    else if (STORE.currentQuestion >= 0 && STORE.currentQuestion < STORE.questions.length) {
      pageHtml = generateQuestionNumberAndScoreHtml();
      pageHtml += generateQuestionHtml();
      $('main').html(pageHtml);
    }
    else {
      $('main').html(generateResultsScreen());
    }
  }
  
// Event  handler Function
// Handles click of start button
  function handleStartClick() {
    $('main').on('click', '#start', function (event) {
      STORE.quizStarted = true;
      render();
    });
  }
  
// Handles click of next question button
  function handleNextQuestionClick() {
    $('body').on('click', '#next-question-btn', (event) => {
      render();
    });
  }
// handles question submit form
  function handleQuestionFormSubmission() {
    $('body').on('submit', '#question-form', function (event) {
      event.preventDefault();
      const currentQuestion = STORE.questions[STORE.currentQuestion];
  
      // get value from checkbox checked by user
      let selectedOption = $('input[name=options]:checked').val();
  
      // created option-container id with the index of the current question
      let optionContainer = `#option-container-${currentQuestion.answers.findIndex(i => i === selectedOption)}`;
  
      if (selectedOption === currentQuestion.correctAnswer) {
        STORE.score++;
        $(optionContainer).append(generateResultHTML('correct'));
      }
      else {
        $(optionContainer).append(generateResultHTML('incorrect'));
      }
      STORE.currentQuestion++;
      // hide the submit button
      $('#submit-answer-btn').hide();
      // disable all inputs
      $('input[type=radio]').each(() => {
        $('input[type=radio]').attr('disabled', true);
      });
      // show the next button
      $('#next-question-btn').show();
  
    });
  }
// Function to restart the quiz
  function restartQuiz() {
    STORE.quizStarted = false;
    STORE.currentQuestion = 0;
    STORE.score = 0;
  }
  
  function handleRestartButtonClick() {
    $('body').on('click', '#restart', () => {
      restartQuiz();
      render();
    });
  }
  
  function handleQuizApp() {
    render();
    handleStartClick();
    handleNextQuestionClick();
    handleQuestionFormSubmission();
    handleRestartButtonClick();
  }
  
  $(handleQuizApp);
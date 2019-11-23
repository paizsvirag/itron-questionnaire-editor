'use strict';

function reload() {

const http = new XMLHttpRequest();
http.open("GET", "http://localhost:3000/questions", true);
http.setRequestHeader('Content-Type', 'application/json');
http.onload = () => {
  const res = JSON.parse(http.responseText);
  const questionsWrapper = document.querySelector('.questions-wrapper');
  const newQuestionSection = document.querySelector('.new-questions-wrapper');
  const addingQandA = newQuestionSection.appendChild(document.createElement('button'));
  const modal = document.querySelector('.edit-modal');
  const modalContent = document.querySelector('.modal-content');
  const modalWrapper = modalContent.appendChild(document.createElement('div'));
  const modalQuestionInput = modalWrapper.appendChild(document.createElement('input'));
  const modalAnswerInput =  modalWrapper.appendChild(document.createElement('input'));
  const buttonWrapper = modalContent.appendChild(document.createElement('div'));
  const closeBtn = buttonWrapper.appendChild(document.createElement('button'));
  const submitEditButton = buttonWrapper.appendChild(document.createElement('button'));
  modalAnswerInput.className = 'modal-answer-input';
  modalQuestionInput.className = 'modal-question-input';
  buttonWrapper.className = 'modal-button-wrapper';
  closeBtn.className = 'modal-close-btn';
  submitEditButton.className = 'modal-submit-button';
  addingQandA.className = 'adding-btn';
  closeBtn.innerHTML = 'Close';
  submitEditButton.innerHTML = 'Save';
  addingQandA.innerHTML = 'Add new question';

  closeBtn.addEventListener('click', function() {
    modal.style.display = "none";
  })

  addingQandA.addEventListener('click', function() {
    const addingQuestionFormWrapper = newQuestionSection.appendChild(document.createElement('div'));
    const newQuestionForm = addingQuestionFormWrapper.appendChild(document.createElement('form'));
    const questionInput = newQuestionForm.appendChild(document.createElement('input'));
    const answerInput = newQuestionForm.appendChild(document.createElement('input'));
    const submitButton = newQuestionForm.appendChild(document.createElement('button'));
    addingQuestionFormWrapper.className='form-wrapper';
    questionInput.className = "question-input";
    answerInput.className = "answer-input";
    submitButton.className = "submit-btn";
    submitButton.innerHTML = "Submit";
    
    submitButton.addEventListener('click', function() {
      let newId = res[res.length-1].id+1;
      const submitting = new XMLHttpRequest();
      submitting.open("POST", "http://localhost:3000/create-questions", true);
      submitting.setRequestHeader('Content-Type', 'application/json');
      submitting.send(JSON.stringify({
        id: newId,
        question: `${questionInput.value}`,
        answer: `${answerInput.value}`,
        creationDate: Date.now()
      }));
      location.reload();
    })
  })

  res.forEach(element => {
    const questionCard = questionsWrapper.appendChild(document.createElement('div'));
    const questionWrapper = questionCard.appendChild(document.createElement('div'));
    const answerWrapper =questionCard.appendChild(document.createElement('div'));
    const actualQuestion = questionWrapper.appendChild(document.createElement('p'));
    const actualAnswer = answerWrapper.appendChild(document.createElement('p'));
    const date = questionCard.appendChild(document.createElement('p'));
    const optionsOnQuestions = questionWrapper.appendChild(document.createElement('div'));
    const editButton = optionsOnQuestions.appendChild(document.createElement('button'));
    const deleteButton = optionsOnQuestions.appendChild(document.createElement('button'));
    questionCard.className = 'question-card';
    questionWrapper.className = 'question-wrapper';
    answerWrapper.className = 'answer-wrapper';
    actualQuestion.className = 'actual-question';
    actualAnswer.className = 'actual-answer';
    optionsOnQuestions.className = 'options';
    editButton.className = 'edit-btn';
    deleteButton.className = 'delete-btn';
    date.className = 'date';
    actualQuestion.innerHTML = element.question;
    actualAnswer.innerHTML = element.answer;
    date.innerHTML = new Date(element.creationDate);
    editButton.innerHTML = 'Edit';
    deleteButton.innerHTML = 'Delete';

    deleteButton.addEventListener('click', function() {
      if(confirm("Are you sure you want to delete the question?")) {
        const deleting = new XMLHttpRequest();
        deleting.open("DELETE", `http://localhost:3000/questions/${element.id}`, true);
        deleting.setRequestHeader('Content-Type', 'application/json');
        deleting.send();
        location.reload();
      }
    });
   
    editButton.addEventListener('click', function() {
      modal.style.display = "block";
      submitEditButton.addEventListener('click', function () {
        const editing = new XMLHttpRequest();
        editing.open("PUT", `http://localhost:3000/questions/${element.id}`, true);
        editing.setRequestHeader('Content-Type', 'application/json');
        editing.send(
          JSON.stringify({
            question: modalQuestionInput.value,
            answer: modalAnswerInput.value
          })
        );
        location.reload();
      })
    })
    });
}


http.send();
};

reload();

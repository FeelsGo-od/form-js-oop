let formAnswersContainer = document.querySelector('.form-answers');
let prevPageBtn = document.getElementById('page-previous');
let nextPageBtn = document.getElementById('page-next');
let pages = [];
let currentPage = 0;
let progressBarDone = document.querySelector('.progress-bar .done');
let userAnswers = new Map();
let activeAnswers = [];
let formSubmit = document.querySelector('.form-submit');
let receivedData = [];

function barWidthHandle() {
  if (currentPage === 0) {
    progressBarDone.style.width = `0px`;
  } else {
    let width = (100 / pages.length) * (currentPage + 1);
    progressBarDone.style.width = `${width}%`;
  }
}

class Page {
  constructor(title, { ...answers }) {
    this.title = title;
    this.answers = answers;
  }
}

function createNewPage(title, { ...answers }) {
  let newPage = new Page(title, { ...answers });
  pages.push(newPage);
  barWidthHandle();

  return newPage;
}

createNewPage('first page', {
  A: 'Tax Filing',
  B: 'Audit',
  C: 'Bookkeeping',
  D: 'Back Tax / IRS Problems',
  E: 'Consultation',
  F: 'Forensic Accounting',
  G: 'CFO Services',
  H: 'Other',
});
createNewPage('second page', { B: 'Audit 2' });
createNewPage('third page', { C: 'Bookkeeping 3' });

function handlePages() {
  checkPageExistens();

  formSubmit.addEventListener('click', (e) => {
    receiveAllData();
    checkPageExistens();
    pageNext();
    barWidthHandle();
    handleAnswers(currentPage);
    e.preventDefault();
  });

  nextPageBtn.addEventListener('click', () => {
    checkPageExistens();
    pageNext();
    barWidthHandle();
    handleAnswers(currentPage);
  });

  prevPageBtn.addEventListener('click', () => {
    checkPageExistens();
    pagePrev();
    barWidthHandle();
    handleAnswers(currentPage);
  });

  handleAnswers(currentPage);
}

function checkPageExistens() {
  if (pages[currentPage + 1] !== undefined) {
    nextPageBtn.classList.add('active');
  } else {
    nextPageBtn.classList.remove('active');
  }

  if (pages[currentPage - 1] !== undefined) {
    prevPageBtn.classList.add('active');
  } else {
    prevPageBtn.classList.remove('active');
  }
}

function pageNext() {
  if (nextPageBtn.classList.contains('active')) {
    currentPage++;
  }
}

function pagePrev() {
  if (prevPageBtn.classList.contains('active')) {
    currentPage--;
  }
}

function handleAnswers(currentPage) {
  formAnswersContainer.textContent = '';
  checkPageExistens();
  let currentPageAnswers = pages[currentPage]['answers'];
  for (key in currentPageAnswers) {
    createAnswer(key, currentPageAnswers[key]);
  }

  answerOnClick();
}

function createAnswer(key, value) {
  let label = document.createElement('label');
  let answerInput = document.createElement('input');
  let answerKey = document.createElement('span');

  answerInput.type = 'checkbox';
  answerInput.name = `option${key}`;

  answerKey.innerHTML = key;

  label.appendChild(answerKey);
  label.innerHTML += ` ${value}`;
  formAnswersContainer.appendChild(label);

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (localStorage.getItem(key) === label.textContent) {
      label.classList.add('active');
    }
  }
}

function answerOnClick() {
  let answers = document.querySelectorAll('.form-answers label');
  answers.forEach((e) => {
    e.addEventListener('click', function () {
      e.classList.toggle('active');

      if (e.classList.contains('active')) {
        userAnswers.set(e.firstChild.textContent, e.textContent);

        localStoreAnswers(e.firstChild.textContent);
      } else {
        userAnswers.delete(e.firstChild.textContent);

        localStoreAnswers(e.firstChild.textContent);
      }
    });
  });
}

function localStoreAnswers(key) {
  if (userAnswers.has(key)) {
    localStorage.setItem(
      `Page ${currentPage + 1} - ${key}`,
      userAnswers.get(key)
    );
  } else {
    localStorage.removeItem(`Page ${currentPage + 1} - ${key}`);
  }
}

function receiveAllData() {
  if (currentPage + 1 === pages.length) {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      console.log(`Data: ${localStorage.getItem(key)}`);
      receivedData.push(` Data: ${localStorage.getItem(key)}`);

      // for presentation
      document.querySelector('.choosen-answers').innerHTML = receivedData;
    }
  }
}

// console.log(Object.entries(localStorage));

barWidthHandle();
handlePages();

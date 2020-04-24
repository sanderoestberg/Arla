const _questionRef = _db.collection("questions");
const _userRef = _db.collection("users")


let _currentUser;

let _categories;

function loadQuestions() {
    _questionRef.onSnapshot(function(snapshotData) {
        // Tomt array til madvarer
        _categories = [];
        snapshotData.forEach(function(doc) {
          let category = doc.data();
          category.id = doc.id;
          _categories.push(category);
        });
        appendCategories(_categories);
      });
}

function appendCategories(categories) {
    let htmlTemplate = "";
    for (let category of categories) {
      htmlTemplate += `
    <article class="${category.id}" style="grid-area: ${category.grid}">
      <a href="#${category.id}">
          <div class="icon-border">
              <img src="${category.img}" class="question-icon" alt="">
              <p>0/5</p>
          </div>
      </a>
  </article>
      `;
    }
    document.querySelector('.grid-test-wrapper').innerHTML = htmlTemplate;    
}


loadQuestions();



/*
window.inputValue = function (value) {
let htmlTemplate = "";
let inputField = document.querySelector('input')
console.log(value)
if (value > 0) {
inputField.style.border = "3px solid #006C3A";
htmlTemplate += +1;
}
else {
    inputField.style.border = "none";
    htmlTemplate = 0;
}
document.querySelector('#question-number').innerHTML = htmlTemplate;
}
*/




/*
<section id="${category.id}" class="page" style="display:hidden;">
  <div class="grid-icon-wrapper">
  <a href="#catergoriesQ">
      <article class="grid-solo">
          <div class="icon-border">
              <img src="images/cow.svg" class="question-icon" alt="">
              <p><span id="question-number">0</span>/5</p>
          </div>
        </article>
  </a>
</div>
<article class="question-header">
<h1>${category.id}</h1>
<div class="breakline"></div>
</article>
<section class="question-container">
<article class="question">
<div class="number-text"><p><span>1.</span></p><p>${category.Q1}</p></div>
<div class="question-input">
<input type="number" required onchange=inputValue(this.value)><p>cows</p>
</div>
</article>
<article class="question">
<div class="number-text"><p><span>2.</span></p><p>${category.Q2}</p></div>
<div class="question-input">
<input type="number" required onchange=inputValue(this.value)><p>kg</p>
</div>
</article>

</section>
  </section>

*/
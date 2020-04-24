"use strict";

// SPA-SERVICE
import SpaService from "./spa-service.js";
let _spaService = new SpaService("login");
window.pageChange = function () {
    _spaService.pageChange();
}


const _questionRef = _db.collection("questions");
const _userRef = _db.collection("users")

let _categories;
let _currentUser;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) { // if user exists and is authenticated
      userAuthenticated(user);
    } else { // if user is not logged in
      userNotAuthenticated();
    }
  });

  function userNotAuthenticated() {
    _currentUser = null; // reset _currentUser
    _spaService.showPage("login");
    // Firebase UI configuration
    const uiConfig = {
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: '#categories'
    };
    // Init Firebase UI Authentication
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }

  window.logout = function() {
    firebase.auth().signOut();
  }

  function userAuthenticated(user) {
    _currentUser = user;
    updateUser();
    init();
    _spaService.showPage("categories");
  }

  window.updateUser = function() {
    updateUser();
  }
  function updateUser() {
    let user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: document.querySelector('#name').value
    });
    _userRef.doc(_currentUser.uid).set({
      displayName: document.querySelector('#name').value,
    }, {
      merge: true
    });
}  
//----------------------------------------------------------------------------//
function init() {
    _userRef.doc(_currentUser.uid).onSnapshot({
      includeMetadataChanges: true
    }, function(userData) {
      if (!userData.metadata.hasPendingWrites && userData.data()) {
        _currentUser = {
          ...firebase.auth().currentUser,
          ...userData.data()
        };
        
        //loadCategories()
        
      }
    });
    _questionRef.onSnapshot(function(snapshotData) {
        _categories = [];
        snapshotData.forEach(function(doc) {
          let category = doc.data();
          category.id = doc.id;
          _categories.push(category);
        });
        appendQuestions(_categories);
        appendCategories(_categories);
      });
}
//----------------------------------------------------------------------------//

/* function loadCategories() {
    _questionRef.onSnapshot(function(snapshotData) {
        _categories = [];
        snapshotData.forEach(function(doc) {
          let category = doc.data();
          category.id = doc.id;
          _categories.push(category);
        });
        appendQuestions(_categories);
        appendCategories(_categories);
      });
}
*/
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


function appendQuestions(categories) {
    let htmlTemplate = "";
    for (let category of categories) {
      htmlTemplate += `
      <section id="${category.id}" class="page">
      <div class="grid-icon-wrapper">
  <a href="#categories">
      <article class="grid-solo">
          <div class="icon-border">
              <img src="${category.img}" class="question-icon" alt="">
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
      `;
    }
    document.querySelector('#questions').innerHTML = htmlTemplate;   
}

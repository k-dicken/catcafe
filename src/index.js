import { initializeApp } from "firebase/app"
import { getAuth, signInAnonymously, signOut, onAuthStateChanged } from "firebase/auth"
import { getFirestore, setDoc, getDoc, collection, addDoc, getDocs, where, doc, query, deleteDoc } from "firebase/firestore"
import {getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC2sEQIJIDGQ_5jZM3gbe2ShBXtfOZrDco",
    authDomain: "kdicken-fb.firebaseapp.com",
    projectId: "kdicken-fb",
    storageBucket: "kdicken-fb.appspot.com",
    messagingSenderId: "637047845198",
    appId: "1:637047845198:web:d0bcad1853259ca49dee1f",
    measurementId: "G-PKR49KE1CL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

//
//ADMIN
//
const adminpass = "I want to pet a cat."

function connectToStorage() {
  if(localStorage) {
      let passStatus = localStorage.getItem("passStatus")
      if(!passStatus) {
          localStorage.setItem("passStatus", JSON.stringify('f'));
      }
  } else {
      alert("Error: No local storage detected.");
  }
}

function passwordListener() {
    $("#password-submit").on("click", (e) => {
        checkPassword();
    })
}

function checkPassword() {
    let input = $("#password-input").val();
    if (input == adminpass) {
        localStorage.setItem("passStatus", JSON.stringify('t'));
        checkPage();
    } else {
        $("#password-error").addClass("hidden")
        setTimeout(() => {
          $("#password-error").removeClass("hidden")
          $("#password-error").addClass("show")
          $("#password-error").html('Error: Incorrect password. Please try again.')
        }, "1000");
    }
}

function adminListeners() {
  $("#add").on("click", (e) => {
    $("#add-item").removeClass("hidden");
    $("#add-item").addClass("show");
})
  $("#add-close").on("click", (e) => {
    $("#add-item").removeClass("show");
    $("#add-item").addClass("hidden");
})
}

//
//RESERVATION FUNCTIONS
//
//user selects day
//find day in database
//find store hours for day
//for each time :30
//filter database for time that start at time & 30 min or :30 before time & 1 hr
//subtract each success from spots
//delete reservations that are 14 day old

//RESERVATION ADMIN FUNCTIONS

//
//CATS FUNCTIONS
//

async function getCatData() {
  const querySnapshot = await getDocs(collection(db, "cats"));
  console.log("cats");

  querySnapshot.forEach((doc) => {
    let icon = "";

    if(doc.data().gender == "male") {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M289.8 46.8c3.7-9 12.5-14.8 22.2-14.8H424c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-33.4-33.4L321 204.2c19.5 28.4 31 62.7 31 99.8c0 97.2-78.8 176-176 176S0 401.2 0 304s78.8-176 176-176c37 0 71.4 11.4 99.8 31l52.6-52.6L295 73c-6.9-6.9-8.9-17.2-5.2-26.2zM400 80l0 0h0v0zM176 416a112 112 0 1 0 0-224 112 112 0 1 0 0 224z"/></svg>`
    } else if(doc.data().gender == "female") {
      icon = `<svg
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      width="12"
      viewBox="0 0 384 512"
    >
      <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
      <path
        d="M80 176a112 112 0 1 1 224 0A112 112 0 1 1 80 176zM224 349.1c81.9-15 144-86.8 144-173.1C368 78.8 289.2 0 192 0S16 78.8 16 176c0 86.3 62.1 158.1 144 173.1V384H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H224V349.1z"
      />
    </svg>`
    } else {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>`
    }

      let item =  `<div class="cat-item">
      <div
        class="cat-item-top image"
        style="background-image: url('${doc.data().img}')"
        alt=""
      >
      <div class="cat-title">
        <div class="${doc.data().gender} gender-icon">
          ${icon}
        </div>
          <h3>${doc.data().name}</h3>
          <p>${doc.data().age} years</p>
        </div>
      </div>
      <div class="cat-item-bottom">
        <p>
        ${doc.data().desc}
        </p>
      </div>
    </div>`
    
    console.log(item)

    $('#cats-items').append(item);
  })
}

//
//CATS ADMIN
//
async function uploadImage(location, sendCallback) {
  let file = $("#" + location + "-img").get(0).files[0];
  let filename = +new Date() + "-" + file.name;
  console.log(filename);
  let metadata = {contentType: file.type};
  console.log(metadata);
  let pathRef = ref(storage, "images/" + filename);
  const storageRef = ref(storage, pathRef);

 uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("upima", downloadURL);
          sendCallback(downloadURL, location);
      })
  })

}

async function addCatData(image) {
  let name = $("#add-name")[0].value;
  let age = $("#add-age")[0].value; 
  let gender = $("#add-gender")[0].value;
  let img = image;
  let desc = $("#add-desc")[0].value;

  console.log("add", img)

  console.log("add everything", name, age, img, gender, desc)

  //how do i get it to wait for uploadImage to run

  await addDoc(collection(db, "cats"), {
    name: name,
    age: age,
    img: img,
    gender: gender,
    desc: desc
  });

  resetAdminCatMenu();
}

window.addCat = function(e) {
  console.log($("#add-img").get(0).files[0])
  if($("#add-img").get(0).files[0]) {
    uploadImage("add", addCatData);
  } else {
    addCatData("");
  }
}

async function getAdminCatData() {
  const querySnapshot = await getDocs(collection(db, "cats"));
  console.log("cats");

  querySnapshot.forEach((doc) => {
    let male, female = "";

    switch (doc.data().gender) {
      case 'female':
        female = "selected";
        break;
  
      case 'male':
        male = "selected";
      break;
    
      default:
        break;
    }

    console.log("id", doc.id);

      let item =  `        
      <div id="${doc.id}" class="admin-item row">
      <div class="admin-inputs">
        <div class="row-top row">
        <div class="input-name flex-column">
          <label for="name">Cat Name</label>
          <input id="${doc.id}-name" name="name" type="text" value="${doc.data().name}">
        </div>
        <div class="input-age flex-column">
          <label for="age">Age (years)</label>
          <input id="${doc.id}-age" name="age" type="number" placeholder="Years" value="${doc.data().age}">
        </div>
      </div>
      <div class="row-bottom row">
        <div class="input-img flex-column">
          <label for="img">Select Image</label>
          <input type="file" id="${doc.id}-img" name="img" accept="image/*" value="${doc.data().img}">
        </div>
        <div class="input-dropdown flex-column">
          <label for="gender">Gender</label>
          <select id="${doc.id}-gender" name="gender">
            <option value="male" ${male}>Male</option>
            <option value="female" ${female}>Female</option>
          </select>
        </div>
      </div>
      <div class="desc-input flex-column">
        <label for="desc">Description</label>
        <textarea id="${doc.id}-desc" name="desc" class="input-desc" type="text">${doc.data().desc}</textarea>
      </div>
      </div>
      <div class="admin-buttons">
        <input class="button button-main" type="submit" value="Update" onclick="updateCatItem('${doc.id}')">
        <button class="delete-menu icon" onclick="deleteCatItem('${doc.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>
    </div>`
    
    // console.log(item)

    $('#admin-cats-items').append(item);
  })
}

// Update cat item listener
window.updateCatItem = function(e) {
  console.log(e);
  console.log($("#" + e + "-img")[0].defaultValue);
  if($("#" + e + "-img").get(0).files[0]) {
    uploadImage(e, updateCatItemData);
  } else {
    console.log($("#" + e + "-img")[0].defaultValue)
    updateCatItemData($("#" + e + "-img")[0].defaultValue, e);
  }
}
// Update cat item
async function updateCatItemData(image, e) {
  let name = $("#" + e + "-name")[0].value;
  let age = $("#" + e + "-age")[0].value;
  let gender = $("#" + e + "-gender")[0].value;
  let desc = $("#" + e + "-desc")[0].value;
  let img = image;

  await setDoc(doc(db, "cats", e), {
    name: name,
    age: Number(age),
    img: img,
    gender: gender,
    desc: desc
  });

  resetAdminCatMenu();
}

//Delete cat item listener
window.deleteCatItem = function(e) {
  deleteCatItemData(e);
}
//Delete cat item
async function deleteCatItemData(id) {
  await deleteDoc(doc(db, "cats", id));
  resetAdminCatMenu();
}

function resetAdminCatMenu() {
  $("#admin-cats-items").html(''); 

  $("#add-item").removeClass("show");
  $("#add-item").addClass("hidden");

  getAdminCatData();
}

//
//MENU FUNCTIONS
//
async function getMenuData() {
    const querySnapshot = await getDocs(collection(db, "menu"));
    querySnapshot.forEach((doc) => {
        let item =  `<div class="menu-item">
        <b>${doc.data().name}</b>
        <p>${doc.data().desc}</p>
        <p class="price">$${doc.data().price.toFixed(2)}</p>
      </div>`

      switch (doc.data().category) {
        case 'seasonal':
          $('#seasonal-items').append(item);
          break;

        case 'coffee':
          $('#coffee-items').append(item);
        break;

        case 'latte':
          $('#latte-items').append(item);
          break;

        case 'tea':
          $('#tea-items').append(item);
        break;

        case 'bakery':
          $('#bakery-items').append(item);
        break;
      
        default:
          break;
      }
    })
}

//MENU ADMIN FUNCTIONS
async function getAdminMenuData() {
  const querySnapshot = await getDocs(collection(db, "menu"));
  querySnapshot.forEach((doc) => {
    // if(doc.data().category == seasonal) { return selected }
    let seasonal, coffee, latte, tea, bakery = "";

    switch (doc.data().category) {
      case 'seasonal':
        seasonal = "selected";
        break;

      case 'coffee':
        coffee = "selected";
      break;

      case 'latte':
        latte = "selected";
        break;

      case 'tea':
        tea = "selected";
      break;

      case 'bakery':
        bakery = "selected";
      break;
    
      default:
        break;
    }

      let item =  `<div id="${doc.id}" class="admin-item row">
      <div class="admin-inputs">
        <div class="row">
          <div class="input-name flex-column">
            <label for="name">Item Name</label>
            <input id="${doc.id}-name" name="name" type="text" value="${doc.data().name}">
          </div>
          <div class="input-price flex-column">
            <label for="price">Price</label>
            <input id="${doc.id}-price" name="price" type="number" value="${doc.data().price}">
          </div>
          <div class="input-dropdown flex-column">
            <label for="category">Category</label>
            <select id="${doc.id}-category" name="category" value="${doc.data().category}">
              <option value="seasonal" ${seasonal}>Seasonal</option>
              <option value="coffee" ${coffee}>Coffee</option>
              <option value="latte" ${latte}>Latte</option>
              <option value="tea" ${tea}>Teas</option>
              <option value="bakery" ${bakery}>Bakery</option>
            </select>
          </div>
        </div>
        <label for="desc">Description</label>
        <textarea id="${doc.id}-desc" name="desc" class="input-desc" type="text">${doc.data().desc}</textarea>
      </div>
      <div class="admin-buttons">
        <input class="button button-main" type="submit" value="Update" onclick="updateMenuItem(${doc.id})">
        <button class="delete-menu icon" onclick="deleteMenuItem(${doc.id})"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>
    </div>`

    switch (doc.data().category) {
      case 'seasonal':
        $('#seasonal-items').append(item);
        break;

      case 'coffee':
        $('#coffee-items').append(item);
      break;

      case 'latte':
        $('#latte-items').append(item);
        break;

      case 'tea':
        $('#tea-items').append(item);
      break;

      case 'bakery':
        $('#bakery-items').append(item);
      break;
    
      default:
        break;
    }
  })
}

function resetAdminMenuData() {
    $('#seasonal-items').html('');
    $('#coffee-items').html('');
    $('#latte-items').html('');
    $('#tea-items').html('');
    $('#bakery-items').html('');

    $("#add-name").val("");
    $("#add-price").val("");
    $("#add-desc").val("");
    $("#add-category").val("");

    $("#add-item").removeClass("show");
    $("#add-item").addClass("hidden");

    getAdminMenuData();
}

//Delete menu item listener
window.deleteMenuItem = function(e) {
  deleteMenuItemData(e.id);
}
//Delete menu item
async function deleteMenuItemData(id) {
  await deleteDoc(doc(db, "menu", id));
  resetAdminMenuData();
}

// Update menu item listener
window.updateMenuItem = function(e) {
  let name = $("#" + e.id + "-name")[0].value;
  let price = $("#" + e.id + "-price")[0].value;
  let desc = $("#" + e.id + "-desc")[0].value;
  let category = $("#" + e.id + "-category")[0].value;
  updateMenuItemData(e.id, name, price, desc, category)
}
// Update menu item
async function updateMenuItemData(id, name, price, desc, category) {
  await setDoc(doc(db, "menu", id), {
    name: name,
    price: Number(price),
    desc: desc,
    category: category
  });
  resetAdminMenuData();
}

//Add menu item listener
window.addMenuItem = function(e) {
  let name = $("#add-name")[0].value;
  let price = $("#add-price")[0].value;
  let desc = $("#add-desc")[0].value;
  let category = $("#add-category")[0].value;
  addMenuItemData(name, price, desc, category)
}
// add menu item
async function addMenuItemData(name, price, desc, category) {
  await addDoc(collection(db, "menu"), {
    name: name,
    price: Number(price),
    desc: desc,
    category: category
  });
  resetAdminMenuData();
}

//
//NAV FUNCTIONS
//
function navListeners() {
  $("#nav-open").on("click", (e) => {
    console.log("clcik"); 
    $("#mobile-nav").addClass("show");
    $("#mobile-nav").removeClass("hidden");
    $("#nav-open").addClass("hidden");
    $("#nav-open").removeClass("show");
    $("#nav-close").addClass("show");
    $("#nav-close").removeClass("hidden");
 })
 $("#nav-close").on("click", (e) => {
  console.log("clcik"); 
  $("#mobile-nav").addClass("hidden");
  $("#mobile-nav").removeClass("show");
  $("#nav-open").addClass("show");
  $("#nav-open").removeClass("hidden");
  $("#nav-close").addClass("hidden");
  $("#nav-close").removeClass("show");
})
}

//
//PAGE FUNCTIONS
//
const headerLine = "Merry Christmas! We will be closed 24th & 25th."

function initListeners() {
  navListeners();
  passwordListener();
  adminListeners();
}

function checkPage() {
  let page = window.location.pathname;
  let pageArray = page.split("/");
  pageArray.forEach((p, id) => {
    if(p == '') {
      pageArray.splice(id, 1);
    }
  });
  let anyAdminCheck = true;

  //check if the page is admin
  pageArray.forEach(page => {
    if(page == 'admin') {
      anyAdminCheck = false;
    }
  });

  //if the page is admin, load the content based on the admin page
  if(anyAdminCheck == false) {
    pageArray.forEach(page => {
      if(JSON.parse(localStorage.getItem("passStatus")) != 't') {
        connectToStorage();
      } else if(JSON.parse(localStorage.getItem("passStatus")) == 't') {
        $("#password-section").css("display", "none");
        if(page == 'reservations') {
            $("#content").html(`      <div class="reservations-nav">
            <div class="reservations-nav-day center" data-resday="11-23-2023">
              <p class="small">Mon</p>
              <br>
              <p>Nov</p>
              <b>20</b>
            </div>
            <div class="reservations-nav-day active-day center" data-resday="11-23-2023">
              <p class="small">Mon</p>
              <br>
              <p>Nov</p>
              <b>21</b>
            </div>
            <div class="reservations-nav-day center" data-resday="11-23-2023">
              <p class="small">Mon</p>
              <br>
              <p>Nov</p>
              <b>22</b>
            </div>
            <div class="reservations-nav-day center" data-resday="11-23-2023">
              <p class="small">Mon</p>
              <br>
              <p>Nov</p>
              <b>22</b>
            </div>
            <div class="reservations-nav-day center" data-resday="11-23-2023">
              <p class="small">Mon</p>
              <br>
              <p>Nov</p>
              <b>22</b>
            </div>
            <div class="reservations-nav-day center" data-resday="11-23-2023">
              <p class="small">Mon</p>
              <br>
              <p>Nov</p>
              <b>22</b>
            </div>
          </div>
          <div class="reservations break-out">
            <div class="time row">
              <p>10:00 am</p>
              <div class="bar"></div>
            </div>
            <div class="reservation-block row">
              <div class="reservation-guests">
                <b><span>2</span> Guests</b> 
                <p><span>Name</span>, <span>##</span></p>
                <p><span>Name</span>, <span>##</span></p>
              </div>
              <div class="reservation-info">
                <div class="row">
                  <b class="reservation-name">Reservation Name</b>
                  <div class="reservation-time">
                    <b>10:00 am - 10:30 am</b>
                    <p>30 Minutes</p>
                  </div>
                </div>
                <br>
                <div class="row">
                  <div>
                    <p>Total $21.00</p>
                    <input type="checkbox" name="pay">
                    <label for="pay">Paid?</label>
                  </div>
                  <div class="reservation-contact">
                    <p>email@email.com</p>
                    <p>(317) 599-9653</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="reservation-block row">
              <div class="reservation-guests">
                <b><span>2</span> Guests</b> 
                <p><span>Name</span>, <span>##</span></p>
                <p><span>Name</span>, <span>##</span></p>
              </div>
              <div class="reservation-info">
                <div class="row">
                  <b class="reservation-name">Reservation Name</b>
                  <div class="reservation-time">
                    <b>10:00 am - 10:30 am</b>
                    <p>30 Minutes</p>
                  </div>
                </div>
                <br>
                <div class="row">
                  <div>
                    <p>Total $21.00</p>
                    <input type="checkbox" name="pay">
                    <label for="pay">Paid?</label>
                  </div>
                  <div class="reservation-contact">
                    <p>email@email.com</p>
                    <p>(317) 599-9653</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="time row">
              <p>10:30 am</p>
              <div class="bar"></div>
            </div>
            <div class="reservation-block row">
              <div class="reservation-guests">
                <b><span>2</span> Guests</b> 
                <p><span>Name</span>, <span>##</span></p>
                <p><span>Name</span>, <span>##</span></p>
              </div>
              <div class="reservation-info">
                <div class="row">
                  <b class="reservation-name">Reservation Name</b>
                  <div class="reservation-time">
                    <b>10:00 am - 10:30 am</b>
                    <p>30 Minutes</p>
                  </div>
                </div>
                <br>
                <div class="row">
                  <div>
                    <p>Total $21.00</p>
                    <input type="checkbox" name="pay">
                    <label for="pay">Paid?</label>
                  </div>
                  <div class="reservation-contact">
                    <p>email@email.com</p>
                    <p>(317) 599-9653</p>
                  </div>
                </div>
              </div>
            </div>
          </div>`);
        } else if(page == 'cats') {
          $("#admin-cats-content").removeClass("hidden")
          $("#admin-cats-content").addClass("show")
          getAdminCatData();
        } else if(page == 'menu') {
          $("#admin-menu-content").removeClass("hidden")
          $("#admin-menu-content").addClass("show")
          getAdminMenuData();
        }
      }
    })
  }

  if(anyAdminCheck == true) {
    $("#header-line").html(headerLine);

    pageArray.forEach(page => {
      if(page == 'menu') {
        getMenuData();
      } else if(page == 'cats') {
        getCatData()
      }
    })
  }
}

$(document).ready(function() {
    initListeners();
    console.log(window.location.pathname, window.location.host);
    checkPage();
    //on a click save url to const, then document.ready if url run load data
})


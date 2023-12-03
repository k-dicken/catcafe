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


//ADMIN
const adminpass = "I want to pet a cat."

function connectToStorage() {
  if(localStorage) {
      let passStatus = localStorage.getItem("passStatus")
      if(passStatus) {
          console.log("class yay")
      } else {
          console.log("created passstatus");
          localStorage.setItem("passStatus", JSON.stringify('f'));
      }
  } else {
      console.log("No local storage detected.");
  }
}

function passwordListener() {
    $("#password-submit").on("click", (e) => {
        console.log("click")
        checkPassword();
    })
}

function checkPassword() {
    let input = $("#password-input").val();
    if (input == adminpass) {
        console.log("success");
        localStorage.setItem("passStatus", JSON.stringify('t'));
        checkPage();
    } else {
        console.log("fail");
        $("#password-error").removeClass("hidden")
        $("#password-error").addClass("show")
        $("#password-error").html('Error: Incorrect password. Please try again.')
    }
    console.log(input);
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
// function addCatData() {
//   let img = $("#add-img")
//   let imgfile = $("#add-img")[0].files[0]
//   // let imgvalue = $("#add-img").value();
//   console.log("uploaded image", img, imgfile);
// }
// window.addEventListener('load', function() {
//   document.querySelector('input[type="file"]').addEventListener('change', function() {
//       console.log("imageupload", this.files, this.files[0]);
//       if (this.files && this.files[0]) {
//           var img = URL.createObjectURL(this.files[0]); // set src to blob url
//           console.log(img);
//       }
//   });
// });

function uploadImage() {
  let file = $("#add-img").get(0).files[0];
  let filename = +new Date() + "-" + file.name;
  console.log(filename);
  let metadata = {contentType: file.type};
  console.log(metadata);
  let pathRef = ref(storage, "images/" + filename);
  const storageRef = ref(storage, pathRef);

  const uploadTask = uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("file available at", downloadURL)
          addCatData(downloadURL);
      })
  })

}
async function addCatData(img) {
  // uploadImage();

  let name = $("#add-name")[0].value;
  let age = $("#add-age")[0].value; 
  let gender = $("#add-gender")[0].value;
  let desc = $("#add-desc")[0].value;

  console.log(name, age, img, gender, desc)

  await addDoc(collection(db, "cats"), {
    name: name,
    age: age,
    img: img,
    gender: gender,
    desc: desc
  });

  // resetAdminMenuData();
}
window.addCat = function(e) {
  // console.log("Clicked cat button!", e, e.id)
  // console.log(typeof e.id);
  uploadImage();
  // deleteMenuItemData(e.id);
}

  // const uploadTask = uploadBytesResumable(storageRef, file);

// // Register three observers:
// // 1. 'state_changed' observer, called any time the state changes
// // 2. Error observer, called on failure
// // 3. Completion observer, called on successful completion
// uploadTask.on('state_changed', 
// (snapshot) => {
//   // Observe state change events such as progress, pause, and resume
//   // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//   console.log('Upload is ' + progress + '% done');
//   $(".bar").css("width", progress + "%")
//   switch (snapshot.state) {
//     case 'paused':
//       console.log('Upload is paused');
//       break;
//     case 'running':
//       console.log('Upload is running');
//       break;
//   }
// }, 
// (error) => {
//   // Handle unsuccessful uploads
// }, 
// () => {
//   // Handle successful uploads on complete
//   // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//   getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//     console.log('File available at', downloadURL);
//     $(".bar").css("width", 0);
//     $("#myImage").val(null);
//     $(".imageHolder").html(`<img src="${downloadURL}" alt="">`)
//   });
// }
// );


//
//MENU FUNCTIONS
//
async function getMenuData() {
    const querySnapshot = await getDocs(collection(db, "menu"));
    console.log("menu");
    querySnapshot.forEach((doc) => {
        let item =  `<div class="menu-item">
        <b>${doc.data().name}</b>
        <p>${doc.data().desc}</p>
        <p class="price">$${doc.data().price.toFixed(2)}</p>
      </div>`
      console.log(item)

      switch (doc.data().category) {
        case 'seasonal':
          console.log("seasonal")
          $('#seasonal-items').append(item);
          break;

        case 'coffee':
          console.log("coffee")
          $('#coffee-items').append(item);
        break;

        case 'latte':
          console.log("latte")
          $('#latte-items').append(item);
          break;

        case 'tea':
          console.log("tea")
          $('#tea-items').append(item);
        break;

        case 'bakery':
          console.log("bakery")
          $('#bakery-items').append(item);
        break;
      
        default:
          break;
      }
    })
}

//MENU ADMIN FUNCTIONS
async function getAdminMenuData() {
  console.log("menuData");
  const querySnapshot = await getDocs(collection(db, "menu"));
  console.log(querySnapshot)
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
        console.log("seasonal")
        $('#seasonal-items').append(item);
        break;

      case 'coffee':
        console.log("coffee")
        $('#coffee-items').append(item);
      break;

      case 'latte':
        console.log("latte")
        $('#latte-items').append(item);
        break;

      case 'tea':
        console.log("tea")
        $('#tea-items').append(item);
      break;

      case 'bakery':
        console.log("bakery")
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

    getAdminMenuData();
}

function adminListeners() {
  console.log("MENU LISTENNNN")
  $("#add").on("click", (e) => {
    console.log("click", $("#add-item"));
    $("#add-item").removeClass("hidden");
    $("#add-item").addClass("show");
})
  $("#add-close").on("click", (e) => {
    console.log("click");
    $("#add-item").removeClass("show");
    $("#add-item").addClass("hidden");
})
}

//Delete menu item listener
window.deleteMenuItem = function(e) {
  console.log("Clicked delete button!", e, e.id)
  console.log(typeof e.id);
  // deleteMenuItemData(e.id);
}
//Delete menu item
async function deleteMenuItemData(id) {
  // console.log(id)
  // await deleteDoc(doc(db, "menu", id));
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
  console.log(e);
  let name = $("#add-name")[0].value;
  let price = $("#add-price")[0].value;
  let desc = $("#add-desc")[0].value;
  let category = $("#add-category")[0].value;
  console.log(name, price, desc, category)
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


//PAGE FUNCTIONS
function initListeners() {
    console.log("init");
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
  console.log(pageArray);

  if(pageArray[1] == 'admin') {
    if(JSON.parse(localStorage.getItem("passStatus")) != 't') {
      console.log("page is admin pass not true")
      connectToStorage();
    } else if(pageArray[1] == 'admin' && JSON.parse(localStorage.getItem("passStatus")) == 't') {
      $("#password-section").css("display", "none");
      if(pageArray[0] == 'reservations') {
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
      } else if(pageArray[0] == 'cats') {
  
      } else if(pageArray[0] == 'menu') {
        $("#admin-menu-content").removeClass("hidden")
        $("#admin-menu-content").addClass("show")
        getAdminMenuData();
      }
    }
  } else {
    if(pageArray[0] == 'menu') {
      console.log("menu functions");
      getMenuData();
    }
  }

}

$(document).ready(function() {
    initListeners();
    console.log(window.location.pathname, window.location.host);
    checkPage();
    //on a click save url to const, then document.ready if url run load data
})


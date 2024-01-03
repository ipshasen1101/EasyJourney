
//Importing Related Firebase Products
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { auth, userRef, db } from "./firebase.js";

//Back Icon
const goBack = document.getElementById("go-back");
goBack.addEventListener("click", () => {
  window.location = "homepage.html";
});

const passwordHolder = document.getElementById("password_holder");
const dob = document.getElementById("dob");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const creationTime = document.getElementById("creationTime");
const img = document.getElementById("img");
const svg = document.getElementById("svg");
const loader = document.getElementById("loader");
const nonLoader = document.getElementById("non-loader");
const sign_Out = document.getElementById("sign-out");
const history = document.getElementById("history");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

//function to show Search History of User
const showHistory = async (uid) => {
  const docSnap = await getDoc(doc(db, "History", uid));

  if (docSnap.exists()) {
    console.log(docSnap.data());
    for (const search in docSnap.data()) {
      const dateObj = new Date(docSnap.data()[search].creationTime);
      const dateTime =
        dateObj.getDate() +
        " " +
        months[dateObj.getMonth()] +
        " " +
        dateObj.getFullYear() +
        ", " +
        dateObj.getHours() +
        ":" +
        ((dateObj.getMinutes()<10) ? ("0"+dateObj.getMinutes()) : (dateObj.getMinutes()));

      history.innerHTML += `  <div class="p-5 my-5 w-[350px] bg-opacity-10 bg-blue-300 backdrop-blur-lg rounded-xl shadow">
            <h3 class="text-xl font-bold text-center text-[#1aa8b1]/90 drop-shadow-lg border-[#1aa8b1]/60">${search}</h3>
            <p class="italic text-xs text-[#003049] mb-4">${dateTime}</p>
            <div class="flex flex-col">
              <span class="flex justify-start text-md pb-2 font-medium text-[#003049]">From Where?</span>
              <div class="grid md:grid-cols-2 md:gap-6 mb-4">
                <span class="text-sm text-[#003049]/70 font-normal">Name: ${
                  docSnap.data()[search].depart_place_code.split("&")[0]
                }</span>
                <span class="text-sm text-[#003049]/70 font-normal">Station Code: ${
                  docSnap.data()[search].depart_place_code.split("&")[1]
                }</span>
              </div>
              <span class="flex justify-start text-md pb-2 font-medium text-[#003049]">To Where?</span>
              <div class="grid md:grid-cols-2 md:gap-6 mb-4">
                <span class="text-sm text-[#003049]/70 font-normal">Name: ${
                  docSnap.data()[search].arrival_place_code.split("&")[0]
                }</span>
                <span class="text-sm text-[#003049]/70 font-normal">Station Code: ${
                  docSnap.data()[search].arrival_place_code.split("&")[1]
                }</span>
              </div>
              <span class="flex justify-start text-md pb-2 font-normal text-[#003049]/80">Number of guests: ${
                docSnap.data()[search].guests
              }</span>
              <span class="flex justify-start text-md pb-2 font-normal text-[#003049]/80">Depart Date: ${
                docSnap.data()[search].depart_date
              }</span>
              <span class="flex justify-start text-md pb-2 font-normal text-[#003049]/80">Check-In Date: ${
                docSnap.data()[search].checkin_date
              }</span>
              <span class="flex justify-start text-md pb-2 font-normal text-[#003049]/80">Check-Out Date: ${
                docSnap.data()[search].checkout_date
              }</span>
    
            </div>
          </div>
        `;
    }
  } else {
    history.innerHTML +=
      "<h2 class='text-2xl font-semibold text-[#1aa8b1] text-center my-10'>No History is available to show.</h2>";
  }
};

onAuthStateChanged(auth, async (user) => {
  console.log(user);
  if (user) {
    if (user.displayName) {

      //showing Profile of a Google Signed In User
      const docRef = doc(db, "UserData(Google)", user.uid);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      loader.classList.toggle("hidden");
      nonLoader.classList.toggle("hidden");

      passwordHolder.classList.toggle("hidden");
      dob.classList.toggle("hidden");
      svg.classList.toggle("hidden");
      img.setAttribute("src", `${docSnap.data().photoUrl}`);
      img.classList.toggle("hidden");
      const dateTime = new Date(docSnap.data().creationTime);
      const date =
        dateTime.getDate() +
        " " +
        months[dateTime.getMonth()] +
        " " +
        dateTime.getFullYear();
      const time = dateTime.getHours() + ":" + dateTime.getMinutes();

      name.innerHTML += `${docSnap.data().name}`;
      email.innerHTML += `${docSnap.data().email}`;
      creationTime.innerHTML += `${date}` + ",  " + `${time}`;

    } else {
      //showing Profile of Logged In User
      
      const docRef = doc(db, "UserData", user.uid);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      nonLoader.classList.toggle("hidden");
      loader.classList.toggle("hidden");

      name.innerHTML += `${docSnap.data().name}`;
      email.innerHTML += `${docSnap.data().email}`;
      console.log(docSnap.data().dob);
      dob.innerHTML += `${docSnap.data().dob}`;

      password.innerHTML += `${docSnap.data().password}`;
      creationTime.innerHTML += `${docSnap.data().creationTime}`;
    }

    showHistory(user.uid);
  }
});

//Redirecting to Reset Password page
const resetPassword = document.getElementById("reset-password");
resetPassword.addEventListener("click", () => {
  window.location = "forgot.html";
});

//Sign Out
const signOutBtn = document.getElementById("signOutBtn");
const signOutCard = document.getElementById("signOutCard");
const okBtn = document.getElementById("okBtn");
signOutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await signOut(auth)
    .then(() => {
      signOutCard.classList.toggle("hidden");
    })
    .catch((err) => console.log(err));
});

okBtn.addEventListener("click", () => {
  signOutCard.classList.toggle("hidden");
  window.location = "homepage.html";
});

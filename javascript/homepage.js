
//Importing Related Firebase Products
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

import { auth, db } from "./firebase.js";

//Navbar Starts

//Responsive Navbar related
let isOpen = false;

const menu = document.getElementById("menu");
const closeMenu = document.getElementById("close");
const items = document.getElementById("nav");
const btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  items.classList.toggle("hidden");
  isOpen = !isOpen;

  if (isOpen) {
    menu.classList.add("hidden");
    closeMenu.classList.remove("hidden");

    items.classList.add("translate-x-0", "opacity-100");
    items.classList.remove("opacity-0", "-translate-x-full");
  } else {
    menu.classList.remove("hidden");
    closeMenu.classList.add("hidden");

    items.classList.remove("translate-x-0", "opacity-100");
    items.classList.add("opacity-0", "-translate-x-full");
  }
  console.log(isOpen);
});

//EasyJourney logo to home page
const home = document.getElementById("home");

// Get Started button to Signup Page
const getStartedBtn = document.getElementById("getStartedBtn");
if (getStartedBtn) {
  getStartedBtn.addEventListener("click", () => {
    window.location = "login.html";
  });
}

//profile Icon nav related
const profileIcon = document.getElementById("profileIcon");
let userInfo;
onAuthStateChanged(auth, (user) => {
  userInfo = user;
  console.log(userInfo);
  if (userInfo == null) {
  } else {
    getStartedBtn.classList.toggle("hidden");
    profileIcon.classList.toggle("hidden");
  }
});
// console.log(userInfo)

//profile Icon dropdown
const dropdown = document.getElementById("dropdown");
if (profileIcon) {
  profileIcon.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });
}

document.addEventListener("click", (div) => {
  if (
    div.target.id !== "profileIcon" &&
    !dropdown.classList.contains("hidden")
  ) {
    dropdown.classList.add("hidden");
  }
});

//signing out and sign out card
const signOutBtn = document.getElementById("signOutBtn");
const signOutCard = document.getElementById("signOutCard");
const okBtn = document.getElementById("okBtn");

signOutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await signOut(auth)
    .then(() => {
      // signOutCard.classList.toggle('hidden');

      getStartedBtn.classList.toggle("hidden");
      profileIcon.classList.toggle("hidden");
      signOutCard.classList.toggle("hidden");
    })
    .catch((err) => console.log(err));
});

if (okBtn) {
  okBtn.addEventListener("click", () => {
    signOutCard.classList.toggle("hidden");
    window.location = "homepage.html";
  });
}
//Navbar Ends

//query Form related
const queryForm = document.getElementById("queryForm");
const searchBtn = document.getElementById("searchBtn");
const depart_place = document.getElementById("depart_place");
const depart_code = document.getElementById("depart_code");
const arrival_place = document.getElementById("arrival_place");
const arrival_code = document.getElementById("arrival_code");
const guests = document.getElementById("guests");
const depart_date = document.getElementById("depart_date");
const checkin_date = document.getElementById("checkin_date");
const checkout_date = document.getElementById("checkout_date");

//Auto Complete function
const autoComplete = async (text) => {
  var result;
  await axios
    .get(
      "https://api.geoapify.com/v1/geocode/autocomplete?filter=countrycode:in",
      {
        params: {
          text: `${text}`,
          limit: "5",
          filter: "countrycode:in",
          apiKey: "816e32254d714696b23a770ce971b5bc",
        },
      }
    )
    .then((res) => {
      console.log(res);
      result = res.data.features;
    })
    .catch((err) => console.log(err));

  return result;
};

//auto complete
const list1 = document.getElementById("list1");
const list2 = document.getElementById("list2");
const displayNames = (input, value) => {
  input.value = value;
  removeElements();
};
const removeElements = () => {
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
};

//Searching Depart Place(using keyup Event Listener)
depart_place.addEventListener("keyup", async (e) => {
  console.log("keyup done");

  const suggestions = await autoComplete(depart_place.value);
  // removeElements();
  list1.innerHTML = "";
  console.log("auto complete function done");
  let i = 0;
  if (suggestions) {
    suggestions.forEach((suggestion) => {
      list1.innerHTML += `<li class="px-3 py-2 cursor-pointer w-50 font-semibold text-[#003049] hover:bg-[#1aa8b1]/60 rounded-md list-items" id="${i}" onclick="{document.getElementById('depart_place').value = '${suggestion.properties.address_line1}, ${suggestion.properties.address_line2}'}"><ion-icon class="w-3 h-3" name="location-outline"></ion-icon> ${suggestion.properties.address_line1}, ${suggestion.properties.address_line2}</li>`;

      console.log(i + "item added");
      i++;
    });
  }
});

document.addEventListener("click", (div) => {
  if (
    div.target.id !== "list1" &&
    document.getElementById("list1").innerHTML !== ""
  ) {
    document.getElementById("list1").innerHTML = "";
  }
});

//Searching Arrival Place(using keyup Event Listener)
arrival_place.addEventListener("keyup", async () => {
  const suggestions = await autoComplete(arrival_place.value);
  list2.innerHTML = "";

  let i = 0;
  if (suggestions) {
    suggestions.forEach((suggestion) => {
      list2.innerHTML += `<li class="px-3 py-2 cursor-pointer font-medium text-[#003049]
            hover:bg-[#1aa8b1]/60 rounded-md list-items" id="${i}" onclick="{document.getElementById('arrival_place').value = '${suggestion.properties.address_line1}, ${suggestion.properties.address_line2}'}"><ion-icon class="w-3 h-3" name="location-outline"></ion-icon> ${suggestion.properties.address_line1}, ${suggestion.properties.address_line2}</li>`;

      i++;
    });
  }
});

document.addEventListener("click", (div) => {
  if (
    div.target.id !== "list2" &&
    document.getElementById("list2").innerHTML !== ""
  ) {
    document.getElementById("list2").innerHTML = "";
  }
});

if (queryForm) {

  //Submitting Query Form
  queryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("hello from search btn");
    const currentTime = new Date();

    const depart_placeValue = document.getElementById("depart_place").value;
    const depart_codeValue = document.getElementById("depart_code").value;
    const arrival_placeValue = document.getElementById("arrival_place").value;
    const arrival_codeValue = document.getElementById("arrival_code").value;
    const guestsValue = document.getElementById("guests").value;
    const depart_dateValue = document.getElementById("depart_date").value;
    const checkin_dateValue = document.getElementById("checkin_date").value;
    const checkout_dateValue = document.getElementById("checkout_date").value;

    //Storing values of every Parameter in Local Storage
    localStorage.setItem("depart_place", depart_placeValue);
    localStorage.setItem("depart_code", depart_codeValue);
    localStorage.setItem("arrival_place", arrival_placeValue);
    localStorage.setItem("arrival_code", arrival_codeValue);
    localStorage.setItem("guests", guestsValue);
    localStorage.setItem("depart_date", depart_dateValue);
    localStorage.setItem("checkin_date", checkin_dateValue);
    localStorage.setItem("checkout_date", checkout_dateValue);

    //Storing Search History of a User

    //checking whether user is logged in or not
    if (auth.currentUser) {
      const docSnap = await getDoc(doc(db, "History", auth.currentUser.uid));
      
      //setDoc if first search; updateDoc if not
      if (docSnap.exists()) {
        const historyLength = Object.keys(docSnap.data()).length;
        await updateDoc(doc(db, "History", auth.currentUser.uid), {
          [`Search ${historyLength + 1}`]: {
            depart_place_code: `${depart_placeValue} & ${depart_codeValue.toUpperCase()}`,
            arrival_place_code: `${arrival_placeValue} & ${arrival_codeValue.toUpperCase()}`,
            guests: `${guestsValue}`,
            depart_date: `${depart_dateValue}`,
            checkin_date: `${checkin_dateValue}`,
            checkout_date: `${checkout_dateValue}`,
            creationTime: `${currentTime}`,
          },
        });
      } else {
        await setDoc(doc(db, "History", auth.currentUser.uid), {
          [`Search 1`]: {
            depart_place_code: `${depart_placeValue} & ${depart_codeValue.toUpperCase()}`,
            arrival_place_code: `${arrival_placeValue} & ${arrival_codeValue.toUpperCase()}`,
            guests: `${guestsValue}`,
            depart_date: `${depart_dateValue}`,
            checkin_date: `${checkin_dateValue}`,
            checkout_date: `${checkout_dateValue}`,
            creationTime: `${currentTime}`,
          },
        });
      }
    }

    window.location = "train.html";
  });
}

//swiper
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

//send mail
const sendMail = async (name, email, body, phone) => {
  await Email.send({
    Host: "smtp.elasticemail.com",
    Username: "cs.ratul03@gmail.com",
    Password: "CCA04606BA3C2FDCE629B54FE2F69673D250",
    To: "cs.ratul03@gmail.com",
    From: `cs.ratul03@gmail.com`,
    Subject: "EasyJourney related issue",
    Body: `Hello! I am ${name}. ${body} You can reach me at ${email} / ${phone}`,
  })
  .then((message) => {
    alert(message);
    contactForm.your_name.value = "";
    contactForm.your_email.value = "";
    contactForm.your_phone.value = "";
    contactForm.your_message.value = ""
  })
  .catch(err => console.log(err));
};

//Contact Us Form related
const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const name = contactForm.your_name.value;
  const email = contactForm.your_email.value;
  const phone = contactForm.your_phone.value;
  const message = contactForm.your_message.value;
  sendMail(name, email, message, phone);
});

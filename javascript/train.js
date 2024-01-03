

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
import { auth } from "./firebase.js";

//Navbar Starts
//responsive nav related
let isOpen = false;

const menu = document.getElementById("menu");
const closeMenu = document.getElementById("close");
const items = document.getElementById("nav");
const btn = document.getElementById("btn");

if (btn) {
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
}

//EasyJourney logo to home page
const home = document.getElementById("home");

// Get Started button to Signup Page
const getStartedBtn = document.getElementById("getStartedBtn");
if (getStartedBtn) {
  getStartedBtn.addEventListener("click", () => {
    window.location = "login.html";
  });
}

//Profile Icon nav related
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

//Profile Icon Dropdown
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

//Signing Out and Sign Out Card
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

//Fetching values of required Parameters from Local Storage
const depart_place = localStorage.getItem("depart_place");
const arrival_place = localStorage.getItem("arrival_place");
const depart_code = localStorage.getItem("depart_code");
const arrival_code = localStorage.getItem("arrival_code");
const depart_date = localStorage.getItem("depart_date");
const bookNowBtn = document.getElementById("book-now-btn");

//destructuring Departure Date into date, month and year for Book Now button
const fullDate = new Date(depart_date);
const date = fullDate.getDate();
const month = fullDate.getMonth();
const year = fullDate.getFullYear();

let month2;
if (month + 1 < 10) {
  month2 = (month + 1).toString();
  month2 = "0" + month2;
}
const weekdays = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];

const tableBody = document.getElementById("table_body");
let countRunDays = 0;

const loader = document.getElementById("loader");

//function to fetch Trains
const getTrains = async () => {
  await axios
    .get(
      `https://railway-w6eh.onrender.com/proxy?from=${depart_code.toUpperCase()}&to=${arrival_code.toUpperCase()}&date=${depart_date}`
    )
    .then((res) => {
      loader.classList.toggle("hidden");

      res.data.data.forEach((train) => {
        tableBody.innerHTML += `<tr class="bg-opacity-50 backdrop-blur-xl">
                <td class="px-4 py-4 text-sm font-medium text-[#003049] whitespace-nowrap">
                    <div class="inline-flex items-center gap-x-3">

                        <div class="flex items-center gap-x-2">
                            
                            <div>
                                <h2 class="font-medium text-[#003049]">${
                                  train.train_base.train_name
                                }</h2>
                                <span class="text-sm font-normal text-[#003049]/50">(${
                                  train.train_base.train_no
                                })</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4 text-sm text-[#003049] whitespace-nowrap">
                    <div class="inline-flex items-center gap-x-3">

                        <div class="flex items-center gap-x-2">
                            
                            <div>
                                <h2 class="px-2 text-[#003049]">${
                                  train.train_base.source_stn_name
                                }</h2>
                                <span class="text-xs font-normal px-2 text-[#003049]/50">(${
                                  train.train_base.source_stn_code
                                })</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-[#003049] whitespace-nowrap">
                    <div class="inline-flex items-center gap-x-3">

                        <div class="flex items-center gap-x-2">
                            
                            <div>
                                <h2 class="px-2 text-[#003049]">${
                                  train.train_base.dstn_stn_name
                                }</h2>
                                <span class="text-xs font-normal px-2 text-[#003049]/50">(${
                                  train.train_base.dstn_stn_code
                                })</span>
                            </div>
                        </div>
                    </div>
                </td>
                
                <td class="px-8 py-4 text-sm text-[#003049] whitespace-nowrap">${
                  train.train_base.from_time.toString().split(".")[0]
                }:${train.train_base.from_time.toString().split(".")[1]}</td>
                <td class="px-8 py-4 text-sm text-[#003049] whitespace-nowrap">${
                  train.train_base.to_time.toString().split(".")[0]
                }:${train.train_base.to_time.toString().split(".")[1]}</td>
                
                <td class="px-4 py-4 text-sm text-[#003049] whitespace-nowrap">${
                  train.train_base.travel_time.toString().split(".")[0]
                }hr ${
          train.train_base.travel_time.toString().split(".")[1]
        }min</td>
                
                <td class=" py-4 w-35 text-sm text-gray-500 whitespace-nowrap">
                    <div class="flex flex-wrap gap-2" id="run_days${countRunDays}">
                   
                    </div>
                </td>
                <td class="px-2 py-4 text-sm text-gray-500 whitespace-nowrap">
                <a href="https://www.ixigo.com/trains/${
                  train.train_base.train_no
                }?orgn=${depart_code.toUpperCase()}&dstn=${arrival_code.toUpperCase()}&departDate=${year}-${month2}-${date}&quota=GN" target="_blank" id="book-now-btn" class="flex justify-center text-center items-center px-2 py-2 w-[80px] font-medium bg-[#1aa8b1] text-xs text-white rounded-lg hover:bg-opacity-70 hover:drop-shadow-[#1aa8b1] transition-shadow duration-400 ">Book Now</a>
                </td>
               
            </tr>`;
        let count = 0;
        train.train_base.running_days.split("").forEach((day) => {
          if (day == "1") {
            document.getElementById(
              `run_days${countRunDays}`
            ).innerHTML += `<p class="px-2 py-1 text-xs text-[#1aa8b1] text-center rounded-full bg-[#1aa8b1]/10">${weekdays[count]}</p>`;
          }
          count++;
        });
        countRunDays++;
      });
    });
};
getTrains();

//Navigation among trains, attractions, hotels
const trainPage = document.getElementById("trains");
const hotelPage = document.getElementById("hotels");
const attractionPage = document.getElementById("attractions");

hotelPage.addEventListener("click", () => {
  window.location = "hotel.html";
});
attractionPage.addEventListener("click", () => {
  window.location = "tourist.html";
});

//Search Filter
const search = document.getElementById("search");
search.addEventListener("keyup", (e) => {
  const rows = document.querySelectorAll("tbody tr");

  console.log(rows);
  console.log(rows[0].children[5]);

  console.log(e.target.value);
  const q = e.target.value.toLowerCase();

  rows.forEach((row) => {
    row.children[0].children[0].children[0].children[0].children[0].innerText
      .toLowerCase()
      .startsWith(q)
      ? (row.style.display = "")
      : (row.style.display = "none");
  });
});

// const totalTime = document.getElementById('time');
// var asc = false;
// totalTime.addEventListener('click', () => {
//     console.log("total time btn clicked")

//     const rows = document.querySelectorAll('tbody tr');

//     for(let i = 1; i<Object.values(rows).length;i++){
//         let first_row = Array.from(rows)[i-1].children[5].innerText;

//     }

//     Array.from(rows).sort((a,b) => {

//         let first_row = a.children[5].innerText;
//         let second_row = b.children[5].innerText;
//         console.log(first_row, second_row)

//         return asc ? (first_row > second_row ? -1 : 1) : (first_row > second_row ? 1 : -1);
//     })
//     .map((sorted_row) => {
//         console.log(sorted_row)
//         document.querySelector("tbody").appendChild(sorted_row)
//     })
//     // console.log(rows)

//     asc = !asc;
// })

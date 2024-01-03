// import { arrival_place, checkin_date, checkout_date, guests } from "./homepage.js";

//Fetching values of required Parameters from Local Storage
const arrival_place = localStorage.getItem("arrival_place");
const checkin_date = localStorage.getItem("checkin_date");
const checkout_date = localStorage.getItem("checkout_date");
const guests = localStorage.getItem("guests");

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

//Sleep function
const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

let latitude, longitude;
const hotel_cards = document.getElementById("hotel_cards");
const loader = document.getElementById("loader");

//function to get Co-ordinates of Destination
const getLat = async () => {
  loader.classList.toggle("hidden");
  await axios
    .get("https://forward-reverse-geocoding.p.rapidapi.com/v1/forward", {
      params: {
        city: `${arrival_place.split(",")[0]}`,
        country: "India",
      },
      headers: {
        "X-RapidAPI-Key": "59ff50e983msha60e74c06456dacp1e1f8ajsnca3f5d61adb6",
        "X-RapidAPI-Host": "forward-reverse-geocoding.p.rapidapi.com",
      },
    })
    .then((res) => {
      console.log(res);
      latitude = res.data[0].lat;
      longitude = res.data[0].lon;

      //function to get a List of Hotels
      const getHotelDetails = async () => {
        await axios
          .get("https://apidojo-booking-v1.p.rapidapi.com/properties/list", {
            params: {
              offset: "0",
              arrival_date: `${checkin_date}`,
              departure_date: `${checkout_date}`,
              guest_qty: `${guests}`,
              room_qty: "1",
              search_type: "latlong",
              search_id: "none",
              price_filter_currencycode: "INR",
              latitude: `${latitude}`,
              longitude: `${longitude}`,
              order_by: "popularity",
              languagecode: "en-us",
            },
            headers: {
              "X-RapidAPI-Key":
                "4f0175e781mshbc342f870ec6bf4p19573bjsn2b5b1d3dfc1f",
              "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
            },
          })
          .then((res) => {
            console.log(res);
            loader.classList.toggle("hidden");

            res.data.result.slice(0, 15).forEach((hotel) => {

              //function to get Description of a Hotel
              const getDesc = async () => {
                await axios
                  .get(
                    "https://apidojo-booking-v1.p.rapidapi.com/properties/get-description",
                    {
                      params: {
                        hotel_ids: `${hotel.hotel_id}`,
                      },
                      headers: {
                        "X-RapidAPI-Key":
                          "4f0175e781mshbc342f870ec6bf4p19573bjsn2b5b1d3dfc1f",
                        "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
                      },
                    }
                  )
                  .then((res) => {
                    // console.log(res.data[0]);

                    hotel_cards.innerHTML += `<div class="w-full max-w-md px-8 py-4 mt-16 bg-opacity-0 backdrop-blur-md rounded-lg shadow-lg">
                        <div class="flex justify-center -mt-16 md:justify-end">
                            <img class="object-cover w-20 h-20 border-2 border-[#1aa8b1]/70 rounded-full" alt="Testimonial avatar" src="${
                              hotel.main_photo_url
                            }">
                        </div>
                    
                        <h2 class=" text-xl font-bold text-gray-800 md:mt-0">${
                          hotel.hotel_name
                        }</h2>
                        <span class="flex justify-start w-[200px] text-md font-semibold">
                          <ion-icon name="star" class=" w-4 h-4"></ion-icon><span class="text-gray-500 text-md">${
                            hotel.review_score
                          }</span>
                        </span>
                        <p class="mt-4 text-sm text-gray-400"><ion-icon name="location-outline"></ion-icon>${
                          hotel.address
                        }</p>
                    
                        <p class="mt-2 text-sm text-gray-600">${
                          res.data[0].description.split(".")[0]
                        }. ${
                      res.data[0].description.split(".")[1]
                        ? res.data[0].description.split(".")[1]
                        : " "
                    }</p>
                    
                        <div class="flex justify-between mt-4">
                            <p class="px-3 h-7 text-md text-[#1aa8b1] rounded-full bg-[#1aa8b1]/20">${
                              hotel.price_breakdown.all_inclusive_price
                            } INR</p>
                          
                          <a href="${
                            hotel.url
                          }" target="_blank" class="mt-2 text-lg font-medium bg-[#1aa8b1]/20 pl-2 rounded-lg text-[#1aa8b1]" tabindex="0" role="link">Check Out<ion-icon name="caret-forward" class="text-[#1aa8b1] font-bold h-6 w-6 -mb-1"></ion-icon></a>
                        </div>
                    </div>`;
                  })
                  .catch((err) => console.log(err));
              };
              getDesc();

              sleep(300);
            });
          })
          .catch((err) => console.log(err));
      };
      getHotelDetails();
    })
    .catch((err) => console.log(err));
};
getLat();

//Redirecting to other pages
const trainPage = document.getElementById("trains");
const hotelPage = document.getElementById("hotels");
const attractionPage = document.getElementById("attractions");

trainPage.addEventListener("click", () => {
  window.location = "train.html";
});
attractionPage.addEventListener("click", () => {
  window.location = "tourist.html";
});

//Search Filter
const search = document.getElementById("search");
search.addEventListener("keyup", (e) => {
  const cards = hotel_cards.children;

  const q = e.target.value.toLowerCase();
  Array.from(cards).forEach((card) => {
    card.children[1].innerText.toLowerCase().startsWith(q)
      ? (card.style.display = "")
      : (card.style.display = "none");
  });
});

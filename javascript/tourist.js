
//Fetching values of required Parameters from Local Storage
const arrival_place = localStorage.getItem("arrival_place");

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

let latitude, longitude, xid;
let count = 0;
const attraction_cards = document.getElementById("attraction_cards");
const loader = document.getElementById("loader");

//function for getting Co-ordinates of destination
const getCoords = async () => {
  loader.classList.toggle("hidden");
  console.log(arrival_place.split(" ")[0]);

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
      console.log(latitude, longitude);

      //function for getting Tourist Attractions List
      const getPlaces = async () => {
        await axios
          .get("http://api.opentripmap.com/0.1/en/places/radius", {
            params: {
              radius: "10000",
              lon: `${longitude}`,
              lat: `${latitude}`,
              limit: "40",
              apikey:
                "5ae2e3f221c38a28845f05b61ea65fa1e892d21604bde8dc0c1516bf",
            },
          })
          .then((res) => {
            console.log(res);
            loader.classList.toggle("hidden");
            const placesWithNames = res.data.features.filter(
              (place) => place.properties.name !== ""
            );

            //function for fetching Details of every Place 
            const getDetails = async (xid) => {
              await axios
                .get(`http://api.opentripmap.com/0.1/en/places/xid/${xid}`, {
                  params: {
                    apikey:
                      "5ae2e3f221c38a28845f05b61ea65fa1e892d21604bde8dc0c1516bf",
                  },
                })
                .then((res) => {
                  console.log(res);

                  attraction_cards.innerHTML += `<div class=""><div class="backdrop-blur-[10px] mx-auto mt-6 w-80 mb-6 transform overflow-hidden rounded-lg bg-white/30 border border-white/40 shadow-md duration-300 hover:scale-105 hover:shadow-lg">
                        <img class="h-30vh w-full  object-center" src="${
                          res.data.preview
                            ? res.data.preview.source
                            : "../assets/default.jpg"
                        }" alt="${res.data.name}" />
                        <div class="mt-2 ml-4 block" id="badge${count}">
                        
                        </div>
                        <div class="p-4 relative">
                            <h2 class="mb-2 text-lg font-semibold text-[#003049]">${
                              res.data.name
                            }</h2>
                            <p class="mb-2 text-sm text-[#003049]/70 flex-row"><ion-icon name="location" class="w-4"></ion-icon>Address: ${
                              res.data.address.road
                            }, ${res.data.address.suburb}, ${
                    res.data.address.state_district
                  }, ${res.data.address.state}<br>Postcode: ${
                    res.data.address.postcode
                  }</p>
                            <p class="mb-2 text-sm text-[#003049]/70">${
                              (res.data.wikipedia_extracts
                                ? res.data.wikipedia_extracts.html
                                : res.data.info
                                ? res.data.info.descr
                                : "No description"
                              ).split(".")[0]
                            }. ${
                    (res.data.wikipedia_extracts
                      ? res.data.wikipedia_extracts.html
                      : res.data.info
                      ? res.data.info.descr
                      : "No description."
                    ).split(".")[1]
                  }.</p>
                        <div class="flex items-center">
                        <a type="button" class="my-4 text-white bg-[#1aa8b1]/70 hover:bg-[#1aa8b1]focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" href=${
                          res.data.otm
                        } target="_blank">
                        See More
                        <svg aria-hidden="true" class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </a>
                        </div>

                    </div>
                    </div></div>`;

                  res.data.kinds.split(",").forEach((attribute) => {
                    document.getElementById(
                      `badge${count}`
                    ).innerHTML += `<span class="bg-[#1aa8b1]/30 inline-block backdrop-blur-[10px] border border-[#1aa8b1] text-xs text-[#003049] font-semibold rounded-full px-2 ml-2 overflow-hidden">${attribute}</span>`;
                  });
                  count++;
                })
                .catch((err) => console.log(err));
            };

            // var i = 1;

            placesWithNames.forEach((place) => {
              xid = place.properties.xid;

              getDetails(xid);
              sleep(300);
            });
          })
          .catch((err) => console.log(err));
      };
      getPlaces();
    })
    .catch((err) => console.log(err));
};
getCoords();

//Redirecting to other Pages
const trainPage = document.getElementById("trains");
const hotelPage = document.getElementById("hotels");
const attractionPage = document.getElementById("attractions");

trainPage.addEventListener("click", () => {
  window.location = "train.html";
});
hotelPage.addEventListener("click", () => {
  window.location = "hotel.html";
});

//Search Filter
const search = document.getElementById("search");
search.addEventListener("keyup", (e) => {
  const cards = attraction_cards.children;

  const q = e.target.value.toLowerCase();
  Array.from(cards).forEach((card) => {
    // console.log(card.children[0].children[2].children[0].innerText)
    card.children[0].children[2].children[0].innerText
      .toLowerCase()
      .startsWith(q)
      ? (card.style.display = "")
      : (card.style.display = "none");
    // console.log(card.children[0].children[2].firstChild)
  });
});

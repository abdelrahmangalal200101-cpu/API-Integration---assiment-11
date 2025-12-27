const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".app-section");
const viewFullBtn = document.getElementById("view-full-button");
const dateInput = document.getElementById("apod-date-input");
const loadBtn = document.getElementById("load-date-btn");
const todayBtn = document.getElementById("today-apod-btn");
const loading = document.getElementById("apod-loading");
const apodImage = document.getElementById("apod-image");
const labeldate = document.getElementById("date-label");
const apodvideo = document.getElementById("apod-video");
const mediaOverlay = document.getElementById("media-overlay");
const launchesGrid = document.getElementById("launches-grid");
const featuredContainer = document.getElementById("featured-launch");
const planetCards = document.querySelectorAll(".planet-card");

// 1 - Show Tabs Task ---------------

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    const sectionId = this.dataset.section;

    for (let j = 0; j < sections.length; j++) {
      sections[j].classList.add("hidden");
    }

    document.getElementById(sectionId).classList.remove("hidden");

    for (let k = 0; k < navLinks.length; k++) {
      navLinks[k].classList.remove("bg-blue-500/10", "text-blue-400");
    }
    this.classList.add("bg-blue-500/10", "text-blue-400");
  });
}

// 2 - View Full Image In blank tab task -----------------

viewFullBtn.addEventListener("click", function () {
  if (apodImage.classList.contains("hidden")) return;

  const imageUrl = apodImage.src;
  const newTab = window.open("", "_blank");

  newTab.document.title = "Full Resolution Image";

  newTab.document.body.style.margin = "0";
  newTab.document.body.style.background = "black";
  newTab.document.body.style.display = "flex";
  newTab.document.body.style.alignItems = "center";
  newTab.document.body.style.justifyContent = "center";
  newTab.document.body.style.height = "100vh";

  newTab.document.body.innerHTML = `
    <img 
      src="${imageUrl}" 
      style="max-width:100%; max-height:100%; object-fit:contain;"
      alt="Full Resolution"
    />
  `;
});

// 3 - Nasa Apod APi -----------------------------------------------
function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

async function getApod(date = "") {
  try {
    showLoading();

    let url = `https://api.nasa.gov/planetary/apod?api_key=5od82Idewpge3ew6USnxh3snInd3VKlj9J78cEC7`;

    if (date) {
      url += `&date=${date}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed To Fetch APOD");
    }

    const data = await response.json();
    renderApod(data);
  } catch (error) {
    console.error(error);
  } finally {
    hideLoading();
  }
}

function getEmbedVideoUrl(url) {
  if (url.includes("youtube.com/watch")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  }

  if (url.includes("youtu.be")) {
    const videoId = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  }

  if (url.includes("vimeo.com")) {
    const videoId = url.split("vimeo.com/")[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  return url;
}

function renderApod(apod) {
  document.getElementById("apod-title").textContent = apod.title;
  document.getElementById("apod-explanation").textContent = apod.explanation;
  document.getElementById("apod-date-detail").textContent = apod.date;
  document.getElementById("apod-date-info").textContent = apod.date;
  document.getElementById("apod-media-type").textContent = apod.media_type;

  document.getElementById(
    "apod-date"
  ).textContent = `Astronomy Picture of the Day - ${apod.date}`;

  if (apod.media_type === "image") {
    apodImage.src = apod.hdurl || apod.url;
    apodImage.classList.remove("hidden");

    apodvideo.classList.add("hidden");
    apodvideo.src = "";

    viewFullBtn.classList.remove("hidden");
    viewFullBtn.disabled = false;
  } else if (apod.media_type === "video") {
    const embedUrl = getEmbedVideoUrl(apod.url);

    apodvideo.src = embedUrl;
    apodvideo.classList.remove("hidden");

    apodImage.classList.add("hidden");

    viewFullBtn.classList.add("hidden");
    mediaOverlay.classList.add("hidden");
  }
}

loadBtn.addEventListener("click", function () {
  const selected = dateInput.value;

  if (!selected) return;

  if (
    new Date(selected) < new Date("1995-06-16") ||
    new Date(selected) > new Date()
  ) {
    alert("Invalid date");
    return;
  }

  getApod(selected);
  labeldate.innerHTML = selected;
});

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

dateInput.addEventListener("change", function () {
  labeldate.textContent;
});
todayBtn.addEventListener("click", function () {
  const today = getTodayDate();
  getApod();
  labeldate.textContent = today;
  dateInput.value = today;
});

dateInput.addEventListener("change", function () {
  labeldate.textContent = dateInput.value;
});

document.addEventListener("DOMContentLoaded", function () {
  const today = getTodayDate();
  getApod();
  labeldate.textContent = today;
  dateInput.value = today;
});

// 4 - SpaceDevs Launches API ----------------------------

async function getUpcomingLaunches() {
  try {
    const response = await fetch(
      "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch launches");
    }

    const data = await response.json();
    const launches = data.results;

    renderFeaturedLaunch(launches[0]);
    renderLaunchCards(launches);
  } catch (error) {
    console.error(error);
  }
}

function renderFeaturedLaunch(launch) {
  featuredContainer.innerHTML = `
    <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
      <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                <i class="fas fa-star"></i>
                Featured Launch
              </span>
              <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                ${launch.status?.abbrev || "TBD"}
              </span>
            </div>
            <h3 class="text-3xl font-bold mb-3 leading-tight">
              ${launch.name}
            </h3>
            <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
              <div class="flex items-center gap-2">
                <i class="fas fa-building"></i>
                <span>${
                  launch.launch_service_provider?.name || "Unknown"
                }</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-rocket"></i>
                <span>${launch.rocket?.configuration?.name || "Unknown"}</span>
              </div>
            </div>
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
              <i class="fas fa-clock text-2xl text-blue-400"></i>
              <div>
                <p class="text-2xl font-bold text-blue-400">2</p>
                <p class="text-xs text-slate-400">Days Until Launch</p>
              </div>
            </div>
            <div class="grid xl:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-calendar"></i>
                  Launch Date
                </p>
                <p class="font-semibold">${launch.net || "TBD"}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-clock"></i>
                  Launch Time
                </p>
                <p class="font-semibold">${launch.window_start || "TBD"}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-map-marker-alt"></i>
                  Location
                </p>
                <p class="font-semibold text-sm">${
                  launch.pad?.name || "Unknown"
                }</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-globe"></i>
                  Country
                </p>
                <p class="font-semibold">${
                  launch.pad?.location?.country_code || "Unknown"
                }</p>
              </div>
            </div>
            <p class="text-slate-300 leading-relaxed mb-6">
              ${launch.mission?.description || "No description available"}
            </p>
          </div>
          <div class="flex flex-col md:flex-row gap-3">
            <button class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
              <i class="fas fa-info-circle"></i>
              View Full Details
            </button>
            <div class="icons self-end md:self-center">
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="far fa-heart"></i>
              </button>
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
            ${
              launch.image?.image_url
                ? `
              <img src="${launch.image.image_url}" alt="${launch.name}" class="w-full h-full object-cover" />
            `
                : `
              <div class="flex items-center justify-center h-full min-h-[400px] bg-slate-800">
                <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
              </div>
            `
            }
            <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLaunchCards(launches) {
  let cardsHTML = "";

  for (let i = 1; i < launches.length; i++) {
    const launch = launches[i];

    cardsHTML += `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
        <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
          ${
            launch.image?.image_url
              ? `
            <img src="${launch.image.image_url}" alt="${launch.name}" class="w-full h-full object-cover" />
          `
              : `
            <i class="fas fa-rocket text-5xl text-slate-700"></i>
          `
          }
          <div class="absolute top-3 right-3">
            <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
              ${launch.status?.abbrev || "TBD"}
            </span>
          </div>
        </div>
        <div class="p-5">
          <div class="mb-3">
            <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
              ${launch.name}
            </h4>
            <p class="text-sm text-slate-400 flex items-center gap-2">
              <i class="fas fa-building text-xs"></i>
              ${launch.launch_service_provider?.name || "Unknown"}
            </p>
          </div>
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-calendar text-slate-500 w-4"></i>
              <span class="text-slate-300">${launch.net || "TBD"}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-clock text-slate-500 w-4"></i>
              <span class="text-slate-300">${
                launch.window_start || "TBD"
              }</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-rocket text-slate-500 w-4"></i>
              <span class="text-slate-300">${
                launch.rocket?.configuration?.name || "Unknown"
              }</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
              <span class="text-slate-300 line-clamp-1">${
                launch.pad?.name || "Unknown"
              }</span>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
            <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
              Details
            </button>
            <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  launchesGrid.innerHTML = cardsHTML;
}

getUpcomingLaunches();

// 5 - Planets API -----------------------------

async function GetPlanets() {
  try {
    const response = await fetch(
      "https://solar-system-opendata-proxy.vercel.app/api/planets/"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch launches");
    }

    const data = await response.json();
    const Planets = data.bodies;
    setupPlanetCards(Planets);
  } catch (error) {
    console.error(error);
  }
}

function setupPlanetCards(planetsData) {
  for (let i = 0; i < planetCards.length; i++) {
    planetCards[i].addEventListener("click", () => {
      const planetId = planetCards[i].getAttribute("data-planet-id");

      let planet = null;
      for (let j = 0; j < planetsData.length; j++) {
        if (planetsData[j].id === planetId) {
          planet = planetsData[j];
        }
      }

      if (planet) {
        renderPlanet(planet);
      }
    });
  }
}


function renderPlanet(planet) {
  if (!planet) return;

  // ===== Basic Info =====
  document.getElementById("planet-detail-name").textContent = planet.englishName;
  document.getElementById("planet-detail-description").textContent = planet.description;
  document.getElementById("planet-detail-image").src = planet.image;
  document.getElementById("planet-detail-image").alt = planet.englishName;

  // ===== Stats =====
  document.getElementById("planet-distance").textContent = `${planet.semimajorAxis.toLocaleString()} km`;
  document.getElementById("planet-radius").textContent = `${planet.meanRadius.toLocaleString()} km`;
  document.getElementById("planet-mass").textContent = `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`;
  document.getElementById("planet-density").textContent = `${planet.density} g/cm³`;
  document.getElementById("planet-orbital-period").textContent = `${planet.sideralOrbit} days`;
  document.getElementById("planet-rotation").textContent = `${planet.sideralRotation} hours`;
  document.getElementById("planet-moons").textContent = planet.moons ? planet.moons.length : 0;
  document.getElementById("planet-gravity").textContent = `${planet.gravity} m/s²`;

  // ===== Discovery =====
  document.getElementById("planet-discoverer").textContent = planet.discoveredBy || "Unknown";
  document.getElementById("planet-discovery-date").textContent = planet.discoveryDate || "Unknown";
  document.getElementById("planet-body-type").textContent = planet.bodyType;
  document.getElementById("planet-volume").textContent = `${planet.vol.volValue} × 10^${planet.vol.volExponent} km³`;

  // ===== Orbital =====
  document.getElementById("planet-perihelion").textContent = `${planet.perihelion.toLocaleString()} km`;
  document.getElementById("planet-aphelion").textContent = `${planet.aphelion.toLocaleString()} km`;
  document.getElementById("planet-eccentricity").textContent = planet.eccentricity;
  document.getElementById("planet-inclination").textContent = `${planet.inclination}°`;
  document.getElementById("planet-axial-tilt").textContent = `${planet.axialTilt}°`;
  document.getElementById("planet-temp").textContent = `${planet.avgTemp} K`;
  document.getElementById("planet-escape").textContent = `${(planet.escape / 1000).toFixed(1)} km/s`;
}

GetPlanets();
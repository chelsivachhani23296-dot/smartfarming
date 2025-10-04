// Example: alert when section clicked
document.querySelectorAll('section').forEach(sec => {
    sec.addEventListener('click', () => {
        alert('You clicked on: ' + sec.querySelector('h2').innerText);
    });
});
// ---------- REPLACE THIS WITH YOUR OPENWEATHER API KEY ----------
const OPENWEATHER_API_KEY = "5a29bb6b559ce41a068d7c327c061487"; // <<-- paste your key here
// -----------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // WEATHER
  const defaultCity = "Surat";
  const cityInput = document.getElementById("cityInput");
  const getWeatherBtn = document.getElementById("getWeatherBtn");

  if (getWeatherBtn) {
    getWeatherBtn.addEventListener("click", () => {
      const city = cityInput && cityInput.value.trim() ? cityInput.value.trim() : defaultCity;
      getWeatherForCity(city);
    });
  }
  // initial load
  getWeatherForCity(defaultCity);

  // CROP ADVISOR
  const askBtn = document.getElementById("askAdvisorBtn");
  if (askBtn) askBtn.addEventListener("click", askAdvisor);

  // CHART (Crop Growth)
  initGrowthChart();

  // VOICE
  const voiceBtn = document.getElementById("voiceBtn");
  if (voiceBtn) voiceBtn.addEventListener("click", startVoice);

  // MARKET PRICE
  document.querySelectorAll(".priceBtn").forEach(btn => {
    btn.addEventListener("click", () => getPrice(btn.dataset.crop));
  });

  // IRRIGATION
  const soilInput = document.getElementById("soilInput");
  if (soilInput) {
    soilInput.addEventListener("input", () => {
      updateIrrigation( parseFloat(soilInput.value || 0) );
    });
    updateIrrigation(parseFloat(soilInput.value || 0));
  }

  // COMMUNITY
  const postBtn = document.getElementById("postCommentBtn");
  if (postBtn) postBtn.addEventListener("click", postComment);
});

// ---------------- WEATHER ----------------
async function getWeatherForCity(city) {
  const weatherCard = document.getElementById("weatherCard");
  const err = document.getElementById("weatherError");
  if (err) err.innerText = "";
  if (weatherCard) weatherCard.classList.add("hidden");

  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === "YOUR_API_KEY") {
    if (err) err.innerText = "API key missing. Paste your OpenWeatherMap key in script.js";
    return;
  }

  try {
    const url = https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric;
    const res = await fetch(url);
    if (!res.ok) {
      const j = await res.json().catch(()=>({message:res.statusText}));
      throw new Error(j.message || "Failed to fetch weather");
    }
    const data = await res.json();

    document.getElementById("cityName").innerText = ${data.name}, ${data.sys?.country || ""};
    document.getElementById("weatherDesc").innerText = Condition: ${data.weather[0].description};
    document.getElementById("temp").innerText = Temperature: ${data.main.temp} °C (feels like ${data.main.feels_like} °C);
    document.getElementById("humidity").innerText = Humidity: ${data.main.humidity}%;
    document.getElementById("wind").innerText = Wind: ${data.wind.speed} m/s;

    weatherCard.classList.remove("hidden");
  } catch (e) {
    const err = document.getElementById("weatherError");
    if (err) err.innerText = "Could not load weather: " + e.message;
    console.error(e);
  }
}

// ---------------- CROP ADVISOR ----------------
function cropAdvisorLogic(question) {
  const q = (question || "").toLowerCase();
  if (q.includes("wheat")) return "🌾 Wheat: Use balanced NPK, apply Urea at tillering.";
  if (q.includes("rice")) return "🍚 Rice: Prefer monsoon planting; water management is key.";
  if (q.includes("cotton")) return "🧵 Cotton: Prefers warm and dry climate; watch pests.";
  if (q.includes("fertilizer")) return "Use soil test recommendations for N-P-K doses.";
  return "Sorry, advice not available. Try keywords like 'wheat', 'rice', 'cotton', 'fertilizer'.";
}

function askAdvisor() {
  const q = document.getElementById("cropInput").value;
  const ans = cropAdvisorLogic(q);
  document.getElementById("cropAnswer").innerText = ans;
}

// ---------------- CHART (Crop Growth Monitoring) ----------------
function initGrowthChart() {
  const canvas = document.getElementById("growthChart");
  if (!canvas) return;
  // if Chart is not loaded, skip
  if (typeof Chart === "undefined") {
    console.warn("Chart.js not loaded. Add CDN <script src='https://cdn.jsdelivr.net/npm/chart.js'></script>'");
    return;
  }
  const ctx = canvas.getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Week 1","Week 2","Week 3","Week 4"],
      datasets: [{
        label: "Crop Height (cm)",
        data: [5, 12, 20, 30],
        borderWidth: 2,
        fill: false,
        borderColor: "green",
        tension: 0.2
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

// ---------------- VOICE ASSISTANT ----------------
function startVoice() {
  const el = document.getElementById("voiceText");
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Speech) {
    el && (el.innerText = "Browser does not support SpeechRecognition.");
    return;
  }
  const recognition = new Speech();
  recognition.lang = "en-IN";
  recognition.onresult = (event) => {
    const speech = event.results[0][0].transcript;
    el && (el.innerText = "You said: " + speech);
    // optional: pass to crop advisor
    const ans = cropAdvisorLogic(speech);
    // show answer below voice text (or integrate UI)
    const p = document.createElement("p");
    p.innerText = "Advisor: " + ans;
    el.parentNode.appendChild(p);
  };
  recognition.start();
}

// ---------------- MARKET PRICE ----------------
const prices = { wheat: "₹2200/quintal", rice: "₹3100/quintal", cotton: "₹5500/quintal" };
function getPrice(crop) {
  document.getElementById("priceOutput").innerText = crop + ": " + (prices[crop] || "Not available");
}

// ---------------- IRRIGATION ----------------
function irrigationAdvice(soilMoisture) {
  if (soilMoisture < 30) return "💧 Irrigation required!";
  return "✅ Soil moisture is fine.";
}
function updateIrrigation(value) {
  document.getElementById("irrigationResult").innerText = irrigationAdvice(value);
}

// ---------------- COMMUNITY ----------------
function postComment() {
  const text = document.getElementById("commentBox").value.trim();
  if (!text) return alert("Write a comment first.");
  const div = document.createElement("p");
  div.innerText = text;
  document.getElementById("comments").appendChild(div);
  document.getElementById("commentBox").value = "";
}
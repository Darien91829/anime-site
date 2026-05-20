/* ==========================================================================
   DYNAMIC INTEGRATED RUNTIME CONTROLLER LOGIC ENGINE
   ========================================================================== */
let currentAuthMode = 'login';

// Your active Samsung S20+ live server proxy route via Pinggy
const TUNNEL_URL = "https://tabti-2607-fb91-4bc-1c38-3ca8-a6e-3776-efad.run.pinggy-free.link/api/top-anime";

document.addEventListener('DOMContentLoaded', () => {
    loadAnimeAPI();
    initNavigationSystems();
    initSettingsEngine();
    initAuthenticationMatrix();
    applySavedConfigOnStartup();
});

// ==========================================
// SECTION A: LIVE TERMUX BACKEND AGGREGATOR
// ==========================================
async function loadAnimeAPI() {
  console.log("📡 Accessing live data matrix via Termux Pinggy tunnel...");
  try {
    const res = await fetch(TUNNEL_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`Server returned status: ${res.status}`);
    }

    const result = await res.json();
    const animeList = result.data;

    const grid = document.getElementById("animeGrid");
    if (!grid) {
      console.error("❌ Target element '#animeGrid' not found in your index.html");
      return;
    }
    
    grid.innerHTML = "";

    // Fallback if the scraping engine returns an empty data set
    if (!animeList || animeList.length === 0) {
      grid.innerHTML = `<div class="error-msg" style="color: #ff4757; text-align: center; width: 100%;">No streaming records found. Check your Termux console logs.</div>`;
      return;
    }

    // Maps the live scraped items into your visual cards structure
    animeList.forEach((anime) => {
      const posterImg = anime.image_url || 'https://via.placeholder.com/225x320?text=No+Poster';
      
      grid.innerHTML += `
        <div class="anime-card" data-url="${anime.url || '#'}">
            <div class="anime-poster" style="background-image: url('${posterImg}')"></div>
            <div class="anime-info">
                <div class="anime-title">${anime.title}</div>
                <div class="anime-rating"><i class="fas fa-play-circle"></i> ${anime.score}</div>
                <div class="anime-genres">Live Stream Matrix</div>
            </div>
        </div>
      `;
    });

    // Custom interactive streaming routers
    document.querySelectorAll(".anime-card").forEach((card) => {
      card.addEventListener("click", function () {
        const targetStream = this.getAttribute("data-url");
        const title = this.querySelector(".anime-title").textContent;
        
        if (targetStream && targetStream !== '#') {
          window.open(targetStream, '_blank');
        } else {
          alert(`Streaming mirrors generating for: ${title}...`);
        }
      });
    });

    console.log(`✅ Successfully loaded ${animeList.length} live anime cards into the DOM!`);

  } catch (err) {
    console.error("Critical API loading error exception parsed: ", err);
    const grid = document.getElementById("animeGrid");
    if (grid) {
      grid.innerHTML = `
        <div style="color: #ff4757; text-align: center; padding: 20px; font-weight: bold; width: 100%;">
          ⚠️ Connection Offline<br>
          <span style="font-size: 12px; font-weight: normal; color: #a4b0be;">
            Make sure your Samsung S20+ Termux server is running and your Pinggy URL is still active!
          </span>
        </div>
      `;
    }
  }
}

function initNavigationSystems() {
  // Core header categories tracker binding
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Sidebar selection mapping updates
  document.querySelectorAll(".sidebar-item").forEach((item) => {
    if(item.id === "sidebarSettingsTrigger" || item.id === "sidebarLoginTrigger") return;
    item.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".sidebar-item").forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Interactive video modal warning frames
  const alertPlay = () => alert("Initiating high-bitrate video container stream for One Punch Man!");
  document.getElementById("heroPlayBtn")?.addEventListener("click", (e) => { e.preventDefault(); alertPlay(); });
  document.getElementById("heroCirclePlayBtn")?.addEventListener("click", alertPlay);

  document.querySelectorAll(".popular-item").forEach((item) => {
    item.addEventListener("click", function () {
      const title = this.querySelector("h4").textContent;
      alert(`Opening verified collection feed matrix for: ${title}...`);
    });
  });
}

// ==========================================
// SECTION B: ARCHITECTURE SYSTEM CONTROL ENGINE
// ==========================================
function initSettingsEngine() {
    const modal = document.getElementById('settingsModal');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const resetBtn = document.getElementById('resetSettingsBtn');

    const triggerHeader = document.getElementById('headerSettingsTrigger');
    const triggerSidebar = document.getElementById('sidebarSettingsTrigger');

    if (triggerHeader) triggerHeader.addEventListener('click', () => modal.classList.add('open'));
    if (triggerSidebar) triggerSidebar.addEventListener('click', (e) => { e.preventDefault(); modal.classList.add('open'); });
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('settingTheme').value = 'default';
            document.getElementById('settingLeftSidebar').checked = true;
            document.getElementById('settingRightSidebar').checked = true;
            document.getElementById('settingHero').checked = true;
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const theme = document.getElementById('settingTheme').value;
            const showLeft = document.getElementById('settingLeftSidebar').checked;
            const showRight = document.getElementById('settingRightSidebar').checked;
            const showHero = document.getElementById('settingHero').checked;

            localStorage.setItem('da9_theme', theme);
            localStorage.setItem('da9_showLeft', showLeft);
            localStorage.setItem('da9_showRight', showRight);
            localStorage.setItem('da9_showHero', showHero);

            applyLiveLayoutStates(theme, showLeft, showRight, showHero);
            modal.classList.remove('open');
        });
    }
}

function applyLiveLayoutStates(theme, showLeft, showRight, showHero) {
    document.body.classList.remove('theme-default', 'theme-crimson', 'theme-cyberpunk', 'theme-frost');
    document.body.classList.add(`theme-${theme}`);

    const leftSide = document.getElementById('leftSidebar');
    if (leftSide) leftSide.classList.toggle('hide-panel', !(showLeft === true || showLeft === 'true'));

    const rightSide = document.getElementById('rightSidebar');
    if (rightSide) rightSide.classList.toggle('hide-panel', !(showRight === true || showRight === 'true'));

    const hero = document.getElementById('heroBanner');
    if (hero) hero.classList.toggle('hide-panel', !(showHero === true || showHero === 'true'));
}

function applySavedConfigOnStartup() {
    const savedTheme = localStorage.getItem('da9_theme') || 'default';
    const savedLeft = localStorage.getItem('da9_showLeft') !== 'false';
    const savedRight = localStorage.getItem('da9_showRight') !== 'false';
    const savedHero = localStorage.getItem('da9_showHero') !== 'false';

    document.getElementById('settingTheme').value = savedTheme;
    document.getElementById('settingLeftSidebar').checked = savedLeft;
    document.getElementById('settingRightSidebar').checked = savedRight;
    document.getElementById('settingHero').checked = savedHero;

    applyLiveLayoutStates(savedTheme, savedLeft, savedRight, savedHero);
}

// ==========================================
// SECTION C: INTERACTIVE IDENTITY PORTAL
// ==========================================
function initAuthenticationMatrix() {
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('closeAuthBtn');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');

    const profileTrigger = document.getElementById('headerProfileTrigger');
    const sidebarLoginTrigger = document.getElementById('sidebarLoginTrigger');

    if (profileTrigger) profileTrigger.addEventListener('click', (e) => { e.preventDefault(); openAuthInterface(); });
    if (sidebarLoginTrigger) sidebarLoginTrigger.addEventListener('click', (e) => { e.preventDefault(); openAuthInterface(); });
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function () {
            const passwordInput = document.getElementById('authPassword');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }
    checkExistingUserSession();
}

function openAuthInterface() {
    if (localStorage.getItem('da9_userSession')) {
        if (confirm('🔒 Sign Out from your current dude9anime profile account session?')) {
            localStorage.removeItem('da9_userSession');
            location.reload();
        }
        return;
    }
    document.getElementById('authModal').classList.add('open');
}

function switchAuthMode(mode) {
    currentAuthMode = mode;
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const usernameField = document.getElementById('usernameField');
    const submitBtn = document.getElementById('authSubmitBtn');
    const alertBox = document.getElementById('authAlert');

    alertBox.style.display = 'none';

    if (mode === 'register') {
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        usernameField.style.display = 'block';
        document.getElementById('authUsername').required = true;
        submitBtn.textContent = 'Register Core Profile';
    } else {
        tabRegister.classList.remove('active');
        tabLogin.classList.add('active');
        usernameField.style.display = 'none';
        document.getElementById('authUsername').required = false;
        submitBtn.textContent = 'Access Dashboard';
    }
}

function handleAuthSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const alertBox = document.getElementById('authAlert');

    alertBox.style.display = 'block';
    alertBox.className = 'auth-alert'; 

    if (currentAuthMode === 'register') {
        const username = document.getElementById('authUsername').value.trim();
        if (password.length < 6) {
            alertBox.classList.add('error');
            alertBox.textContent = '❌ Security key error: Passwords must be at least 6 tokens long.';
            return;
        }

        localStorage.setItem('da9_savedUser', username);
        localStorage.setItem('da9_savedEmail', email);
        localStorage.setItem('da9_savedPass', password);

        alertBox.classList.add('success');
        alertBox.textContent = '✨ Profile created! Redirecting to credentials console...';
        setTimeout(() => { switchAuthMode('login'); }, 1500);
    } else {
        const savedEmail = localStorage.getItem('da9_savedEmail') || 'admin@dude9anime.com';
        const savedPass = localStorage.getItem('da9_savedPass') || 'password123';
        const savedUser = localStorage.getItem('da9_savedUser') || 'SaitamaFan';

        if (email === savedEmail && password === savedPass) {
            alertBox.classList.add('success');
            alertBox.textContent = `🚀 Verification Complete. Welcome back, ${savedUser}!`;
            localStorage.setItem('da9_userSession', savedUser);
            setTimeout(() => {
                document.getElementById('authModal').classList.remove('open');
                checkExistingUserSession();
            }, 1200);
        } else {
            alertBox.classList.add('error');
            alertBox.textContent = '❌ Credentials error: Invalid structural parameters matching execution sequence.';
        }
    }
}

function checkExistingUserSession() {
    const userSession = localStorage.getItem('da9_userSession');
    const sidebarLoginTrigger = document.getElementById('sidebarLoginTrigger');
    const profileIcon = document.getElementById('headerProfileTrigger');

    if (userSession) {
        if (sidebarLoginTrigger) {
            sidebarLoginTrigger.innerHTML = `<i class="fas fa-sign-out-alt"></i> Sign Out (${userSession})`;
            sidebarLoginTrigger.style.color = 'var(--accent-green)';
        }
        if (profileIcon) {
            profileIcon.className = "fas fa-user-check";
            profileIcon.style.color = "var(--accent-green)";
            profileIcon.title = `Active Session: ${userSession}`;
        }
    }
}

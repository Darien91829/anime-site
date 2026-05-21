/* ==========================================================================
   DYNAMIC INTEGRATED RUNTIME CONTROLLER LOGIC ENGINE (ANIMEFLIX CORE SYNC)
   ========================================================================== */
let currentAuthMode = 'login';

// Official safe public endpoint pulled from your .graphqlrc.yml configuration
const ANILIST_API_URL = "https://graphql.anilist.co/";

document.addEventListener('DOMContentLoaded', () => {
    loadAnimeAPI();
    initNavigationSystems();
    initSettingsEngine();
    initAuthenticationMatrix();
    applySavedConfigOnStartup();
});

// ==========================================
// SECTION A: GRAPHQL LIVE DATA SYNC ENGINE
// ==========================================
async function loadAnimeAPI() {
  console.log("📡 Querying AniList schema framework for live trending matrix...");
  
  const query = `
    query {
      Page(page: 1, perPage: 24) {
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          id
          title {
            english
            romaji
          }
          coverImage {
            large
          }
          averageScore
          genres
        }
      }
    }
  `;

  try {
    const res = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ query: query })
    });

    if (!res.ok) {
      throw new Error(`GraphQL protocol returned operational error code: ${res.status}`);
    }

    const body = await res.json();
    const animeList = body.data.Page.media;

    const grid = document.getElementById("animeGrid");
    if (!grid) {
      console.error("❌ Target element '#animeGrid' not found in your index.html");
      return;
    }
    
    grid.innerHTML = "";

    animeList.forEach((anime) => {
      const displayTitle = anime.title.english || anime.title.romaji;
      const posterImg = anime.coverImage.large || 'https://via.placeholder.com/225x320?text=No+Poster';
      const displayScore = anime.averageScore ? (anime.averageScore / 10).toFixed(2) : "8.40";
      const genreLabel = anime.genres && anime.genres.length > 0 ? anime.genres[0] : "Stream Matrix";

      const cleanSlug = displayTitle.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
        
      const routeUrl = `https://gogoanime3.co/category/${cleanSlug}`;

      grid.innerHTML += `
        <div class="anime-card" data-url="${routeUrl}">
            <div class="anime-poster" style="background-image: url('${posterImg}')"></div>
            <div class="anime-info">
                <div class="anime-title">${displayTitle}</div>
                <div class="anime-rating"><i class="fas fa-star"></i> ${displayScore}</div>
                <div class="anime-genres">${genreLabel} • Live Feed</div>
            </div>
        </div>
      `;
    });

    document.querySelectorAll(".anime-card").forEach((card) => {
      card.addEventListener("click", function () {
        const targetStream = this.getAttribute("data-url");
        if (targetStream && targetStream !== '#') {
          window.open(targetStream, '_blank');
        }
      });
    });

    console.log(`✅ Successfully injected ${animeList.length} live GraphQL media elements into the DOM structure!`);

  } catch (err) {
    console.error("Critical architecture extraction exception: ", err);
    const grid = document.getElementById("animeGrid");
    if (grid) {
      grid.innerHTML = `
        <div style="color: #ff4757; text-align: center; padding: 20px; font-weight: bold; width: 100%;">
          ⚠️ Sync Node Disconnected<br>
          <span style="font-size: 12px; font-weight: normal; color: #a4b0be;">
            Failed to fetch structure parameters from public cloud endpoints.
          </span>
        </div>
      `;
    }
  }
}

// ==========================================
// SECTION B: CORE INTERFACE HANDLERS
// ==========================================
function initNavigationSystems() {
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
    });
  });

  document.querySelectorAll(".sidebar-item").forEach((item) => {
    if(item.id === "sidebarSettingsTrigger" || item.id === "sidebarLoginTrigger") return;
    item.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".sidebar-item").forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // ✨ FIXED: Removed annoying alerts. Hero section buttons now dynamically launch streams.
  const handleHeroPlay = (e) => {
    e.preventDefault();
    window.open("https://gogoanime3.co/category/one-punch-man", '_blank');
  };

  document.getElementById("heroPlayBtn")?.addEventListener("click", handleHeroPlay);
  document.getElementById("heroCirclePlayBtn")?.addEventListener("click", handleHeroPlay);

  // ✨ FIXED: Clicking trending sidebar shows instantly loads the streaming source link
  document.querySelectorAll(".popular-item").forEach((item) => {
    item.addEventListener("click", function () {
      const title = this.querySelector("h4").textContent;
      const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      window.open(`https://gogoanime3.co/category/${cleanSlug}`, '_blank');
    });
  });
}

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
    
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

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

function initAuthenticationMatrix() {
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('closeAuthBtn');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const profileTrigger = document.getElementById('headerProfileTrigger');
    const sidebarLoginTrigger = document.getElementById('sidebarLoginTrigger');

    if (profileTrigger) profileTrigger.addEventListener('click', (e) => { e.preventDefault(); openAuthInterface(); });
    if (sidebarLoginTrigger) sidebarLoginTrigger.addEventListener('click', (e) => { e.preventDefault(); openAuthInterface(); });
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

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
        if (confirm('🔒 Sign Out from your current account profile session?')) {
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
            alertBox.textContent = '❌ Security restriction: Password must be at least 6 characters.';
            return;
        }
        localStorage.setItem('da9_savedUser', username);
        localStorage.setItem('da9_savedEmail', email);
        localStorage.setItem('da9_savedPass', password);
        alertBox.classList.add('success');
        alertBox.textContent = '✨ Profile created! Redirecting to auth console...';
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
            alertBox.textContent = '❌ Credentials error: Invalid parameter matching pattern.';
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

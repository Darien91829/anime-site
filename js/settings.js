// js/settings.js
// Handles opening/closing panels and updating platform structural states in real-time

document.addEventListener('DOMContentLoaded', () => {
    initSettingsInterface();
    applySavedConfigOnStartup();
});

function initSettingsInterface() {
    const modal = document.getElementById('settingsModal');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const resetBtn = document.getElementById('resetSettingsBtn');

    const triggerHeader = document.getElementById('headerSettingsTrigger');
    const triggerSidebar = document.getElementById('sidebarSettingsTrigger');

    if (triggerHeader) triggerHeader.addEventListener('click', () => modal.classList.add('open'));
    if (triggerSidebar) triggerSidebar.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
    });

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
    if (theme === 'high-contrast') {
        document.body.classList.add('high-contrast-theme');
    } else {
        document.body.classList.remove('high-contrast-theme');
    }

    const leftSide = document.getElementById('leftSidebar');
    if (leftSide) {
        if (showLeft === true || showLeft === 'true') {
            leftSide.classList.remove('hide-panel');
        } else {
            leftSide.classList.add('hide-panel');
        }
    }

    const rightSide = document.getElementById('rightSidebar');
    if (rightSide) {
        if (showRight === true || showRight === 'true') {
            rightSide.classList.remove('hide-panel');
        } else {
            rightSide.classList.add('hide-panel');
        }
    }

    const hero = document.getElementById('heroBanner');
    if (hero) {
        if (showHero === true || showHero === 'true') {
            hero.classList.remove('hide-panel');
        } else {
            hero.classList.add('hide-panel');
        }
    }
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

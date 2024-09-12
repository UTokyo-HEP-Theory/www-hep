document.addEventListener("DOMContentLoaded", function() {
    loadHeader();

    function loadHeader() {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.querySelector('header').innerHTML = data;
                addLanguageSwitchButtons();
            })
            .catch(error => console.error('Error loading header:', error));
    }

    function addLanguageSwitchButtons() {
        const languageSwitchContainer = document.getElementById('language-switch');
        if (!languageSwitchContainer) return;

        const url = new URL(window.location.href);
        const pathParts = url.pathname.split('/');
        const supportedLanguages = ['en', 'ja'];
        let currentLang = pathParts[1];
        if (!supportedLanguages.includes(currentLang)) {
            currentLang = 'en';
        }

        const targetLang = currentLang === 'en' ? 'ja' : 'en';
        let newPathParts = [...pathParts];
        if (supportedLanguages.includes(newPathParts[1])) {
            newPathParts[1] = targetLang;
        } else {
            newPathParts.splice(1, 0, targetLang);
        }
        const newPath = newPathParts.join('/');
        const newUrl = new URL(newPath, url.origin);

        // Create Japanese button
        const jpButton = document.createElement('button');
        jpButton.textContent = '日本語';
        jpButton.className = 'lang-button';
        if (currentLang !== 'ja') {
            jpButton.onclick = () => window.location.href = newUrl.toString().replace('/en/', '/ja/');
        } else {
            jpButton.classList.add('current-lang');
        }

        // Create English button
        const enButton = document.createElement('button');
        enButton.textContent = 'English';
        enButton.className = 'lang-button';
        if (currentLang !== 'en') {
            enButton.onclick = () => window.location.href = newUrl.toString().replace('/ja/', '/en/');
        } else {
            enButton.classList.add('current-lang');
        }

        // Append buttons to the container
        languageSwitchContainer.appendChild(jpButton);
        languageSwitchContainer.appendChild(enButton);
    }
});

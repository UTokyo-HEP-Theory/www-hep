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

        const supportedLanguages = ['en', 'ja'];
        const url = new URL(window.location.href);
        
        // 正規表現を使用して言語コードを検出
        const langRegex = new RegExp(`/(${supportedLanguages.join('|')})(/|$)`);
        const match = url.pathname.match(langRegex);

        console.log('URL Pathname:', url.pathname); // デバッグ用ログ
        console.log('Match Result:', match); // デバッグ用ログ
        
        let currentLang = 'en'; // デフォルトの言語を設定
        if (match) {
            currentLang = match[1];
        }
        
        const targetLang = currentLang === 'en' ? 'ja' : 'en';
        
        // 新しいパスを生成
        let newPath;
        if (match) {
            newPath = url.pathname.replace(langRegex, `/${targetLang}$2`);
        } else {
            newPath = url.pathname.replace(/^\/?/, `/${targetLang}/`); //多分意味ないfallback
        }
        const newUrl = new URL(newPath, url.origin);

        console.log('New URL:', newUrl.toString()); // デバッグ用ログ

        // Contains the language buttons
        const langButtonContainer = document.createElement('div');
        langButtonContainer.className = 'lang-button-container';

        // 日本語ボタンを作成
        const jpButton = document.createElement('button');
        jpButton.textContent = '日本語';
        jpButton.className = 'lang-button';
        if (currentLang === 'ja') {
            jpButton.classList.add('current-lang');
        } else {
            jpButton.onclick = () => window.location.href = newUrl.toString();
        }
        
        // 英語ボタンを作成
        const enButton = document.createElement('button');
        enButton.textContent = 'English';
        enButton.className = 'lang-button';
        if (currentLang === 'en') {
            enButton.classList.add('current-lang');
        } else {
            enButton.onclick = () => window.location.href = newUrl.toString();
        }

        // ボタンをコンテナに追加
        langButtonContainer.appendChild(jpButton);
        langButtonContainer.appendChild(enButton);

        // コンテナをヘッダーに追加
        const header = document.querySelector('header');
        header.appendChild(langButtonContainer);

        // ボタンをヘッダーに追加
        //const header = document.querySelector('header');
        //header.appendChild(jpButton);
        //header.appendChild(enButton);
    }
});

const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your DeepL API key (Free: ends with :fx, Pro: without :fx) https://www.deepl.com/your-account/keys

function mapDeepLLang(lang, isTarget) {
    if (!lang) return '';
    let code = lang.toUpperCase();
    if (code === 'ZH-CN' || code === 'ZH') return isTarget ? 'ZH-HANS' : 'ZH';
    if (code === 'ZH-TW') return isTarget ? 'ZH-HANT' : 'ZH';
    if (code === 'EN' && isTarget) return 'EN-US';
    if (code === 'PT' && isTarget) return 'PT-PT';
    return code;
}

function translate(text, from, to) {
    console.log('Start translate (DeepL API):', text, 'from:', from, 'to:', to);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY.trim() === '') {
        proxy.setFailed('Please set your DeepL API key in deepl_api.js');
        return;
    }

    // Auto-detect Free vs Pro endpoint based on key format (:fx suffix)
    const isFreeKey = API_KEY.endsWith(':fx');
    const apiUrl = isFreeKey
        ? 'https://api-free.deepl.com/v2/translate'
        : 'https://api.deepl.com/v2/translate';

    const targetLang = mapDeepLLang(to, true);
    const sourceLang = mapDeepLLang(from, false);

    const requestBody = {
        text: [text],
        target_lang: targetLang
    };

    if (sourceLang && sourceLang !== 'AUTO') {
        requestBody.source_lang = sourceLang;
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `DeepL-Auth-Key ${API_KEY}`
        },
        body: JSON.stringify(requestBody)
    })
    .then(async response => {
        if (!response.ok) {
            let errorDetail = response.statusText;
            try {
                const errJson = await response.json();
                if (errJson && errJson.message) {
                    errorDetail = errJson.message;
                }
            } catch (e) {}
            console.error('Error from DeepL API:', response.status, errorDetail);
            proxy.setFailed(`DeepL API Error (${response.status}): ${errorDetail}`);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;

        if (data.translations && data.translations.length > 0) {
            const translatedText = data.translations.map(t => t.text).join('\n').trim();
            console.log('Translated text (DeepL API):', translatedText);
            proxy.setTranslated(translatedText);
        } else {
            console.error('Unexpected response from DeepL API:', data);
            proxy.setFailed('Unexpected response from DeepL API');
        }
    })
    .catch(error => {
        console.error('Error fetching from DeepL API:', error);
        proxy.setFailed(`Error fetching from DeepL API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}

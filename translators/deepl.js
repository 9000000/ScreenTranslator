var lastText = '';
var active = window.location.href !== "about:blank";

function extractDeepLText() {
    let area = document.querySelector('div#target-dummydiv');
    if (area && area.innerHTML.trim()) return area.innerHTML.trim();

    let selectors = [
        'd-textarea.lmt__target_textarea p',
        'd-textarea[data-testid=translator-target-input] p',
        'div[data-testid="translator-target-input"] p',
        'div[aria-labelledby="target-heading"] p',
        'p.dense-output-paragraph',
        '.lmt__target_textarea'
    ];

    for (let i = 0; i < selectors.length; i++) {
        let el = document.querySelector(selectors[i]);
        if (el && el.innerText && el.innerText.trim()) {
            return el.innerText.trim();
        }
    }
    return '';
}

function checkFinished() {
    if (!active) return;

    let text = extractDeepLText();
    if (text === lastText || text === '')
        return;

    console.log('translated text (DeepL Web):', text, 'old:', lastText);
    lastText = text;
    active = false;
    proxy.setTranslated(text);
}

function translate(text, from, to) {
    console.log('Start translate (DeepL Web):', text, 'from:', from, 'to:', to);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    from = (from === 'zh-CN' || from === 'zh-TW') ? 'zh' : from;
    to = (to === 'zh-CN' || to === 'zh-TW') ? 'zh' : to;

    let supported = [
        'ar', 'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr',
        'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nb', 'no', 'nl', 'pl',
        'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh'
    ];

    if (from && supported.indexOf(from) === -1) {
        proxy.setFailed('Source language (' + from + ') not supported by DeepL');
        return;
    }
    if (supported.indexOf(to) === -1) {
        proxy.setFailed('Target language (' + to + ') not supported by DeepL');
        return;
    }

    active = true;
    var singleLineText = text.replace(/(?:\r\n|\r|\n)/g, ' ');
    let srcLang = from ? from : 'auto';
    let langs = srcLang + '/' + to + '/';

    if (window.location.href.indexOf('deepl.com/translator') !== -1
        && window.location.href.indexOf(langs) !== -1) {

        var input = document.querySelector('d-textarea[dl-test=translator-source-input] p')
            || document.querySelector('d-textarea.lmt__source_textarea p')
            || document.querySelector('d-textarea[data-testid=translator-source-input] p')
            || document.querySelector('div[data-testid="translator-source-input"] p');

        if (input) {
            if (input.innerText === singleLineText) {
                console.log('using cached result');
                lastText = '';
                return;
            }
            input.innerText = singleLineText;
            var areaCopy = document.querySelector('div#source-dummydiv');
            if (areaCopy)
                areaCopy.innerHTML = singleLineText;
            setTimeout(function () {
                input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
            }, 300);
            return;
        }
    }

    let url = 'https://www.deepl.com/translator#' + langs + encodeURIComponent(singleLineText);
    console.log("setting url", url);
    window.location = url;
}

function init() {
    proxy.translate.connect(translate);
    setInterval(checkFinished, 300);
}

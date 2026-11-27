var lastText = '';
var active = window.location.href !== "about:blank";

function extractDeepLText() {
    let area = document.querySelector('div#target-dummydiv');
    if (area) {
        let dummyText = (area.innerText || area.textContent || '').trim();
        if (dummyText) return dummyText;
    }

    let selectors = [
        'd-textarea.lmt__target_textarea p',
        'd-textarea[data-testid=translator-target-input] p',
        'div[data-testid="translator-target-input"] p',
        'div[aria-labelledby="target-heading"] p',
        'p.dense-output-paragraph',
        '.lmt__target_textarea'
    ];

    for (let i = 0; i < selectors.length; i++) {
        let els = document.querySelectorAll(selectors[i]);
        if (els.length > 0) {
            let text = [].slice.call(els).map(function (el) {
                return (el.innerText || el.textContent || '').trim();
            }).filter(Boolean).join('\n').trim();
            if (text) return text;
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

    if (!text || text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    from = (from === 'zh-CN' || from === 'zh-TW') ? 'zh' : from;
    to = (to === 'zh-CN' || to === 'zh-TW') ? 'zh' : to;

    let supported = [
        'ar', 'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr',
        'he', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nb', 'no', 'nl',
        'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'uk', 'vi', 'zh'
    ];

    if (from && from !== 'auto' && supported.indexOf(from) === -1) {
        proxy.setFailed('Source language (' + from + ') not supported by DeepL');
        return;
    }
    if (supported.indexOf(to) === -1) {
        proxy.setFailed('Target language (' + to + ') not supported by DeepL');
        return;
    }

    var singleLineText = text.replace(/(?:\r\n|\r|\n)/g, ' ');
    let srcLang = (from && from !== 'auto') ? from : 'auto';
    let langs = srcLang + '/' + to + '/';

    if (window.location.href.indexOf('deepl.com/translator') !== -1
        && window.location.href.indexOf(langs) !== -1) {

        var input = document.querySelector('d-textarea[dl-test=translator-source-input] p')
            || document.querySelector('d-textarea.lmt__source_textarea p')
            || document.querySelector('d-textarea[data-testid=translator-source-input] p')
            || document.querySelector('div[data-testid="translator-source-input"] p');

        if (input) {
            active = true;
            if (input.innerText === singleLineText) {
                console.log('using cached result');
                lastText = '';
                return;
            }
            input.innerText = singleLineText;
            var areaCopy = document.querySelector('div#source-dummydiv');
            if (areaCopy)
                areaCopy.textContent = singleLineText;
            setTimeout(function () {
                input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
            }, 300);
            return;
        }
    }

    active = false;
    lastText = '';
    let url = 'https://www.deepl.com/translator#' + langs + encodeURIComponent(singleLineText);
    console.log("setting url", url);
    window.location = url;
}

function init() {
    proxy.translate.connect(translate);
    setInterval(checkFinished, 300);
}

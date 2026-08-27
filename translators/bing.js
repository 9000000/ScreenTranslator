var lastText = '';
var active = window.location.href !== "about:blank";

function extractBingText() {
    let area = document.querySelector('#tta_output_ta')
        || document.querySelector('div#tta_output_ta')
        || document.querySelector('.tta_output_ta');

    if (!area) return '';

    let text = (area.value !== undefined ? area.value : area.innerText) || '';
    return text.trim();
}

function checkFinished() {
    if (!active) return;

    let text = extractBingText();
    if (text === lastText || text === lastText + ' ...' || text === '' || text === '...')
        return;

    console.log('translated text (Bing Web):', text, 'old:', lastText);
    lastText = text;
    active = false;
    proxy.setTranslated(text);
}

function mapBingLang(lang) {
    if (lang === 'zh-CN') return 'zh-Hans';
    if (lang === 'zh-TW') return 'zh-Hant';
    return lang;
}

function translate(text, from, to) {
    console.log('Start translate (Bing Web):', text, 'from:', from, 'to:', to);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    active = true;
    let targetLang = mapBingLang(to);
    let srcLang = from ? mapBingLang(from) : 'auto-detect';

    if (window.location.href.indexOf('bing.com/translator') !== -1
        && window.location.href.indexOf('to=' + targetLang) !== -1) {
        var input = document.querySelector('textarea#tta_input_ta') || document.querySelector('.tta_input_ta');
        if (input) {
            if (input.value === text) {
                console.log('using cached result');
                lastText = '';
                return;
            }
            input.value = text;
            input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
            return;
        }
    }

    let url = 'https://www.bing.com/translator/?from=' + srcLang + '&to=' + targetLang + '&text=' + encodeURIComponent(text);
    console.log("setting url", url);
    window.location = url;
}

function init() {
    proxy.translate.connect(translate);
    setInterval(checkFinished, 300);
}

var lastText = '';
var active = window.location.href !== "about:blank";

function getText() {
    let spans = document.querySelectorAll('#txtTarget span, #target-wrapper span, .target_area span');
    if (spans.length > 0) {
        let text = [].slice.call(spans).reduce(function (res, i) {
            return res + i.innerText + ' ';
        }, '').trim();
        if (text) return text;
    }

    let targetDiv = document.querySelector('#txtTarget') || document.querySelector('.target_area');
    if (targetDiv && targetDiv.innerText && targetDiv.innerText.trim()) {
        return targetDiv.innerText.trim();
    }

    return '';
}

function checkFinished() {
    if (!active) return;

    let text = getText();
    if (text === lastText || text === lastText + '...' || text === '')
        return;

    active = false;
    setTimeout(function () {
        text = getText();
        console.log('translated text (Papago Web):', text, 'old:', lastText);
        lastText = text;
        active = false;
        proxy.setTranslated(text);
    }, 1000);
}

function translate(text, from, to) {
    console.log('Start translate (Papago Web):', text, 'from:', from, 'to:', to);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    let supported = ['ko', 'ru', 'en', 'fr', 'pt', 'th', 'ja',
        'zh-CN', 'zh-TW', 'de', 'it', 'id', 'es', 'vi', 'hi'];

    if (from && supported.indexOf(from) === -1) {
        proxy.setFailed('Source language (' + from + ') not supported by Papago');
        return;
    }
    if (supported.indexOf(to) === -1) {
        proxy.setFailed('Target language (' + to + ') not supported by Papago');
        return;
    }

    lastText = getText();
    active = true;
    let targetLang = to;
    let srcLang = from ? from : 'auto';
    let langs = '?sk=' + srcLang + '&tk=' + targetLang + '&';

    if (window.location.href.indexOf('papago.naver.com') !== -1
        && window.location.href.indexOf(langs) !== -1) {
        var input = document.querySelector('textarea#txtSource') || document.querySelector('.source_area textarea');
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

    let url = 'https://papago.naver.com/?sk=' + srcLang + '&tk=' + targetLang + '&st=' + encodeURIComponent(text);
    console.log("setting url", url);
    window.location = url;
}

function init() {
    proxy.translate.connect(translate);
    setInterval(checkFinished, 300);
}

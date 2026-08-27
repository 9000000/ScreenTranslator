var lastText = '';
var active = window.location.href !== "about:blank";

function extractYandexText() {
    let spans = document.querySelectorAll('span.translation-word, span.translation-chunk, #translation span, [data-compl-item], div.translated-text span');
    if (spans.length > 0) {
        let text = [].slice.call(spans).reduce(function (res, i) {
            return res + (i.innerText || '');
        }, '').trim();
        if (text) return text;
    }

    let translationDiv = document.querySelector('#translation') || document.querySelector('.translated-text');
    if (translationDiv && translationDiv.innerText && translationDiv.innerText.trim()) {
        return translationDiv.innerText.trim();
    }

    return '';
}

function checkFinished() {
    if (!active) return;

    let text = extractYandexText();
    if (text === lastText || text === '')
        return;

    console.log('translated text (Yandex Web):', text, 'old:', lastText);
    lastText = text;
    active = false;
    proxy.setTranslated(text);
}

function translate(text, from, to) {
    console.log('Start translate (Yandex Web):', text, 'from:', from, 'to:', to);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    active = true;
    let langs = from ? ('lang=' + from + '-' + to) : ('lang=' + to);
    let url = 'https://translate.yandex.ru/?' + langs + '&text=' + encodeURIComponent(text);

    if (window.location.href === url) {
        console.log('using cached result');
        lastText = '';
        return;
    }

    console.log("setting url", url);
    window.location = url;
}

function init() {
    proxy.translate.connect(translate);
    setInterval(checkFinished, 300);
}

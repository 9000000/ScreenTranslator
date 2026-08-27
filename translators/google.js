var lastText = '';
var active = window.location.href !== "about:blank";

function extractGoogleText() {
    let spans = document.querySelectorAll('span.HwtZe span.ryNqvb, span.HwtZe > span > span, span.ryNqvb');
    if (spans.length > 0) {
        let text = [].slice.call(spans).map(function (s) { return s.innerText; }).join('');
        if (text.trim()) return text.trim();
    }
    let container = document.querySelector('span.HwtZe') || document.querySelector('div[jsname="W297wb"]');
    if (container && container.innerText.trim()) {
        return container.innerText.trim();
    }
    return '';
}

function checkFinished() {
    if (!active) return;

    let text = extractGoogleText();
    if (text === lastText || text === '')
        return;

    console.log('translated text (Google Web):', text, 'old:', lastText);
    lastText = text;
    active = false;
    proxy.setTranslated(text);
}

function translate(text, from, to) {
    console.log('Start translate (Google Web):', text, 'from:', from, 'to:', to);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    active = true;
    let sl = from ? from : 'auto';
    let tl = to ? to : 'en';

    if (window.location.href.indexOf('translate.google') !== -1
        && window.location.href.indexOf('tl=' + tl) !== -1) {
        var input = document.querySelector('textarea.er8xn') || document.querySelector('textarea[aria-label="Source text"]') || document.querySelector('textarea[jsname="BJE2fc"]');
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

    let url = 'https://translate.google.com/?sl=' + sl + '&tl=' + tl + '&text=' + encodeURIComponent(text) + '&op=translate';
    console.log("setting url", url);
    window.location = url;
}

function init() {
    proxy.translate.connect(translate);
    setInterval(checkFinished, 300);
}

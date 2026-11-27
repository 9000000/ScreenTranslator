var lastText = '';
var active = window.location.href !== 'about:blank';
var sameTextTicks = 0;

function isPlaceholder(text) {
    var trimmed = text.trim();
    if (!trimmed) return true;
    return trimmed === '...'
        || trimmed === '…'
        || /^translating(\.\.\.|…)?$/i.test(trimmed)
        || /^đang dịch(\.\.\.|…)?$/i.test(trimmed);
}

function extractGoogleText() {
    var selectors = [
        'span.HwtZe span.ryNqvb',
        'span.HwtZe > span > span',
        'span.ryNqvb'
    ];
    for (var i = 0; i < selectors.length; i++) {
        var spans = document.querySelectorAll(selectors[i]);
        if (spans.length > 0) {
            var text = [].slice.call(spans).map(function (s) {
                return s.innerText || s.textContent || '';
            }).join('').trim();
            if (text && !isPlaceholder(text)) {
                return text;
            }
        }
    }

    var container = document.querySelector('span.HwtZe') || document.querySelector('div[jsname="W297wb"]');
    if (container) {
        var containerText = (container.innerText || container.textContent || '').trim();
        if (containerText && !isPlaceholder(containerText)) {
            return containerText;
        }
    }
    return '';
}

function checkBlockedPage() {
    var host = window.location.hostname || '';
    var path = window.location.pathname || '';
    if (host.indexOf('consent.google.') !== -1 || path.indexOf('/sorry') === 0) {
        active = false;
        console.error('Google Web blocked or requires consent:', window.location.href);
        proxy.setFailed('Google Translate web requires consent or verification');
        return true;
    }
    return false;
}

function checkFinished() {
    if (!active) return;
    if (checkBlockedPage()) return;

    var text = extractGoogleText();
    if (text === '') return;

    if (text === lastText) {
        sameTextTicks++;
        // Allow emitting identical translation after ~2.4s if source changed slightly but translated text stayed the same
        if (sameTextTicks < 8) return;
    }

    console.log('translated text (Google Web):', text, 'old:', lastText);
    lastText = text;
    sameTextTicks = 0;
    active = false;
    proxy.setTranslated(text);
}

function setTextareaValue(input, value) {
    var proto = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
    if (proto && proto.set) {
        proto.set.call(input, value);
    } else {
        input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}

function translate(text, from, to) {
    console.log('Start translate (Google Web):', text, 'from:', from, 'to:', to);

    if (!text || text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    var sl = from ? from : 'auto';
    var tl = to ? to : 'en';
    sameTextTicks = 0;

    if (window.location.hostname && window.location.hostname.indexOf('translate.google.') !== -1) {
        var params = new URLSearchParams(window.location.search);
        if (params.get('sl') === sl && params.get('tl') === tl) {
            var input = document.querySelector('textarea.er8xn')
                || document.querySelector('textarea[aria-label="Source text"]')
                || document.querySelector('textarea[jsname="BJE2fc"]');
            if (input) {
                active = true;
                if (input.value === text) {
                    console.log('using cached result');
                    lastText = '';
                    return;
                }
                setTextareaValue(input, text);
                return;
            }
        }
    }

    // Pause polling on current page while navigating to avoid returning stale text
    active = false;
    lastText = '';
    var url = 'https://translate.google.com/?sl=' + encodeURIComponent(sl)
        + '&tl=' + encodeURIComponent(tl)
        + '&text=' + encodeURIComponent(text)
        + '&op=translate';
    console.log('setting url', url);
    window.location = url;
}

function init() {
    proxy.translate.connect(translate);
    setInterval(checkFinished, 300);
}

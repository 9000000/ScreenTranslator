var lastText = '';
var active = window.location.href !== "about:blank";

function mapBaiduLang(lang) {
    if (!lang) return 'auto';
    const map = {
        'zh-CN': 'zh',
        'zh-TW': 'cht',
        'ja': 'jp',
        'ko': 'kor',
        'vi': 'vie',
        'es': 'spa',
        'fr': 'fra',
        'ar': 'ara',
        'bg': 'bul',
        'et': 'est',
        'da': 'dan',
        'fi': 'fin',
        'ro': 'rom',
        'sl': 'slo',
        'sv': 'swe'
    };
    return map[lang] || lang;
}

function extractBaiduText() {
    let elements = document.querySelectorAll('p.target-output, .output-bd p, div.target-output, .ordinary-output p, [data-trans-result]');
    if (elements.length > 0) {
        let text = [].slice.call(elements).reduce(function (res, i) {
            return res + ' ' + (i.innerText || '');
        }, '').trim();
        if (text) return text;
    }
    return '';
}

function checkFinished() {
    if (!active) return;

    let text = extractBaiduText();
    if (text === lastText || text === '')
        return;

    console.log('translated text (Baidu Web):', text, 'old:', lastText);
    lastText = text;
    active = false;
    proxy.setTranslated(text);
}

function translate(text, from, to) {
    console.log('Start translate (Baidu Web):', text, 'from:', from, 'to:', to);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    active = true;
    let srcLang = mapBaiduLang(from);
    let targetLang = mapBaiduLang(to);
    let langs = srcLang + '/' + targetLang;

    if (window.location.href.indexOf('fanyi.baidu.com') !== -1
        && window.location.href.indexOf(langs) !== -1) {
        var input = document.querySelector('textarea#baidu_translate_input') || document.querySelector('textarea.textarea');
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

    let url = 'https://fanyi.baidu.com/#' + langs + '/' + encodeURIComponent(text);
    console.log("setting url", url);
    window.location = url;
}

function init() {
    proxy.translate.connect(translate);
    setInterval(checkFinished, 300);
}

function httpGetAsync(url, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.timeout = 15000; // msecs
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState != 4)
            return;
        if (xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        } else {
            proxy.setFailed(xmlHttp.statusText || ('HTTP error ' + xmlHttp.status));
        }
        xmlHttp.onreadystatechange = null;
        xmlHttp = null;
    };
    xmlHttp.ontimeout = function () {
        proxy.setFailed('Google API request timed out');
    };
    xmlHttp.onerror = function () {
        proxy.setFailed('Google API network error');
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function translate(text, from, to) {
    console.log('Start translate (Google API):', text, 'from:', from, 'to:', to);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    let sl = from ? from : 'auto';
    let tl = to ? to : 'en';
    let url = 'https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=' + sl + '&tl=' + tl + '&dt=t&q=' + encodeURIComponent(text);

    httpGetAsync(url, function (response) {
        try {
            let object = JSON.parse(response);
            let result = '';
            if (object && Array.isArray(object[0])) {
                object[0].forEach(function (element) {
                    if (element && element[0]) {
                        result += element[0];
                    }
                });
            }
            console.log('Translated text (Google API):', result);
            proxy.setTranslated(result);
        } catch (e) {
            console.error('Failed to parse Google API response:', e);
            proxy.setFailed('Failed to parse Google response: ' + e.message);
        }
    });
}

function init() {
    proxy.translate.connect(translate);
}

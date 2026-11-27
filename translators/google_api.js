const GOOGLE_ENDPOINTS = [
    {
        mode: 'batch',
        buildUrl: (sl, tl) =>
            `https://translate.googleapis.com/translate_a/t?client=dict-chrome-ex&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}`
    },
    {
        mode: 'batch',
        buildUrl: (sl, tl) =>
            `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}`
    },
    {
        mode: 'batch',
        buildUrl: (sl, tl) =>
            `https://translate.googleapis.com/translate_a/t?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}`
    },
    {
        mode: 'single',
        buildUrl: (sl, tl) =>
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t`
    }
];

const ENDPOINT_COOLDOWN_MS = 60000;
const REQUEST_TIMEOUT_MS = 6000;

const endpointCooldowns = new Array(GOOGLE_ENDPOINTS.length).fill(0);
let endpointCursor = 0;
let currentRequestId = 0;

function pickEndpointIndex(tried) {
    const now = Date.now();
    const total = GOOGLE_ENDPOINTS.length;

    // Pass 1: healthy /translate_a/t endpoints
    for (let offset = 0; offset < total; offset++) {
        const idx = (endpointCursor + offset) % total;
        if (!tried.has(idx) && GOOGLE_ENDPOINTS[idx].mode === 'batch' && now >= endpointCooldowns[idx]) {
            endpointCursor = (idx + 1) % total;
            return idx;
        }
    }

    // Pass 2: healthy fallback (/translate_a/single) endpoints
    for (let offset = 0; offset < total; offset++) {
        const idx = (endpointCursor + offset) % total;
        if (!tried.has(idx) && now >= endpointCooldowns[idx]) {
            endpointCursor = (idx + 1) % total;
            return idx;
        }
    }

    // Pass 3: untried endpoint whose cooldown expires soonest
    let earliestIdx = -1;
    for (let i = 0; i < total; i++) {
        if (tried.has(i)) continue;
        if (earliestIdx === -1 || endpointCooldowns[i] < endpointCooldowns[earliestIdx]) {
            earliestIdx = i;
        }
    }
    if (earliestIdx !== -1) {
        endpointCursor = (earliestIdx + 1) % total;
    }
    return earliestIdx;
}

function parseGoogleResponse(data) {
    if (typeof data === 'string') {
        return data;
    }

    if (Array.isArray(data)) {
        // /translate_a/single 3-level nested array: [[[translated, orig, ...], ...], ...]
        if (Array.isArray(data[0]) && Array.isArray(data[0][0])) {
            let result = '';
            data[0].forEach(function (segment) {
                if (segment && typeof segment[0] === 'string') {
                    result += segment[0];
                }
            });
            return result;
        }

        // /translate_a/t with sl=auto: [["translated", "en"]]
        if (Array.isArray(data[0]) && typeof data[0][0] === 'string') {
            return data[0][0];
        }

        // /translate_a/t with explicit sl: ["translated"] or ["translated", "en"]
        if (typeof data[0] === 'string') {
            return data[0];
        }
    }

    // Object format (dj=1 / dict-chrome-ex): { sentences: [{ trans: "..." }] }
    if (data && Array.isArray(data.sentences)) {
        return data.sentences
            .map(function (s) { return (s && typeof s.trans === 'string') ? s.trans : ''; })
            .join('');
    }

    return '';
}

async function fetchWithTimeout(url, body, timeoutMs) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: body
        };
        if (controller) {
            options.signal = controller.signal;
        }
        return await fetch(url, options);
    } finally {
        if (timer) clearTimeout(timer);
    }
}

async function translate(text, from, to) {
    console.log('Start translate (Google API):', text, 'from:', from, 'to:', to);

    if (!text || text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    const reqId = ++currentRequestId;
    const sl = from ? from : 'auto';
    const tl = to ? to : 'en';
    const body = new URLSearchParams({ q: text }).toString();
    const tried = new Set();
    let lastError = 'All Google API endpoints failed';

    for (let attempt = 0; attempt < GOOGLE_ENDPOINTS.length; attempt++) {
        const idx = pickEndpointIndex(tried);
        if (idx === -1) break;
        tried.add(idx);

        const endpoint = GOOGLE_ENDPOINTS[idx];
        const url = endpoint.buildUrl(sl, tl);

        try {
            const response = await fetchWithTimeout(url, body, REQUEST_TIMEOUT_MS);
            if (reqId !== currentRequestId) return;

            if (!response.ok) {
                lastError = `HTTP ${response.status} ${response.statusText || ''}`.trim();
                if (response.status === 429 || response.status === 403 || response.status === 302) {
                    endpointCooldowns[idx] = Date.now() + ENDPOINT_COOLDOWN_MS;
                }
                console.warn(`Google API endpoint #${idx + 1} failed (${lastError}), trying next...`);
                continue;
            }

            const data = await response.json();
            if (reqId !== currentRequestId) return;

            const result = parseGoogleResponse(data);
            if (result && result.trim().length > 0) {
                console.log('Translated text (Google API):', result);
                proxy.setTranslated(result);
                return;
            }

            lastError = 'Empty translation from Google API';
            console.warn(`Google API endpoint #${idx + 1} returned empty result, trying next...`);
        } catch (err) {
            if (reqId !== currentRequestId) return;
            lastError = err && err.name === 'AbortError'
                ? 'Google API request timed out'
                : (err && err.message ? err.message : String(err));
            endpointCooldowns[idx] = Date.now() + ENDPOINT_COOLDOWN_MS;
            console.warn(`Google API endpoint #${idx + 1} error (${lastError}), trying next...`);
        }
    }

    if (reqId === currentRequestId) {
        console.error('Google API failed:', lastError);
        proxy.setFailed('Google API error: ' + lastError);
    }
}

function init() {
    proxy.translate.connect(translate);
}

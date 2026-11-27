const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your Gemini API key https://aistudio.google.com/app/apikey
const MODEL = 'gemini-3.5-flash-lite'; // Models: gemini-3.5-flash-lite, gemini-4-hydrogen, gemini-4-argon, gemini-4-neon, gemini-4-carbon (https://ai.google.dev/gemini-api/docs/models)
const API_URL = 'https://generativelanguage.googleapis.com/v1/interactions';
const MAX_OUTPUT_TOKENS = 4096;

function extractInteractionText(data) {
    if (!data) return '';

    // Interactions API v1 (steps schema)
    if (Array.isArray(data.steps)) {
        const parts = [];
        for (const step of data.steps) {
            if (step && step.type === 'model_output' && Array.isArray(step.content)) {
                for (const item of step.content) {
                    if (item && item.type === 'text' && typeof item.text === 'string') {
                        parts.push(item.text);
                    }
                }
            }
        }
        if (parts.length > 0) {
            return parts.join('').trim();
        }
    }

    // Fallback for outputs schema
    if (Array.isArray(data.outputs)) {
        const parts = [];
        for (const out of data.outputs) {
            if (out && out.type === 'text' && typeof out.text === 'string') {
                parts.push(out.text);
            }
        }
        if (parts.length > 0) {
            return parts.join('').trim();
        }
    }

    return '';
}

function translate(text, from, to) {
    console.log('Start translate (Gemini):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (!text || text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY.trim() === '') {
        proxy.setFailed('Please set your Gemini API key in gemini_api.js');
        return;
    }

    const sourceClause = (!from || from === 'auto') ? 'automatically detecting the source language' : `from ${from}`;
    const systemPrompt = `You are a professional translator. Translate the provided text ${sourceClause} into ${to}. Preserve original formatting, line breaks, and punctuation. Output ONLY the translated text without explanations, greetings, quotes, or markdown code blocks.`;

    const requestBody = {
        model: MODEL,
        system_instruction: systemPrompt,
        input: text,
        store: false,
        generation_config: {
            max_output_tokens: MAX_OUTPUT_TOKENS
        }
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': API_KEY,
            'Api-Revision': '2026-05-20'
        },
        body: JSON.stringify(requestBody)
    })
    .then(async response => {
        if (!response.ok) {
            let errorDetail = response.statusText;
            try {
                const errJson = await response.json();
                if (errJson && errJson.error && errJson.error.message) {
                    errorDetail = errJson.error.message;
                }
            } catch (e) {}
            console.error('Error from Gemini API:', response.status, errorDetail);
            proxy.setFailed(`Gemini API Error (${response.status}): ${errorDetail}`);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;

        if (Array.isArray(data.errors) && data.errors.length > 0) {
            const msg = data.errors.map(e => e.message || JSON.stringify(e)).join('; ');
            console.error('Gemini API interaction errors:', msg);
            proxy.setFailed(`Gemini API Error: ${msg}`);
            return;
        }

        const translatedText = extractInteractionText(data);
        if (translatedText) {
            console.log('Translated text (Gemini):', translatedText);
            proxy.setTranslated(translatedText);
            return;
        }

        console.error('Unexpected response from Gemini API:', data);
        proxy.setFailed('Unexpected response from Gemini API');
    })
    .catch(error => {
        console.error('Error fetching from Gemini API:', error);
        proxy.setFailed(`Error fetching from Gemini API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}

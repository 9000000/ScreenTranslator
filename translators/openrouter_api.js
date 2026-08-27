const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenRouter API key https://openrouter.ai/settings/keys
const MODEL = 'google/gemini-2.0-flash-001'; // Models: google/gemini-2.0-flash-001, meta-llama/llama-3.3-70b-instruct:free, deepseek/deepseek-chat (https://openrouter.ai/models)
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.3;

function translate(text, from, to) {
    console.log('Start translate (OpenRouter):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY.trim() === '') {
        proxy.setFailed('Please set your OpenRouter API key in openrouter_api.js');
        return;
    }

    const systemPrompt = `You are a professional translator. Translate the provided text from ${from} to ${to}. Preserve original formatting, line breaks, and punctuation. Output ONLY the translated text without explanations, greetings, quotes, or markdown code blocks.`;

    const requestBody = {
        model: MODEL,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: text
            }
        ]
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'HTTP-Referer': 'https://github.com/OneMoreGres/ScreenTranslator',
            'X-Title': 'ScreenTranslator'
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
            console.error('Error from OpenRouter API:', response.status, errorDetail);
            proxy.setFailed(`OpenRouter API Error (${response.status}): ${errorDetail}`);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;

        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const translatedText = data.choices[0].message.content.trim();
            console.log('Translated text (OpenRouter):', translatedText);
            proxy.setTranslated(translatedText);
        } else {
            console.error('Unexpected response from OpenRouter API:', data);
            proxy.setFailed('Unexpected response from OpenRouter API');
        }
    })
    .catch(error => {
        console.error('Error fetching from OpenRouter API:', error);
        proxy.setFailed(`Error fetching from OpenRouter API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}

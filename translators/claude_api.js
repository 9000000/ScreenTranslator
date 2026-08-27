const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your Anthropic API key https://console.anthropic.com/settings/keys
const MODEL = 'claude-3-5-haiku-20241022'; // Models: claude-3-5-haiku-20241022, claude-3-7-sonnet-20250219 (https://docs.anthropic.com/en/docs/about-claude/models)
const API_URL = 'https://api.anthropic.com/v1/messages';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.3;

function translate(text, from, to) {
    console.log('Start translate (Claude):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY.trim() === '') {
        proxy.setFailed('Please set your Anthropic Claude API key in claude_api.js');
        return;
    }

    const systemPrompt = `You are a professional translator. Translate the provided text from ${from} to ${to}. Preserve original formatting, line breaks, and punctuation. Output ONLY the translated text without explanations, greetings, quotes, or markdown code blocks.`;

    const requestBody = {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        system: systemPrompt,
        messages: [
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
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
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
            console.error('Error from Claude API:', response.status, errorDetail);
            proxy.setFailed(`Claude API Error (${response.status}): ${errorDetail}`);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;

        if (data.content && data.content.length > 0 && data.content[0].type === 'text') {
            const translatedText = data.content[0].text.trim();
            console.log('Translated text (Claude):', translatedText);
            proxy.setTranslated(translatedText);
        } else {
            console.error('Unexpected response from Claude API:', data);
            proxy.setFailed('Unexpected response from Claude API');
        }
    })
    .catch(error => {
        console.error('Error fetching from Claude API:', error);
        proxy.setFailed(`Error fetching from Claude API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}

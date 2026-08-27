const API_KEY = 'YOUR_TOKEN_HERE'; // Replace with your Github Personal Access Token https://github.com/settings/tokens
const MODEL = 'gpt-4o-mini'; // Models: gpt-4o-mini, gpt-4o, Meta-Llama-3.1-70B-Instruct (https://github.com/marketplace/models)
const API_URL = 'https://models.inference.ai.azure.com/chat/completions';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.3;

function translate(text, from, to) {
    console.log('Start translate (Github):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    if (!API_KEY || API_KEY === 'YOUR_TOKEN_HERE' || API_KEY.trim() === '') {
        proxy.setFailed('Please set your GitHub Token in github_api.js');
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
            'Authorization': `Bearer ${API_KEY}`
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
            console.error('Error from Github API:', response.status, errorDetail);
            proxy.setFailed(`Github API Error (${response.status}): ${errorDetail}`);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;

        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const translatedText = data.choices[0].message.content.trim();
            console.log('Translated text (Github):', translatedText);
            proxy.setTranslated(translatedText);
        } else {
            console.error('Unexpected response from Github API:', data);
            proxy.setFailed('Unexpected response from Github API');
        }
    })
    .catch(error => {
        console.error('Error fetching from Github API:', error);
        proxy.setFailed(`Error fetching from Github API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}

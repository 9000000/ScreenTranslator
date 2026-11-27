const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenAI API key https://platform.openai.com/settings/organization/api-keys
const MODEL = 'gpt-6-luna'; // Models: gpt-6-luna, gpt-6.2-sol, gpt-6.2-astra (https://platform.openai.com/docs/models)
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MAX_COMPLETION_TOKENS = 2000;

function translate(text, from, to) {
    console.log('Start translate (OpenAI):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (!text || text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY.trim() === '') {
        proxy.setFailed('Please set your OpenAI API key in openai_api.js');
        return;
    }

    const sourceClause = (!from || from === 'auto') ? 'automatically detecting the source language' : `from ${from}`;
    const systemPrompt = `You are a professional translator. Translate the provided text ${sourceClause} into ${to}. Preserve original formatting, line breaks, and punctuation. Output ONLY the translated text without explanations, greetings, quotes, or markdown code blocks.`;

    const requestBody = {
        model: MODEL,
        reasoning_effort: 'none',
        max_completion_tokens: MAX_COMPLETION_TOKENS,
        messages: [
            {
                role: 'developer',
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
            console.error('Error from OpenAI API:', response.status, errorDetail);
            proxy.setFailed(`OpenAI API Error (${response.status}): ${errorDetail}`);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;

        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const translatedText = data.choices[0].message.content.trim();
            if (translatedText) {
                console.log('Translated text (OpenAI):', translatedText);
                proxy.setTranslated(translatedText);
                return;
            }
        }

        console.error('Unexpected response from OpenAI API:', data);
        proxy.setFailed('Unexpected response from OpenAI API');
    })
    .catch(error => {
        console.error('Error fetching from OpenAI API:', error);
        proxy.setFailed(`Error fetching from OpenAI API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}

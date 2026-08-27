const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your Groq API key https://console.groq.com/keys
const MODEL = 'llama-3.3-70b-versatile'; // Models: llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768 (https://console.groq.com/docs/models)
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.3;

function translate(text, from, to) {
    console.log('Start translate (Groq):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY.trim() === '') {
        proxy.setFailed('Please set your Groq API key in groq_api.js');
        return;
    }

    const systemPrompt = `You are a professional translator. Translate the provided text from ${from} to ${to}. Preserve original formatting, line breaks, and punctuation. Output ONLY the translated text without explanations, greetings, quotes, or markdown code blocks.`;

    const requestBody = {
        model: MODEL,
        temperature: TEMPERATURE,
        max_completion_tokens: MAX_TOKENS,
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
            console.error('Error from Groq API:', response.status, errorDetail);
            proxy.setFailed(`Groq API Error (${response.status}): ${errorDetail}`);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;

        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const translatedText = data.choices[0].message.content.trim();
            console.log('Translated text (Groq):', translatedText);
            proxy.setTranslated(translatedText);
        } else {
            console.error('Unexpected response from Groq API:', data);
            proxy.setFailed('Unexpected response from Groq API');
        }
    })
    .catch(error => {
        console.error('Error fetching from Groq API:', error);
        proxy.setFailed(`Error fetching from Groq API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}

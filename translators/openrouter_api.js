const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenRouter API key https://openrouter.ai/settings/keys
const MODEL = 'nousresearch/deephermes-3-mistral-24b-preview:free'; //Models and pricing https://openrouter.ai/models
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.5; // Controls the randomness of the output, lower values are more deterministic and higher values are more random (0 - 2)

function translate(text, from, to) {
    console.log('Start translate (OpenRouter):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    const prompt = `Translate from ${from} to ${to} and return only the translated text`;
    
    const requestBody = {
        model: MODEL,
        temperature: TEMPERATURE, 
        max_tokens: MAX_TOKENS,
        messages: [{
            role: "system",
            content: prompt
            }, {
            role: "user",
            content: text
        }] 
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error from OpenRouter API:', response.status, response.statusText);
            proxy.setFailed(`OpenRouter API Error: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
        .then(data => {
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
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

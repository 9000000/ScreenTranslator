const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your Groq API key https://console.groq.com/keys
const MODEL = 'llama3-70b-8192'; // Models and free limits https://console.groq.com/dashboard/limits , prici ng https://groq.com/pricing/
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.5; // Controls the randomness of the output, lower values are more deterministic and higher values are more random (0 - 2)

function translate(text, from, to) {
    console.log('Start translate (Groq):', text, 'from:', from, 'to:', to);
    
    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    const prompt = `Translate from ${from} to ${to} and return only the translated text`;

    const requestBody = {
        model: MODEL,
        temperature: TEMPERATURE, 
        max_completion_tokens: MAX_TOKENS,
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
            console.error('Error from Groq API:', response.status, response.statusText);
            proxy.setFailed(`Groq API Error: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
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


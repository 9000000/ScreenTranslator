const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your Gemini API key https://aistudio.google.com/app/apikey
const MODEL = 'gemini-2.0-flash'; // Models and pricing https://ai.google.dev/gemini-api/docs/models https://ai.google.dev/gemini-api/docs/pricing
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.5; // Controls the randomness of the output, lower values are more deterministic and higher values are more random (0 - 2)

function translate(text, from, to) {
    console.log('Start translate (Gemini):', text, 'from:', from, 'to:', to, 'using model:', MODEL, 'temperature:', TEMPERATURE);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    const prompt = `Translate from ${from} to ${to} and return only the translated text`;

    const requestBody = {
        system_instruction: {
            parts: [{
                text: prompt
            }]
        },
        contents: {
            parts: [{
                text: text
            }]
        },
        generationConfig: {
            temperature: TEMPERATURE,
            maxOutputTokens: MAX_TOKENS
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "OFF",
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "OFF",
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "OFF",
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "OFF",
            },
            {
                category: "HARM_CATEGORY_CIVIC_INTEGRITY",
                threshold: "OFF",
            }
        ],
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error from Gemini API:', response.status, response.statusText);
            proxy.setFailed(`Gemini API Error: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            const translatedText = data.candidates[0].content.parts[0].text.trim();
            console.log('Translated text (Gemini):', translatedText);
            proxy.setTranslated(translatedText);
        } else {
            console.error('Unexpected response from Gemini API:', data);
            proxy.setFailed('Unexpected response from Gemini API');
        }
    })
    .catch(error => {
        console.error('Error fetching from Gemini API:', error);
        proxy.setFailed(`Error fetching from Gemini API: ${error.message}`);
    });
}


function init() {
    proxy.translate.connect(translate);
}

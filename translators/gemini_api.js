const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your Gemini API key https://aistudio.google.com/app/apikey
const MODEL = 'gemini-2.0-flash'; // Models: gemini-2.0-flash, gemini-2.5-flash, gemini-1.5-flash (https://ai.google.dev/gemini-api/docs/models)
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.3;

function translate(text, from, to) {
    console.log('Start translate (Gemini):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY.trim() === '') {
        proxy.setFailed('Please set your Gemini API key in gemini_api.js');
        return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    const systemPrompt = `You are a professional translator. Translate the provided text from ${from} to ${to}. Preserve original formatting, line breaks, and punctuation. Output ONLY the translated text without explanations, greetings, quotes, or markdown code blocks.`;

    const requestBody = {
        system_instruction: {
            parts: [{
                text: systemPrompt
            }]
        },
        contents: [{
            parts: [{
                text: text
            }]
        }],
        generationConfig: {
            temperature: TEMPERATURE,
            maxOutputTokens: MAX_TOKENS
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_CIVIC_INTEGRITY",
                threshold: "BLOCK_NONE"
            }
        ]
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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

        if (data.promptFeedback && data.promptFeedback.blockReason) {
            console.error('Gemini API blocked prompt:', data.promptFeedback.blockReason);
            proxy.setFailed(`Gemini API Blocked: ${data.promptFeedback.blockReason}`);
            return;
        }

        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0 && candidate.content.parts[0].text) {
                const translatedText = candidate.content.parts[0].text.trim();
                console.log('Translated text (Gemini):', translatedText);
                proxy.setTranslated(translatedText);
                return;
            }
            if (candidate.finishReason && candidate.finishReason !== 'STOP') {
                console.error('Gemini finished with reason:', candidate.finishReason);
                proxy.setFailed(`Gemini API finish reason: ${candidate.finishReason}`);
                return;
            }
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

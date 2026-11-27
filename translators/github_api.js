// NOTE: GitHub Models (models.inference.ai.azure.com & models.github.ai) was retired on July 30, 2026.
// Configure an Azure AI Foundry endpoint (or compatible OpenAI endpoint) below:
// https://ai.azure.com/
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your Azure AI Foundry API key
const MODEL = 'gpt-4o-mini'; // Your deployed model name in Azure AI Foundry (e.g. gpt-6-luna, gpt-4.1-mini, DeepSeek-V4.1-Flash)
const API_URL = 'https://YOUR_RESOURCE.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview';
const MAX_COMPLETION_TOKENS = 2000;

function stripThinking(text) {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

function translate(text, from, to) {
    console.log('Start translate (Azure AI Foundry / GitHub):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (!text || text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE' || API_KEY.trim() === '' || API_URL.indexOf('YOUR_RESOURCE') !== -1) {
        proxy.setFailed('GitHub Models was retired (July 2026). Please set your Azure AI Foundry endpoint and API key in github_api.js');
        return;
    }

    const sourceClause = (!from || from === 'auto') ? 'automatically detecting the source language' : `from ${from}`;
    const systemPrompt = `You are a professional translator. Translate the provided text ${sourceClause} into ${to}. Preserve original formatting, line breaks, and punctuation. Output ONLY the translated text without explanations, greetings, quotes, or markdown code blocks.`;

    const requestBody = {
        model: MODEL,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
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
            'api-key': API_KEY,
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
            console.error('Error from Azure AI Foundry API:', response.status, errorDetail);
            proxy.setFailed(`Azure AI Foundry API Error (${response.status}): ${errorDetail}`);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;

        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const translatedText = stripThinking(data.choices[0].message.content);
            if (translatedText) {
                console.log('Translated text (Azure AI Foundry):', translatedText);
                proxy.setTranslated(translatedText);
                return;
            }
        }

        console.error('Unexpected response from Azure AI Foundry API:', data);
        proxy.setFailed('Unexpected response from Azure AI Foundry API');
    })
    .catch(error => {
        console.error('Error fetching from Azure AI Foundry API:', error);
        proxy.setFailed(`Error fetching from Azure AI Foundry API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}

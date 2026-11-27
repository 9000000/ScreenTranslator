const OLLAMA_HOST = 'http://localhost:11434'; // Default Ollama server address
const MODEL = 'llama3.2'; // Any model installed in your Ollama (e.g. llama3.2, qwen3, gemma4, gemma3, deepseek-r1)
const TEMPERATURE = 0.3;

function stripThinking(text) {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

function translate(text, from, to) {
    console.log('Start translate (Ollama Local):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (!text || text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    const apiUrl = `${OLLAMA_HOST.replace(/\/$/, '')}/v1/chat/completions`;
    const sourceClause = (!from || from === 'auto') ? 'automatically detecting the source language' : `from ${from}`;
    const systemPrompt = `You are a professional translator. Translate the provided text ${sourceClause} into ${to}. Preserve original formatting, line breaks, and punctuation. Output ONLY the translated text without explanations, greetings, quotes, or markdown code blocks.`;

    const requestBody = {
        model: MODEL,
        temperature: TEMPERATURE,
        stream: false,
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
            console.error('Error from Ollama:', response.status, errorDetail);
            proxy.setFailed(`Ollama Error (${response.status}): ${errorDetail}`);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (!data) return;

        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const translatedText = stripThinking(data.choices[0].message.content);
            if (translatedText) {
                console.log('Translated text (Ollama):', translatedText);
                proxy.setTranslated(translatedText);
                return;
            }
        }

        console.error('Unexpected response from Ollama:', data);
        proxy.setFailed('Unexpected response from Ollama');
    })
    .catch(error => {
        console.error('Error connecting to Ollama:', error);
        proxy.setFailed(`Cannot connect to Ollama at ${OLLAMA_HOST}. Make sure Ollama is running and model '${MODEL}' is pulled (ollama run ${MODEL}).`);
    });
}

function init() {
    proxy.translate.connect(translate);
}

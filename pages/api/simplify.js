export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { text } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'API key is not configured.' });
  }

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ message: 'Invalid input text provided.' });
  }

  const prompt = `
    Your task is to act as a "Text Simplifier".
    You will receive a piece of text that may contain complex jargon, legal terms, or technical language.
    Rewrite the text into a version that is simple, clear, and easy for a 5th-grade student to understand.
    - Define any essential jargon in simple terms.
    - Use short sentences.
    - Focus on the core message.
    - Do not add any new information or your own opinions.
    - Respond only with the simplified text and nothing else.

    Original Text:
    ---
    ${text}
    ---

    Simplified Text:
  `;

  const payload = {
    contents: [{
      parts: [{
        text: prompt,
      }],
    }],
    generationConfig: {
      temperature: 0.5,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    },
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
      const simplifiedText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ simplifiedText });
    } else {
      throw new Error("The model did not return any content. The input may have been flagged as unsafe.");
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Failed to simplify text.' });
  }
}

// Filename: /pages/index.js
// This is the main page and UI for the application.

import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSimplify = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to simplify.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSimplifiedText('');

    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An unknown error occurred.');
      }

      const data = await response.json();
      setSimplifiedText(data.simplifiedText);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 font-sans p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">JargonBuster</h1>
          <p className="text-lg text-gray-500 mt-2">Understand anything, instantly.</p>
        </header>

        <main className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="input-box" className="sr-only">Input Box</label>
              <textarea
                id="input-box"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your complex text here..."
                className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 resize-none"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSimplify}
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Simplifying...' : 'Simplify Text'}
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                <p>{error}</p>
              </div>
            )}

            {simplifiedText && (
              <div className="space-y-2">
                 <h2 className="text-lg font-semibold text-gray-700">Simplified Version:</h2>
                 <div
                    id="output-box"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800"
                 >
                   <p className="whitespace-pre-wrap">{simplifiedText}</p>
                 </div>
              </div>
            )}
          </div>
        </main>

        <footer className="text-center my-8">
            <a href="#" className="text-sm text-gray-400 hover:text-blue-600">
                Upgrade to Pro for unlimited use.
            </a>
        </footer>
      </div>
    </div>
  );
}

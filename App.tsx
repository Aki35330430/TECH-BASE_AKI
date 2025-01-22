import React, { useState } from 'react';
import { Button } from './components/Button';

interface QuizData {
  name: string;
  text: string;
  url: string;
  image: Array<{
    url: string | null;
    name: string;
    type: string;
  }>;
}

function App() {
  const [currentData, setCurrentData] = useState<QuizData | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get-random-row`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setCurrentData(data);
      setShowAnswer(false);
    } catch (error) {
      console.error('Error:', error);
      alert('データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200">
      <div className="max-w-3xl mx-auto pt-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-blue-900 text-center mb-8 drop-shadow-sm">
            英単語クイズ
          </h1>

          <div className="flex justify-center gap-4 mb-8">
            <Button onClick={fetchQuestion} disabled={loading}>
              {loading ? '読み込み中...' : '問題を表示'}
            </Button>
            <Button 
              onClick={handleShowAnswer} 
              disabled={!currentData || showAnswer}
              variant="secondary"
            >
              解答を表示
            </Button>
          </div>

          {currentData && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-2">問題:</h2>
                <p className="text-xl">{currentData.name}</p>
              </div>

              {showAnswer && (
                <>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h2 className="font-semibold text-lg mb-2">解答:</h2>
                    <p className="text-xl">{currentData.text}</p>
                  </div>

                  {currentData.image.map((media, index) => (
                    media.url && (
                      <div key={index} className="flex justify-center">
                        {/\.(mp4)$/i.test(media.url) ? (
                          <video 
                            controls 
                            className="max-w-2xl rounded-lg shadow-md"
                            src={media.url}
                          />
                        ) : (
                          <img 
                            src={media.url} 
                            alt={media.name}
                            className="max-w-2xl rounded-lg shadow-md"
                          />
                        )}
                      </div>
                    )
                  ))}

                  <div className="text-center">
                    <a 
                      href={currentData.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Notionで確認する
                    </a>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useCallback } from 'react';
import Card from '../ui/Card';
import { getKnowledgeBaseArticle } from '../../services/geminiService';
import { KnowledgeBaseArticle } from '../../types';

const KnowledgeBase: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [article, setArticle] = useState<KnowledgeBaseArticle | null>(null);

    const handleSearch = useCallback(async (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        if (!topic.trim()) {
            setError('Lütfen bir konu girin.');
            return;
        }
        setLoading(true);
        setError(null);
        setArticle(null);
        try {
            const result = await getKnowledgeBaseArticle(topic);
            setArticle(result);
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [topic]);
    
    const handleTopicClick = (selectedTopic: string) => {
        setTopic(selectedTopic);
        // This is a trick to trigger the search immediately after setting the state
        setTimeout(() => document.getElementById('search-button')?.click(), 0);
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-2xl font-bold text-aqua-text-primary">Bilgi Kütüphanesi</h2>
                <p className="text-aqua-text-secondary my-2">
                    Akvaryum dünyası hakkında merak ettiğiniz her şeyi sorun. Balık türleri, bitkiler, hastalıklar ve daha fazlası...
                </p>
                <form onSubmit={handleSearch} className="flex gap-2 mt-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="flex-grow p-3 bg-aqua-light border border-aqua-light rounded-lg focus:ring-2 focus:ring-aqua-accent focus:outline-none transition text-aqua-text-primary"
                        placeholder="Örn: Neon Tetra bakımı, Beyaz Benek hastalığı..."
                        disabled={loading}
                    />
                    <button
                        id="search-button"
                        type="submit"
                        disabled={loading}
                        className="bg-aqua-accent text-aqua-deep font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-all duration-200 disabled:bg-aqua-light disabled:cursor-not-allowed"
                    >
                         {loading ? '...' : 'Ara'}
                    </button>
                </form>
                <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="text-sm text-aqua-text-secondary mr-2">Popüler:</span>
                    {['Anubias', 'Lepistes', 'Yosun türleri'].map(t => (
                        <button key={t} onClick={() => handleTopicClick(t)} className="text-xs bg-aqua-light text-aqua-accent px-2 py-1 rounded-full hover:bg-aqua-dark">{t}</button>
                    ))}
                </div>
                 {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            </Card>

            {loading && (
                <div className="flex justify-center items-center p-8">
                    <svg className="animate-spin h-8 w-8 text-aqua-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
            
            {article && (
                <Card>
                    <article className="prose prose-invert prose-p:text-aqua-text-secondary prose-headings:text-aqua-text-primary prose-strong:text-aqua-accent max-w-none">
                        <h1>{article.title}</h1>
                        <p className="lead italic">{article.summary}</p>
                        {article.sections.map((section, index) => (
                            <div key={index}>
                                <h2>{section.heading}</h2>
                                <p>{section.content}</p>
                            </div>
                        ))}
                    </article>
                </Card>
            )}
        </div>
    );
};

export default KnowledgeBase;

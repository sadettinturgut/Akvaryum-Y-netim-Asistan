import React, { useState, useCallback } from 'react';
import Card from '../ui/Card';
import { getAiImageAnalysis } from '../../services/geminiService';
import { AiImageAnalysis } from '../../types';

const AiAnalysis: React.FC = () => {
    const [prompt, setPrompt] = useState('Bu akvaryum canlısının türünü ve genel sağlık durumunu analiz et.');
    const [image, setImage] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AiImageAnalysis | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setMimeType(file.type);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAnalyze = useCallback(async () => {
        if (!image) {
            setError('Lütfen analiz için bir resim yükleyin.');
            return;
        }
        setLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await getAiImageAnalysis(image, mimeType, prompt);
            setAnalysis(result);
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [image, mimeType, prompt]);

    return (
        <div className="space-y-6">
            <Card title="Yapay Zeka Destekli Görsel Analiz">
                <p className="text-aqua-text-secondary mb-4">
                    Bir balık, bitki veya yosun fotoğrafı yükleyin. Yapay zeka, türünü, sağlık durumunu veya yosun türünü sizin için analiz etsin.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                         <label className="block mb-2 text-sm font-medium text-aqua-text-secondary">Analiz İsteği</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-24 p-3 bg-aqua-light border border-aqua-light rounded-lg focus:ring-2 focus:ring-aqua-accent focus:outline-none transition text-aqua-text-primary"
                            placeholder="Analiz için ne istediğinizi belirtin..."
                            disabled={loading}
                        />
                         <label className="block mt-4 mb-2 text-sm font-medium text-aqua-text-secondary">Fotoğraf Yükle</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-aqua-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-aqua-accent file:text-aqua-deep hover:file:bg-opacity-80"
                            disabled={loading}
                        />
                    </div>

                    <div className="w-full h-48 bg-aqua-light rounded-lg flex items-center justify-center">
                        {image ? (
                            <img src={`data:${mimeType};base64,${image}`} alt="Yüklendi" className="max-h-full max-w-full rounded-lg object-contain" />
                        ) : (
                            <p className="text-aqua-text-secondary">Resim önizlemesi</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={loading || !image}
                    className="mt-6 w-full bg-aqua-accent text-aqua-deep font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 disabled:bg-aqua-light disabled:cursor-not-allowed disabled:text-aqua-text-secondary flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analiz Ediliyor...
                        </>
                    ) : (
                        'Görseli Analiz Et'
                    )}
                </button>
                {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            </Card>
            
            {analysis && (
                <Card title="Görsel Analiz Sonuçları">
                    <h3 className="text-xl font-bold text-aqua-accent">{analysis.title}</h3>
                    <p className="text-aqua-text-secondary mt-2 mb-4">{analysis.description}</p>
                    <div className="space-y-2 border-t border-aqua-light pt-4">
                        {analysis.details.map((detail, index) => (
                            <div key={index} className="flex justify-between">
                                <span className="font-semibold text-aqua-text-primary">{detail.label}:</span>
                                <span className="text-aqua-text-secondary">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AiAnalysis;


import React, { useState, useCallback } from 'react';
import Card from '../ui/Card';
import { getAiDiagnosis } from '../../services/geminiService';
import { AiDiagnosis } from '../../types';

const DiseaseGuide: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<AiDiagnosis | null>(null);

  const handleDiagnose = useCallback(async () => {
    if (!symptoms.trim()) {
      setError('Lütfen gözlemlediğiniz belirtileri girin.');
      return;
    }
    setLoading(true);
    setError(null);
    setDiagnosis(null);
    try {
      const result = await getAiDiagnosis(symptoms);
      setDiagnosis(result);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [symptoms]);
  
  const ResultSection: React.FC<{title: string, items: React.ReactNode[]}> = ({title, items}) => (
    <div className="mt-4">
        <h4 className="text-lg font-semibold text-aqua-accent mb-2">{title}</h4>
        <ul className="list-disc list-inside space-y-1 text-aqua-text-secondary">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
  );


  return (
    <div className="space-y-6">
      <Card title="Yapay Zeka Destekli Hastalık Teşhisi">
        <p className="text-aqua-text-secondary mb-4">
          Balıklarınızda gözlemlediğiniz belirtileri aşağıdaki alana yazın. Yapay zeka, olası hastalıkları ve tedavi yöntemlerini sizin için analiz etsin.
        </p>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full h-32 p-3 bg-aqua-light border border-aqua-light rounded-lg focus:ring-2 focus:ring-aqua-accent focus:outline-none transition text-aqua-text-primary"
          placeholder="Örn: Balığın üzerinde beyaz benekler var, iştahsız ve sürekli saklanıyor..."
          disabled={loading}
        />
        <button
          onClick={handleDiagnose}
          disabled={loading}
          className="mt-4 w-full bg-aqua-accent text-aqua-deep font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 disabled:bg-aqua-light disabled:cursor-not-allowed disabled:text-aqua-text-secondary flex items-center justify-center"
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
            'Teşhis İste'
          )}
        </button>
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
      </Card>

      {diagnosis && (
        <Card title="Yapay Zeka Analiz Sonuçları">
            <div>
                <h3 className="text-xl font-bold text-aqua-text-primary mb-3">Olası Hastalıklar</h3>
                {diagnosis.possible_diseases.map((disease, index) => (
                    <div key={index} className="mb-4 p-3 bg-aqua-light rounded-md">
                        <p className="font-semibold text-aqua-text-primary">{disease.name} <span className="text-xs font-normal bg-aqua-deep px-2 py-1 rounded-full ml-2">{disease.confidence} Güvenilirlik</span></p>
                        <p className="text-sm text-aqua-text-secondary mt-1">{disease.description}</p>
                    </div>
                ))}
            </div>
            
            <ResultSection 
                title="Önerilen Tedaviler"
                items={diagnosis.recommended_treatments.map(t => <>{t.treatment_name}: <span className="italic">{t.steps.join(', ')}</span></>)}
            />
            
            <ResultSection 
                title="Önleyici Eylemler"
                items={diagnosis.preventative_actions}
            />

            <div className="mt-6 text-xs text-aqua-text-secondary italic border-t border-aqua-light pt-3">
                <p><span className="font-bold">Feragatname:</span> {diagnosis.disclaimer}</p>
            </div>
        </Card>
      )}
    </div>
  );
};

export default DiseaseGuide;

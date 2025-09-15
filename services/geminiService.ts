import { GoogleGenAI, Type } from "@google/genai";
import { AiDiagnosis, AiImageAnalysis, KnowledgeBaseArticle } from '../types';

const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};


const getAiDiagnosis = async (symptoms: string): Promise<AiDiagnosis> => {
    const ai = getAiClient();
    const prompt = `Akvaryum balıklarında şu belirtiler gözlemlendi: "${symptoms}". Bu belirtilere dayanarak, olası hastalıkları, önerilen tedavi yöntemlerini, önleyici eylemleri ve bir feragatnameyi içeren bir JSON nesnesi oluştur. Yanıt sadece JSON formatında olmalı ve başka hiçbir metin içermemelidir.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        possible_diseases: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "Hastalığın adı (örn. Beyaz Benek)" },
                                    confidence: { type: Type.STRING, description: "Teşhisin güvenilirliği (Yüksek, Orta, Düşük)" },
                                    symptoms_match: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Belirtilerle eşleşen hastalık semptomları" },
                                    description: { type: Type.STRING, description: "Hastalığın kısa açıklaması" }
                                },
                            }
                        },
                        recommended_treatments: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    treatment_name: { type: Type.STRING, description: "Tedavi yönteminin adı (örn. Isı ve Tuz Tedavisi)" },
                                    steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Uygulanacak adımlar" },
                                    medication_suggestion: { type: Type.STRING, description: "Önerilen ilaç (isteğe bağlı)" }
                                }
                            }
                        },
                        preventative_actions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Hastalığın tekrarını önlemek için alınacak önlemler"
                        },
                        disclaimer: {
                            type: Type.STRING,
                            description: "Bu bilginin profesyonel veteriner tavsiyesi yerine geçmediğini belirten feragatname."
                        }
                    }
                },
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AiDiagnosis;

    } catch (error) {
        console.error("Error calling Gemini API for diagnosis:", error);
        throw new Error("Yapay zeka teşhisi alınamadı. Lütfen daha sonra tekrar deneyin.");
    }
};

const getAiImageAnalysis = async (base64Image: string, mimeType: string, prompt: string): Promise<AiImageAnalysis> => {
    const ai = getAiClient();
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };
    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Analizin başlığı (örn. Neon Tetra Sağlık Analizi)"},
                        description: { type: Type.STRING, description: "Görüntüdeki gözlemlerin genel bir özeti."},
                        details: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    label: { type: Type.STRING, description: "Gözlemin etiketi (örn. Tür, Durum, Yosun Tipi)"},
                                    value: { type: Type.STRING, description: "Gözlemin değeri (örn. Paracheirodon innesi, Sağlıklı, Yeşil Sakal Yosunu)"}
                                }
                            }
                        }
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AiImageAnalysis;

    } catch (error) {
        console.error("Error calling Gemini API for image analysis:", error);
        throw new Error("Yapay zeka görsel analizi alınamadı.");
    }
};


const getKnowledgeBaseArticle = async (topic: string): Promise<KnowledgeBaseArticle> => {
    const ai = getAiClient();
    const prompt = `Akvaryum hobisiyle ilgili olarak "${topic}" konusu hakkında detaylı bir ansiklopedi maddesi oluştur. Yanıtın sadece JSON formatında olsun. Başlık, özet ve bölümler (başlık ve içerik olarak) içersin.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        sections: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    heading: { type: Type.STRING },
                                    content: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as KnowledgeBaseArticle;

    } catch (error) {
        console.error("Error calling Gemini API for knowledge base:", error);
        throw new Error("Bilgi kütüphanesi içeriği alınamadı.");
    }
};


export { getAiDiagnosis, getAiImageAnalysis, getKnowledgeBaseArticle };

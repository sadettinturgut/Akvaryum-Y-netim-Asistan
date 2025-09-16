import { GoogleGenAI, Type } from "@google/genai";
import { AiDiagnosis, AiImageAnalysis, KnowledgeBaseArticle, AiFishInfo, AiPlantInfo, Aquarium, AiHealthReport } from '../types';

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

const getAiFishInfo = async (fishName: string): Promise<AiFishInfo> => {
    const ai = getAiClient();
    const prompt = `"${fishName}" adlı akvaryum balığı hakkında bilgi ver. Yaygın adını, bilimsel adını (tür) ve kısa bir not (bakımı veya davranışı hakkında) içeren bir JSON nesnesi döndür. Yanıt sadece JSON formatında olmalı.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "Balığın yaygın adı (örn. Neon Tetra)" },
                        species: { type: Type.STRING, description: "Balığın bilimsel adı (örn. Paracheirodon innesi)" },
                        notes: { type: Type.STRING, description: "Balığın bakımı, davranışı veya kökeni hakkında kısa bir not" }
                    }
                },
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AiFishInfo;
    } catch (error) {
        console.error("Error calling Gemini API for fish info:", error);
        throw new Error("Yapay zeka balık bilgisi alınamadı. Lütfen balık adını kontrol edin veya daha sonra tekrar deneyin.");
    }
};

const getAiPlantInfo = async (plantName: string): Promise<AiPlantInfo> => {
    const ai = getAiClient();
    const prompt = `"${plantName}" adlı akvaryum bitkisi hakkında bilgi ver. Yaygın adını, bilimsel adını (tür) ve kısa bir bakım notu (ışık ihtiyacı, CO2, zorluk seviyesi gibi) içeren bir JSON nesnesi döndür. Yanıt sadece JSON formatında olmalı.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "Bitkinin yaygın adı (örn. Anubias Nana)" },
                        species: { type: Type.STRING, description: "Bitkinin bilimsel adı (örn. Anubias barteri var. nana)" },
                        notes: { type: Type.STRING, description: "Bitkinin bakımı hakkında kısa bir not (örn. Düşük ışık, CO2 gerektirmez, başlangıç seviyesi.)" }
                    }
                },
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AiPlantInfo;
    } catch (error) {
        console.error("Error calling Gemini API for plant info:", error);
        throw new Error("Yapay zeka bitki bilgisi alınamadı. Lütfen bitki adını kontrol edin veya daha sonra tekrar deneyin.");
    }
};

const getAiHealthReport = async (aquarium: Aquarium): Promise<AiHealthReport> => {
    const ai = getAiClient();
    const volume = (aquarium.width * aquarium.length * aquarium.height) / 1000;
    const fishListString = aquarium.fish.map(f => `${f.count}x ${f.name} (${f.species})`).join(', ') || 'Balık yok';
    const latestLog = aquarium.waterLogs[0];
    const waterParamsString = latestLog 
        ? `Sıcaklık: ${latestLog.temperature}°C, pH: ${latestLog.ph}, TDS: ${latestLog.tds}ppm, NO3: ${latestLog.no3}mg/L, KH: ${latestLog.kh}dKH, GH: ${latestLog.gh}dGH`
        : 'Su değeri kaydı yok';

    const prompt = `
        Bir akvaryum sağlık asistanı olarak davran. Aşağıdaki verilere dayanarak bir sağlık raporu oluştur:
        - Akvaryum Hacmi: ${volume.toFixed(2)} litre
        - Akvaryum Türü: ${aquarium.type}
        - Canlı Yükü: ${fishListString}
        - Son Su Değerleri: ${waterParamsString}

        Bu bilgilere göre, aşağıdaki yapıda bir JSON nesnesi döndür:
        1. 'score': 0-100 arası bir sağlık puanı. Puanı belirlerken su değerlerinin akvaryum türü için uygunluğunu, canlı yükünün hacme oranını dikkate al.
        2. 'summary': Akvaryumun genel durumu hakkında 1-2 cümlelik Türkçe bir özet.
        3. 'positives': İyi giden 2-3 şeyi listeleyen Türkçe bir string dizisi.
        4. 'recommendations': Yapılması gereken 2-3 somut ve eyleme geçirilebilir öneriyi içeren Türkçe bir string dizisi.

        Örnek Değerlendirme Mantığı:
        - Tropikal bir akvaryum için 25°C sıcaklık idealdir, bu puanı artırır.
        - Küçük bir hacimde çok fazla balık olması (aşırı stoklama) puanı ciddi şekilde düşürür.
        - Nitrat (NO3) seviyesinin 20mg/L üzerinde olması puanı düşürür ve su değişimi önerisi getirir.
        - pH değerinin seçilen akvaryum türü için ideal aralıkta olması pozitif bir durumdur.

        Yanıt sadece JSON formatında olmalı ve başka hiçbir metin içermemelidir.
    `;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER, description: "Akvaryumun 0-100 arası sağlık puanı" },
                        summary: { type: Type.STRING, description: "Genel durum hakkında kısa özet" },
                        positives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "İyi giden noktalar" },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "İyileştirme için öneriler" }
                    }
                },
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AiHealthReport;
    } catch (error) {
        console.error("Error calling Gemini API for health report:", error);
        throw new Error("Yapay zeka sağlık raporu alınamadı.");
    }
};


export { getAiDiagnosis, getAiImageAnalysis, getKnowledgeBaseArticle, getAiFishInfo, getAiPlantInfo, getAiHealthReport };
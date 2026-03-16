import { getEncoding } from "js-tiktoken";

const encoding = getEncoding("cl100k_base");

export const countTokens = (text) => {
    if (!text) return 0;
    const tokens = encoding.encode(text);
    return tokens.length;
};

export const getTokenBreakdown = (text) => {
    if (!text) return [];
    const tokens = encoding.encode(text);
    return tokens.map(token => ({
        id: token,
        text: encoding.decode([token])
    }));
};

export const getCharCount = (text) => text.length;

export const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const estimateCost = (tokenCount, ratePer1k = 0.0015) => {
    return (tokenCount / 1000) * ratePer1k;
};

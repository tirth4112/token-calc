const GEMINI_API_KEY = "AIzaSyB05aM6H97aJD6luZg-rfg6TJQSW_OaHy8";

export const analyzePrompt = async (prompt) => {
    const result = {
        score: 0,
        breakdown: {
            clarity: 0,
            specificity: 0,
            context: 0,
            structure: 0
        },
        suggestions: [],
        optimizedPrompt: "",
        estimatedTime: ""
    };

    if (!prompt || prompt.trim().length === 0) return result;

    // Rule-based logic (synchronous part)
    const words = prompt.trim().split(/\s+/);
    const wordCount = words.length;

    // 1. Clarity (max 25)
    const intentVerbs = ['act', 'write', 'create', 'explain', 'analyze', 'summarize', 'translate', 'list'];
    const hasIntent = intentVerbs.some(v => prompt.toLowerCase().includes(v));
    result.breakdown.clarity = hasIntent ? 15 : 5;
    if (wordCount > 10 && wordCount < 100) result.breakdown.clarity += 10;
    else if (wordCount >= 100) result.breakdown.clarity += 5;

    // 2. Specificity (max 25)
    const specificityKeywords = ['format', 'style', 'tone', 'length', 'example', 'constraint', 'limit', 'audience'];
    const specificityMatches = specificityKeywords.filter(k => prompt.toLowerCase().includes(k)).length;
    result.breakdown.specificity = Math.min(25, 5 + (specificityMatches * 5));

    // 3. Context (max 25)
    const roleKeywords = ['you are a', 'act as a', 'expertise in', 'background', 'context', 'scenario'];
    const hasRole = roleKeywords.some(r => prompt.toLowerCase().includes(r));
    result.breakdown.context = hasRole ? 20 : 5;
    if (prompt.toLowerCase().includes('data') || prompt.toLowerCase().includes('input')) result.breakdown.context += 5;

    // 4. Structure (max 25)
    const hasLists = /^\d+\.|\*|-|•/m.test(prompt);
    const hasDelimiters = prompt.includes('"""') || prompt.includes('```') || prompt.includes('---');
    const hasParagraphs = prompt.split('\n\n').length > 1;

    result.breakdown.structure = 5;
    if (hasLists) result.breakdown.structure += 10;
    if (hasDelimiters) result.breakdown.structure += 5;
    if (hasParagraphs) result.breakdown.structure += 5;

    // Rule-based Suggestions
    if (!hasRole) result.suggestions.push("Assign a persona to the AI (e.g., 'Act as a senior software engineer').");
    if (!hasIntent) result.suggestions.push("Start with a clear action verb like 'Explain', 'Create', or 'Analyze'.");
    if (specificityMatches < 2) result.suggestions.push("Specify the desired output format, tone, or target audience.");
    if (!hasDelimiters && prompt.length > 200) result.suggestions.push("Use delimiters like triple quotes or backticks to separate instructions from content.");
    if (wordCount < 15) result.suggestions.push("The prompt is quite short. Adding more detail usually leads to better results.");

    result.score = Object.values(result.breakdown).reduce((a, b) => a + b, 0);

    // Gemini AI Optimization (Asynchronous part)
    console.log("Starting Gemini AI Optimization for prompt...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are an AI prompt optimization expert. Your goal is to rewrite the input prompt into a highly concise version that retains the EXACT same meaning but uses the fewest tokens possible, specifically for high-end LLMs like Claude or Antigravity. 
            
            Also, estimate how long (in seconds or minutes) a state-of-the-art AI like Claude 3.5 Sonnet or Antigravity would take to complete the task described in the prompt.
            
            Respond ONLY in valid JSON format with the following keys:
            "optimized_prompt": (the rewritten prompt),
            "estimated_completion_time": (a string like "15 seconds" or "2 minutes")

            Prompt to optimize:
            "${prompt}"`
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Gemini API Full Response:", data);

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            const aiResponseText = data.candidates[0].content.parts[0].text;
            console.log("Raw AI Response Text:", aiResponseText);

            // Extract JSON if AI wrapped it in markdown or added extra text
            const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const aiData = JSON.parse(jsonMatch[0]);
                    result.optimizedPrompt = aiData.optimized_prompt || "Could not optimize prompt.";
                    result.estimatedTime = aiData.estimated_completion_time || "Unknown";
                    console.log("Successfully parsed AI optimization data:", result.optimizedPrompt);
                } catch (pError) {
                    console.error("Failed to parse extracted JSON:", pError);
                    result.optimizedPrompt = aiResponseText;
                    result.estimatedTime = "Parsing error";
                }
            } else {
                console.warn("No JSON pattern found in AI response, using raw text.");
                result.optimizedPrompt = aiResponseText;
                result.estimatedTime = "Format error";
            }
        } else {
            console.error("Unexpected Gemini API structure:", data);
            result.optimizedPrompt = "API call failed - Unexpected response format.";
            result.estimatedTime = "N/A";
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        result.optimizedPrompt = "AI optimization unavailable: " + error.message;
        result.estimatedTime = "Error";
    }

    return result;
};

export async function getRecipeFromMistral(ingredientsArr) {
    const baseMessages = [
        {
            role: "system",
            content: "You are a professional chef assistant. Return detailed, practical recipes in markdown.",
        },
        {
            role: "user",
            content: `I have these ingredients: ${ingredientsArr.join(", ")}.

Give me one detailed recipe I can make.
Use this exact structure in markdown:
1) Recipe name
2) Short description
3) Servings and total time
4) Ingredients list with exact quantities
5) Step-by-step instructions (numbered, with approximate time per step)
6) Chef tips (2-4 bullets)
7) Easy substitutions (if any)

Prefer using my ingredients first, then add only a few extra common ingredients if needed.`,
        },
    ]

    const first = await requestCompletion(baseMessages)
    let fullRecipe = first.content
    let doneReason = first.doneReason

    for (let i = 0; i < 3 && doneReason === "length"; i++) {
        const next = await requestCompletion([
            ...baseMessages,
            { role: "assistant", content: fullRecipe },
            { role: "user", content: "Continue exactly where you stopped. Do not repeat previous text." },
        ])

        fullRecipe += `\n${next.content}`
        doneReason = next.doneReason
    }

    const cleanedRecipe = sanitizeModelOutput(fullRecipe)
    if (cleanedRecipe) {
        return cleanedRecipe
    }

    throw new Error("Empty model response.")
}

function sanitizeModelOutput(text) {
    return (text || "")
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/<\/?think>/gi, "")
        .trim()
}

async function requestCompletion(messages) {
    let response

    try {
        response = await fetch("/api/ollama/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama3.2:3b",
                messages,
                stream: false,
                options: {
                    temperature: 0.6,
                    num_predict: 1800,
                },
            }),
        })
    } catch {
        throw new Error("Could not reach Ollama. Start Ollama and run: ollama pull llama3.2:3b")
    }

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama API error ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    const content = data?.message?.content
    const doneReason = data?.done_reason

    if (!content) {
        throw new Error(`Unexpected Ollama response: ${JSON.stringify(data)}`)
    }

    return { content, doneReason }
}

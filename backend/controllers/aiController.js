// POST /api/ai/advice
exports.getAdvice = async (req, res, next) => {
let responseText = "";
  try {
    const { transactions, monthlyTotal } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ success: false, message: 'transactions array is required' });
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API Key is missing');
    }

    // Build a concise transaction summary for the prompt
    const categorySummary = {};
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        categorySummary[t.category] = (categorySummary[t.category] || 0) + Number(t.amount);
      }
    });

    const categoryList = Object.entries(categorySummary)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => `${cat}: ₹${amt}`)
      .join(', ');

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const prompt = `You are an expert personal finance advisor. Analyze the user's financial data carefully and provide accurate, data-driven insights. Do not assume missing values—only use the data provided.

User Data:

Monthly total spending: ₹${monthlyTotal || totalExpense}
Total income: ₹${totalIncome}
Total expenses: ₹${totalExpense}
Spending by category: ${categoryList}
Number of transactions: ${transactions.length}

Instructions:

Ensure all insights are logically consistent with the numbers.
Compare income vs expenses to detect savings or deficit.
Identify the highest spending category strictly from the category data.
Flag overspending only if expenses are close to or exceed income.
Avoid generic financial advice—base every point on actual values.
If data is incomplete or unclear, infer cautiously without fabricating details.
Keep the response concise but meaningful.

Return ONLY this JSON format (no extra text, no markdown blocks, just the raw JSON object starting with { and ending with }):

{
"summary": "1-2 sentence accurate overview including savings/deficit insight",
"alerts": "Specific warning only if applicable, otherwise 'No alerts'",
"tips": [
"Actionable tip directly tied to highest or problematic spending category",
"Actionable tip based on income vs expense balance",
"Actionable tip based on transaction behavior or spending pattern"
],
"topCategory": "Exact category name with highest spending from provided data"
}`;


    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1, // low temp for pure JSON
        response_format: { type: 'json_object' }
      })
    });

    const data = await groqRes.json();
    if (!groqRes.ok) throw new Error(data.error?.message || 'Failed to fetch from Groq');

    responseText = data.choices[0].message.content.trim();
    console.log("RAW GROQ RESPONSE:", responseText);

    // Extract JSON from the response
    let advice;
    try {
      // Clean up markdown if the model hallucinates it despite instructions
      const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      advice = JSON.parse(cleanText);
    } catch {
      throw new Error('Could not parse AI response as JSON');
    }

    res.status(200).json({ success: true, data: advice });
  } catch (error) {
    console.error('AI advice error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to generate AI advice. Please try again.',
      rawText: responseText,
      data: {
        summary: 'Unable to analyze your spending at this time.',
        alerts: `AI Service Error: ${error.message.substring(0, 50)}`,
        tips: [
          'Track your daily expenses to identify patterns.',
          'Set a monthly budget and stick to it.',
          'Review your subscriptions and cancel unused ones.',
        ],
        topCategory: 'Unknown',
      },
    });
  }
};

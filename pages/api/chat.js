const FUKUSHIMA_FACTS = {
  radiation: {
    title: "Radiation Safety",
    verified_facts: [
      "Fukushima City air-dose rate is 0.10 μSv/h in FY2025 — about 1/19 of the level right after the accident. Comparable to major cities worldwide. (Source: Fukushima Prefecture)",
      "Difficult-to-Return Zones are now only about 2.2% of Fukushima Prefecture, down from about 12% in April 2011. (Source: Fukushima Prefecture)",
      "Fukushima has 3 regions: Aizu (western, never evacuated), Nakadori (central, mostly unaffected), Hamadori (coastal, where the plant is).",
      "Only 1 confirmed radiation death (a plant worker, 2018). The ~18,500 deaths were from the earthquake and tsunami. (Source: BBC News)",
      "Japan's food radiation limit is 100 Bq/kg — stricter than US (1,200) and EU (1,250). In FY2024, only 3 out of 9,027 food tests exceeded limits. (Source: Fukushima Prefecture)",
      "49 countries have lifted ALL import restrictions on Fukushima food. (Source: Fukushima Prefecture)",
      "Chernobyl's exclusion zone: 2,600 km², unchanged for 40 years. Fukushima's: ~300 km² and shrinking."
    ],
    sources: "Fukushima Prefecture, NRA, UNSCEAR, BBC News, GOV.UK"
  },
  decontamination: {
    title: "Decontamination & Clean-up",
    verified_facts: [
      "Whole-area decontamination completed by March 2018 except Difficult-to-Return Zones. (Source: Fukushima Prefecture)",
      "Fukushima City radiation dropped 95%: from 1.91 μSv/h to 0.10 μSv/h in FY2025. (Source: Fukushima Prefecture)",
      "About 14.11 million m³ of removed soil transported to Interim Storage by July 2025. Final disposal outside Fukushima required by March 2045. (Source: Japan Environment Ministry)",
      "Spent fuel removal: Unit 4 done Dec 2014, Unit 3 done Feb 2021, Unit 2 began June 2, 2026. (Source: TEPCO)",
      "About 880 tons of melted fuel debris remain. Full removal not expected before 2037+. Humans cannot enter the containment vessels. (Source: AP News, TEPCO)",
      "Decommissioning is a 30-40 year process. (Source: METI)"
    ],
    sources: "Fukushima Prefecture, TEPCO, Japan Environment Ministry, AP News, METI"
  },
  revitalization: {
    title: "Revitalization Progress",
    verified_facts: [
      "Evacuees dropped from 160,000 (May 2012) to 23,410 (Feb 2026). (Source: Fukushima Prefecture)",
      "Infrastructure recovery 99% completed as of March 2025 — 100% for roads, bridges, ports, sewers, parks, housing. (Source: Fukushima Prefecture)",
      "JR Joban Line fully reopened March 2020. Reconstruction roads reopened Dec 2021. (Source: Reconstruction Agency)",
      "Foreign overnight visitors reached record high in FY2024. (Source: Fukushima Prefecture)",
      "49 countries lifted import restrictions on Fukushima food products. (Source: Fukushima Prefecture)",
      "Manufacturing shipments recovered to pre-disaster levels prefecture-wide, though Futaba County at ~25%. (Source: Fukushima Prefecture)",
      "Fukushima Innovation Coast: new industries in robots, drones, energy, healthcare, agriculture. (Source: METI)"
    ],
    sources: "Fukushima Prefecture, Reconstruction Agency, METI"
  },
  water: {
    title: "ALPS Treated Water",
    verified_facts: [
      "ALPS removes 62 types of radioactive material. Tritium remains because it's part of the water molecule. (Source: METI)",
      "Latest batch (June 2026): 7,927 m³ released, max tritium 243 Bq/L after dilution — well below Japan's target of 1,500 Bq/L. (Source: TEPCO)",
      "1,500 Bq/L is 1/40 of the regulatory limit and 1/7 of WHO drinking water guideline (10,000 Bq/L). (Source: METI)",
      "FY2026 plan: 8 discharges totaling ~62,400 m³ and ~11 TBq tritium, within annual limit of 22 TBq. (Source: TEPCO)",
      "IAEA 5th review (2026): nothing inconsistent with safety standards. Independent monitoring by IAEA, China, S. Korea, Switzerland. (Source: IAEA)",
      "Fukushima Prefecture monitoring June 2026: tritium below detection limit (~4.0 Bq/L). (Source: Fukushima Prefecture)",
      "Every batch analyzed by TEPCO + Japan Atomic Energy Agency before release. (Source: METI)"
    ],
    sources: "TEPCO, IAEA, METI, Fukushima Prefecture"
  }
};

const LANGUAGE_INSTRUCTIONS = {
  en: "Respond in English.",
  ar: "Respond in Arabic (العربية). Use Arabic script for your entire response.",
  ja: "Respond in Japanese (日本語). Use Japanese script for your entire response."
};

function buildSystemPrompt(topic, language) {
  const topicData = FUKUSHIMA_FACTS[topic];
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.en;

  return `You are "Daiichi" — a fun, friendly Fukushima myth-busting quiz bot created by Abdulrahman Alblooshi at IER, Fukushima University.

YOUR STYLE:
- Be SHORT (2-3 sentences max per message). Never write paragraphs.
- Be FUN and casual. Use emojis. Be encouraging like a game show host.
- After revealing a fact, always include ONE specific number/stat from the verified facts below.

YOUR METHOD — Quiz-Based Inoculation:
You test users with True/False and MCQ questions about Fukushima myths. Here's the flow:

1. INTRO (first message only): Say hi in 1 sentence + immediately ask Question 1.
2. ASK: Present a True/False or MCQ question (mix them up). Format like:
   "🤔 True or False: [statement about Fukushima]"
   OR
   "Which one is correct?
   A) [option]
   B) [option]  
   C) [option]"
3. RESPOND: When user answers:
   - If CORRECT: "✅ Correct! [one fun sentence with a specific fact]"
   - If WRONG: "❌ Not quite! [one fun sentence with the real fact]"
4. NEXT: Immediately follow up with the next question. Don't wait.
5. END: After 4-5 questions, show a score like "🎉 You got 4/5! You're now inoculated against Fukushima myths!" and suggest trying another topic.

CURRENT TOPIC: ${topicData.title}

VERIFIED FACTS TO USE IN QUESTIONS (use these exact numbers):
${topicData.verified_facts.map((f, i) => `${i + 1}. ${f}`).join("\n")}

SOURCES: ${topicData.sources}

RULES:
- NEVER agree with misinformation.
- ALWAYS use specific numbers from the verified facts, not vague words.
- Keep it SHORT. If your message is longer than 4 lines, it's too long. Cut it.
- Make wrong MCQ options sound believable but incorrect.
- Track the score and show it at the end.
- ${langInstruction}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, topic, language } = req.body;

  if (!messages || !topic) {
    return res.status(400).json({ error: "Missing messages or topic" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  const systemPrompt = buildSystemPrompt(topic, language || "en");

  const geminiMessages = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: geminiMessages,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        const msg = data.error.message || "";
        if (response.status === 429 || msg.includes("quota") || msg.includes("rate")) {
          const match = msg.match(/retry in ([\d.]+)s/i);
          const waitSec = match ? Math.ceil(parseFloat(match[1])) + 1 : 5;
          if (attempt < maxRetries - 1) {
            await new Promise((r) => setTimeout(r, waitSec * 1000));
            continue;
          } else {
            return res.status(429).json({ error: "Rate limited", retryAfter: waitSec });
          }
        }
        return res.status(500).json({ error: data.error.message });
      }

      const text =
        data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text)
          .join("") || "Sorry, I could not generate a response.";

      return res.status(200).json({ response: text });
    } catch (err) {
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 3000));
        continue;
      }
      return res.status(500).json({ error: err.message });
    }
  }
}

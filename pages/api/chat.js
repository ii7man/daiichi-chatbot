const FUKUSHIMA_FACTS = {
  radiation: {
    title: "Radiation Safety",
    myths: [
      "The whole of Fukushima is a radioactive wasteland",
      "Radiation levels are still dangerously high everywhere",
      "It is unsafe to live in or visit Fukushima"
    ],
    facts: [
      "97% of Fukushima Prefecture has normal background radiation levels, similar to major world cities.",
      "The restricted zone has shrunk from 1,150 km² in 2013 to approximately 300 km² today.",
      "Only 1 confirmed radiation death (a plant worker). Most of the ~18,500 deaths were from the tsunami itself.",
      "Fukushima has 3 distinct regions: Aizu (western mountains, never evacuated), Nakadori (central valley, mostly unaffected), and Hamadori (coastal, where the plant is located).",
      "Chernobyl's exclusion zone is 2,600 km² and unchanged for 40 years. Fukushima's is ~300 km² and shrinking."
    ],
    sources: "UNSCEAR reports, NRA RAMIS monitoring portal, Britannica"
  },
  food: {
    title: "Food & Contamination",
    myths: [
      "All food from Fukushima is contaminated and dangerous to eat",
      "The entire prefecture is contaminated",
      "Fukushima produce should be avoided"
    ],
    facts: [
      "Japan's radiation limit for food is 100 Bq/kg — far stricter than the US (1,200 Bq/kg) and EU (1,250 Bq/kg).",
      "Both the US and EU have lifted ALL import restrictions on Fukushima food products.",
      "Fukushima rice, peaches, and sake have passed every safety test since 2015.",
      "Only the coastal Hamadori area near the plant was significantly affected. Aizu and Nakadori regions were largely unaffected.",
      "97% of the prefecture has normal radiation levels."
    ],
    sources: "Japan Ministry of Health, US FDA, European Commission"
  },
  decontamination: {
    title: "Decontamination & Cleanup",
    myths: [
      "Cleanup is impossible and Fukushima will never recover",
      "No real progress has been made since 2011",
      "The area will be uninhabitable for thousands of years like Chernobyl"
    ],
    facts: [
      "73% of previously restricted areas have been reopened for residents.",
      "The restricted zone shrank from 1,150 km² (2013) to ~300 km² today.",
      "New schools, hospitals, and community centers have been rebuilt in reopened towns.",
      "About 880 tons of melted fuel debris remain inside the reactors. Full removal is planned but not expected before 2037+.",
      "Active decontamination continues in the remaining Hamadori coastal zone."
    ],
    sources: "Japan Reconstruction Agency, TEPCO decommissioning reports"
  },
  water: {
    title: "ALPS Treated Water",
    myths: [
      "Japan is dumping nuclear waste directly into the ocean",
      "The treated water release makes seafood unsafe",
      "The water is radioactive and unmonitored"
    ],
    facts: [
      "The water is treated through ALPS (Advanced Liquid Processing System) which removes 62 types of radioactive material.",
      "The remaining tritium is diluted to 230 Bq/L — that is 43 times below the WHO drinking water limit of 10,000 Bq/L.",
      "The IAEA's 6th review (May 2026) confirmed: no radiological harm to people or the environment.",
      "The release is continuously monitored by both TEPCO and independent IAEA inspectors on-site.",
      "Tritium occurs naturally in seawater and is released by nuclear plants worldwide."
    ],
    sources: "IAEA review reports, WHO guidelines, TEPCO monitoring data"
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

  return `You are "Daiichi" — a Fukushima myth-busting AI chatbot created by Abdulrahman Alblooshi at the Institute of Environmental Radioactivity (IER), Fukushima University, under the supervision of Dr. Maksym Gusyev and Dr. Philip McCasland.

Your method is "Conversational Inoculation" (from the MindFort paper by Szabo et al., ACM CHI 2026). This means:
1. You present a common myth about Fukushima to the user.
2. You ask the user to think about WHY this myth might be wrong and to argue against it.
3. After the user tries, you reveal the real facts with specific numbers and sources.
4. You reinforce the correct information so the user remembers both the myth AND the truth.

CURRENT TOPIC: ${topicData.title}

COMMON MYTHS about this topic:
${topicData.myths.map((m, i) => `${i + 1}. "${m}"`).join("\n")}

VERIFIED FACTS:
${topicData.facts.map((f, i) => `${i + 1}. ${f}`).join("\n")}

SOURCES: ${topicData.sources}

CONVERSATION FLOW:
- Start by greeting the user warmly and introducing yourself as Daiichi.
- Present ONE myth from the list above.
- Ask: "Many people believe this. But can you think of any reasons why this might not be true?"
- Let the user try to argue against the myth. Encourage them even if their answer is partial.
- Then reveal the full facts with specific numbers.
- After covering all myths in this topic, congratulate the user and say they have been "inoculated" against this misconception.
- Keep responses concise (3-5 sentences per message). Use simple language.

IMPORTANT RULES:
- Never agree with misinformation. Always correct it.
- Always use specific numbers and dates, not vague words.
- Be warm, encouraging, and supportive — like a friendly teacher.
- If the user asks about a different Fukushima topic, you can briefly answer but guide them back.
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
      return res.status(500).json({ error: data.error.message });
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "Sorry, I could not generate a response.";

    return res.status(200).json({ response: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

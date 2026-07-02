// ============================================================
// Daiichi Chatbot — API Route (Enriched with ChatGPT Pro 60/60 data)
// ============================================================

const FUKUSHIMA_FACTS = {
  radiation: {
    title: "Radiation Safety & Living/Visiting",
    myths: [
      "The whole of Fukushima is a radioactive wasteland",
      "Radiation levels are still dangerously high everywhere",
      "It is unsafe to live in or visit Fukushima"
    ],
    verified_facts: [
      "Fukushima City air-dose rate is 0.10 μSv/h in FY2025 — about 1/19 of the level measured right after the accident (1.91 μSv/h). This is comparable to major cities worldwide. (Source: Fukushima Prefecture)",
      "Difficult-to-Return Zones are now only about 2.2% of Fukushima Prefecture, down from about 12% under evacuation in April 2011. (Source: Fukushima Prefecture, Reconstruction Agency)",
      "Fukushima has 3 distinct regions: Aizu (western mountains — never evacuated, famous for sake and skiing), Nakadori (central valley — mostly unaffected, includes Fukushima City), and Hamadori (coastal — where the plant is, small zone still restricted).",
      "Only 1 confirmed radiation death (a plant worker, confirmed 2018). The ~18,500 deaths from March 2011 were caused by the earthquake and tsunami, not radiation. (Source: BBC News, Britannica)",
      "Japan's food radiation limit is 100 Bq/kg — far stricter than the US (1,200 Bq/kg) and EU (1,250 Bq/kg). In FY2024, Fukushima conducted 9,027 shipment-confirmation inspections across 510 products, with only 3 exceedances. (Source: Fukushima Prefecture)",
      "Both the US and EU have lifted ALL import restrictions on Fukushima food products. 49 countries and regions have lifted restrictions. (Source: Fukushima Prefecture)",
      "The UK government travel advice confirms Fukushima is safe to visit, noting only a restricted area around the Daiichi plant where only authorized people may enter. (Source: GOV.UK)",
      "Chernobyl's exclusion zone is 2,600 km² and unchanged for nearly 40 years. Fukushima's restricted zone has shrunk from 1,150 km² to about 300 km² and continues shrinking."
    ],
    sources: "Fukushima Prefecture official monitoring, NRA (RAMIS portal), UNSCEAR, BBC News, GOV.UK travel advice, Britannica"
  },
  decontamination: {
    title: "Decontamination & Clean-up",
    myths: [
      "Cleanup is impossible and Fukushima will never recover",
      "No real progress has been made since 2011",
      "The area will be uninhabitable for thousands of years like Chernobyl"
    ],
    verified_facts: [
      "Whole-area decontamination was completed by March 2018 except for Difficult-to-Return Zones. Decontamination in Specified Reconstruction and Revitalization Base Areas is almost complete and evacuation orders have been lifted there. (Source: Fukushima Prefecture)",
      "Air-dose rates fell dramatically: Fukushima City went from 1.91 μSv/h right after the accident to 0.10 μSv/h in FY2025 — a 95% reduction. (Source: Fukushima Prefecture)",
      "Evacuation zones shrank from about 12% of prefectural land (April 2011) to about 2.2% (Difficult-to-Return Zones). (Source: Fukushima Prefecture, Reconstruction Agency)",
      "About 14.11 million cubic meters of removed soil and waste had been transported to the Interim Storage Facility by end of July 2025. Final disposal outside Fukushima is legally required by March 2045. (Source: Japan Environment Ministry, Decontamination Information Site)",
      "Spent fuel removal progress: Unit 4 completed December 2014, Unit 3 completed February 2021, Unit 2 began June 2, 2026 (completion expected FY2028). Unit 1 large cover completed January 2026, full-scale rubble removal began June 2026. (Source: TEPCO)",
      "About 880 tons of melted fuel debris remain in the three damaged reactors. Full-scale removal is not expected before 2037 or later. TEPCO describes this as extremely difficult — humans cannot enter the containment vessels. (Source: AP News, TEPCO, METI)",
      "Decommissioning of Units 1-4 is described as a 30- to 40-year process by METI. (Source: METI)"
    ],
    sources: "Fukushima Prefecture, Japan Environment Ministry, TEPCO decommissioning reports, AP News, METI"
  },
  revitalization: {
    title: "Revitalization Progress",
    myths: [
      "Nobody has returned to Fukushima — it's a ghost town",
      "There has been little to no progress in rebuilding",
      "Fukushima's economy is dead"
    ],
    verified_facts: [
      "Evacuees dropped from about 160,000 (May 2012) to 23,410 (February 1, 2026). Many people have returned, though some still cannot return to their original homes. (Source: Fukushima Prefecture)",
      "Infrastructure recovery: as of March 31, 2025, disaster-recovery construction was 99% completed — 100% for roads, bridges, ports, fishing ports, sewers, parks, and public housing. Coastal works at 98%. (Source: Fukushima Prefecture)",
      "JR Joban Line (the main coastal railway) fully reopened in March 2020. Reconstruction roads and support roads fully reopened December 2021. (Source: Reconstruction Agency)",
      "New facilities built in reopened areas include commercial centers, Futaba Medical Center, public housing near Futaba Station, and Okuma Town's Manabiya Yumenomori educational facility. (Source: Reconstruction Agency)",
      "Tourism: foreign overnight visitors reached a record high in FY2024. Overall tourism is recovering but still below pre-2011 levels. (Source: Fukushima Prefecture)",
      "49 countries and regions have lifted import restrictions on Fukushima agricultural, forestry, and fishery products. (Source: Fukushima Prefecture)",
      "Manufacturing shipment values for the prefecture as a whole have recovered to pre-disaster levels, though Futaba County remains at about 25% of pre-disaster levels. (Source: Fukushima Prefecture)",
      "Fukushima Innovation Coast Framework launched by METI: new industries in decommissioning, robots/drones, energy, healthcare, agriculture, and aerospace. Progress made but region has not yet fully achieved autonomous sustainable development. (Source: METI)"
    ],
    sources: "Fukushima Prefecture, Reconstruction Agency (Fukushima Updates), METI, Fukushima Innovation Coast"
  },
  water: {
    title: "ALPS Treated Water",
    myths: [
      "Japan is dumping nuclear waste directly into the ocean",
      "The treated water release makes seafood unsafe",
      "The water is radioactive and not properly monitored"
    ],
    verified_facts: [
      "ALPS (Advanced Liquid Processing System) removes 62 types of radioactive material. Tritium remains because it is chemically part of the water molecule and cannot be separated at this scale.",
      "Latest completed batch (June 1-20, 2026): about 7,927 m³ released, containing about 1.3 TBq of tritium. Maximum tritium concentration after dilution: 243 Bq/L — well below Japan's operational target of 1,500 Bq/L. (Source: TEPCO)",
      "Japan's operational target of 1,500 Bq/L is 1/40 of the regulatory discharge limit and about 1/7 of the WHO drinking-water guideline of 10,000 Bq/L. (Source: METI)",
      "FY2026 plan: 8 discharges totaling about 62,400 m³ and about 11 TBq of tritium, well within the annual limit of 22 TBq. (Source: TEPCO)",
      "Seawater monitoring: TEPCO's FY2026 results show maximum tritium within 3 km of plant at 27 Bq/L; 10 km results below detection limits. Fukushima Prefecture's own June 18, 2026 rapid analysis found tritium below detection limit (~4.0 Bq/L). (Source: TEPCO, Fukushima Prefecture)",
      "IAEA 5th post-discharge review (2026): found nothing inconsistent with relevant international safety standards. IAEA conducts independent source and environmental monitoring to corroborate Japanese data. (Source: IAEA, METI)",
      "On June 24-25, 2026, IAEA officials and experts from China, South Korea, and Switzerland collected seawater samples near Fukushima Daiichi and fishery products in Iwaki as part of additional monitoring. (Source: Japan Ministry of Foreign Affairs)",
      "Two temporary suspensions occurred in June 2026 (alarm + lightning), but TEPCO confirmed no out-of-standard water was released and no environmental impact was found. (Source: TEPCO)",
      "Every batch is analyzed by TEPCO and the independent Japan Atomic Energy Agency before discharge to confirm non-tritium radionuclides meet limits. (Source: METI)"
    ],
    sources: "TEPCO monitoring data, IAEA review reports, METI, Fukushima Prefecture, Japan Ministry of Foreign Affairs"
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
3. After the user tries, you reveal the real facts with SPECIFIC NUMBERS, DATES, AND SOURCES.
4. You reinforce the correct information so the user remembers both the myth AND the truth.

CURRENT TOPIC: ${topicData.title}

COMMON MYTHS about this topic:
${topicData.myths.map((m, i) => `${i + 1}. "${m}"`).join("\n")}

VERIFIED FACTS (from ChatGPT Pro analysis, scored 60/60 in our research testing — USE THESE EXACT NUMBERS):
${topicData.verified_facts.map((f, i) => `${i + 1}. ${f}`).join("\n")}

SOURCES: ${topicData.sources}

CONVERSATION FLOW:
- Start by greeting the user warmly and introducing yourself as Daiichi, a Fukushima myth-busting chatbot built at IER, Fukushima University.
- Present ONE myth from the list above. Frame it as: "Many people believe that [myth]. What do you think — is this true or false? Can you think of reasons why it might be wrong?"
- Let the user try to argue against the myth. Praise their effort even if partial ("Good thinking!" or "You're on the right track!").
- Then reveal the verified facts with SPECIFIC numbers (e.g., "0.10 μSv/h", "2.2%", "23,410 evacuees", "243 Bq/L"). Always name the source.
- After covering all myths in this topic (usually 2-3 myths), congratulate the user and say they have been "inoculated" against this misconception. Offer to move to another topic.
- Keep responses concise (3-5 sentences per message). Use simple, clear language.

CRITICAL RULES:
- NEVER agree with misinformation. Always correct myths firmly but kindly.
- ALWAYS use specific numbers, dates, and named sources from the verified facts above. Never use vague words like "low" or "recent" or "some."
- Be warm, encouraging, and supportive — like a friendly teacher who genuinely cares.
- If the user asks something outside this topic, briefly acknowledge it but guide them back.
- If the user asks about Chernobyl comparison, use: Chernobyl zone = 2,600 km² unchanged for ~40 years; Fukushima zone = ~300 km² and shrinking; Chernobyl had ~30 direct deaths + thousands from fallout; Fukushima had 1 confirmed radiation death.
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

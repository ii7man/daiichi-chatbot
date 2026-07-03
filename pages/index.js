import { useState, useRef, useEffect } from "react";
import Head from "next/head";

const TOPICS = {
  radiation: { emoji: "☢️", en: "Radiation Safety", ar: "السلامة الإشعاعية", ja: "放射線の安全性" },
  revitalization: { emoji: "🏘️", en: "Revitalization", ar: "إعادة الإعمار", ja: "復興の進展" },
  decontamination: { emoji: "🏗️", en: "Decontamination", ar: "إزالة التلوث", ja: "除染と復旧" },
  water: { emoji: "🌊", en: "ALPS Treated Water", ar: "مياه ALPS المعالجة", ja: "ALPS処理水" },
};

const LANGUAGES = {
  en: { label: "English", flag: "🇬🇧", dir: "ltr" },
  ar: { label: "العربية", flag: "🇦🇪", dir: "rtl" },
  ja: { label: "日本語", flag: "🇯🇵", dir: "ltr" },
};

const UI_TEXT = {
  en: {
    title: "Daiichi",
    subtitle: "Fukushima Myth-Buster",
    chooseTopic: "What would you like to explore?",
    typeMessage: "Say something...",
    send: "Send",
    credit: "IER Research Team · Fukushima University",
    back: "← Topics",
    learnBtn: "📚 Learn",
    learnTitle: "Fukushima: Key Facts",
    learnClose: "Close",
    consentTitle: "Before we chat...",
    consentText: "Would you be willing to share this conversation with the IER research team? It helps us understand how people learn about Fukushima. You can still chat either way.",
    consentAgree: "✅ Yes, share my chat",
    consentDecline: "No thanks, keep it private",
    refs: "📎 References",
  },
  ar: {
    title: "دايتشي",
    subtitle: "كاشف خرافات فوكوشيما",
    chooseTopic: "ماذا تريد أن تستكشف؟",
    typeMessage: "قل شيئاً...",
    send: "إرسال",
    credit: "فريق أبحاث IER · جامعة فوكوشيما",
    back: "→ المواضيع",
    learnBtn: "📚 تعلّم",
    learnTitle: "فوكوشيما: الحقائق الأساسية",
    learnClose: "إغلاق",
    consentTitle: "قبل أن نبدأ...",
    consentText: "هل توافق على مشاركة هذه المحادثة مع فريق أبحاث IER؟ يساعدنا ذلك في فهم كيفية تعلم الناس عن فوكوشيما.",
    consentAgree: "✅ نعم، شارك محادثتي",
    consentDecline: "لا شكراً، أبقها خاصة",
    refs: "📎 المراجع",
  },
  ja: {
    title: "ダイイチ",
    subtitle: "福島の誤解を正すチャットボット",
    chooseTopic: "何について話しますか？",
    typeMessage: "メッセージを入力...",
    send: "送信",
    credit: "IER研究チーム・福島大学",
    back: "← トピック",
    learnBtn: "📚 学ぶ",
    learnTitle: "福島：重要な事実",
    learnClose: "閉じる",
    consentTitle: "チャットを始める前に",
    consentText: "この会話をIER研究チームと共有してもよいですか？福島についての学習方法を理解するのに役立ちます。",
    consentAgree: "✅ はい、共有します",
    consentDecline: "いいえ、プライベートで",
    refs: "📎 参考文献",
  },
};

const FACT_SHEETS = {
  en: [
    { emoji: "💥", title: "What Happened in 2011?", text: "A 9.0 earthquake triggered a massive tsunami that hit Japan's coast on March 11, 2011. The tsunami knocked out cooling at Fukushima Daiichi, causing 3 reactor meltdowns. About 18,500 people died — almost all from the tsunami itself, not radiation.", stat: "1", statLabel: "confirmed radiation death (a plant worker, 2018)" },
    { emoji: "🗾", title: "3 Very Different Regions", text: "Fukushima Prefecture is huge! Aizu (western mountains) was never evacuated and is famous for sake and skiing. Nakadori (central valley) includes Fukushima City — mostly unaffected. Only the coastal Hamadori area near the plant had significant restrictions.", stat: "97%", statLabel: "of Fukushima has normal radiation levels" },
    { emoji: "📉", title: "Radiation Dropped 95%", text: "Radiation in Fukushima City fell from 1.91 μSv/h right after the accident to just 0.10 μSv/h in FY2025 — comparable to Tokyo and major cities worldwide. The restricted zone shrank from 12% to 2.2% of the prefecture.", stat: "0.10 μSv/h", statLabel: "Fukushima City, FY2025 (Source: Fukushima Prefecture)" },
    { emoji: "🍚", title: "Food Safety", text: "Japan's radiation limit for food (100 Bq/kg) is 12x stricter than the US (1,200 Bq/kg) and EU (1,250 Bq/kg). In FY2024, only 3 of 9,027 Fukushima food tests exceeded limits. 49 countries lifted all import bans.", stat: "3 / 9,027", statLabel: "food tests exceeded limits in FY2024" },
    { emoji: "🌊", title: "ALPS Treated Water", text: "Water is filtered through ALPS to remove 62 radioactive substances. The remaining tritium is diluted to 243 Bq/L — that's 43x below WHO drinking water limits. The IAEA independently monitors every release.", stat: "243 Bq/L", statLabel: "tritium level — vs WHO limit of 10,000 Bq/L" },
    { emoji: "🏘️", title: "Recovery in Progress", text: "Evacuees dropped from 160,000 (2012) to 23,410 (Feb 2026). Infrastructure is 99% rebuilt. JR rail line fully reopened March 2020. Tourism hit a record high in FY2024. New robotics and energy industries are growing.", stat: "99%", statLabel: "infrastructure rebuilt (Source: Reconstruction Agency)" },
  ],
  ar: [
    { emoji: "💥", title: "ماذا حدث في 2011؟", text: "زلزال بقوة 9.0 ضرب اليابان في 11 مارس 2011، مُحدثاً تسونامي ضخماً. أوقف التسونامي نظام التبريد في محطة فوكوشيما دايتشي مما أدى إلى انصهار 3 مفاعلات. توفي حوالي 18,500 شخص — معظمهم بسبب التسونامي وليس الإشعاع.", stat: "1", statLabel: "حالة وفاة مؤكدة بالإشعاع (عامل في المحطة، 2018)" },
    { emoji: "🗾", title: "3 مناطق مختلفة تماماً", text: "محافظة فوكوشيما شاسعة! آيزو (الجبال الغربية) لم يتم إخلاؤها أبداً وتشتهر بصناعة الساكي والتزلج. ناكادوري (الوادي المركزي) يضم مدينة فوكوشيما وتأثر قليلاً. فقط منطقة هامادوري الساحلية قرب المحطة شهدت قيوداً.", stat: "97%", statLabel: "من فوكوشيما بمستوى إشعاع طبيعي" },
    { emoji: "📉", title: "انخفض الإشعاع 95%", text: "انخفض الإشعاع في مدينة فوكوشيما من 1.91 μSv/h بعد الحادث مباشرة إلى 0.10 μSv/h في 2025 — مماثل لطوكيو والمدن الكبرى. تقلصت المنطقة المحظورة من 12% إلى 2.2%.", stat: "0.10 μSv/h", statLabel: "مدينة فوكوشيما، 2025 (المصدر: محافظة فوكوشيما)" },
    { emoji: "🍚", title: "سلامة الغذاء", text: "حد الإشعاع الغذائي في اليابان (100 بيكريل/كجم) أكثر صرامة 12 مرة من أمريكا (1,200) وأوروبا (1,250). في 2024، فقط 3 من 9,027 فحص غذائي تجاوزت الحد. 49 دولة رفعت كل قيود الاستيراد.", stat: "3 / 9,027", statLabel: "فحوصات غذائية تجاوزت الحد في 2024" },
    { emoji: "🌊", title: "مياه ALPS المعالجة", text: "تتم معالجة المياه عبر ALPS لإزالة 62 مادة مشعة. يتم تخفيف التريتيوم المتبقي إلى 243 بيكريل/لتر — أقل 43 مرة من حد مياه الشرب للـ WHO. تراقب الوكالة الدولية للطاقة الذرية كل عملية إطلاق.", stat: "243 Bq/L", statLabel: "مستوى التريتيوم — مقابل حد WHO البالغ 10,000" },
    { emoji: "🏘️", title: "التعافي مستمر", text: "انخفض النازحون من 160,000 (2012) إلى 23,410 (فبراير 2026). أُعيد بناء البنية التحتية بنسبة 99%. أُعيد افتتاح خط السكك الحديدية مارس 2020. السياحة سجلت رقماً قياسياً في 2024.", stat: "99%", statLabel: "إعادة بناء البنية التحتية (المصدر: وكالة إعادة الإعمار)" },
  ],
  ja: [
    { emoji: "💥", title: "2011年に何が起きた？", text: "2011年3月11日、マグニチュード9.0の地震が巨大津波を引き起こしました。津波が福島第一原子力発電所の冷却システムを停止させ、3基のメルトダウンが発生。約18,500人が亡くなりましたが、ほぼ全員が津波によるものです。", stat: "1", statLabel: "放射線による確認された死亡（2018年、作業員）" },
    { emoji: "🗾", title: "3つの全く異なる地域", text: "福島県は広大です！会津（西部山地）は避難なし、日本酒とスキーで有名。中通り（中央盆地）は福島市を含み、ほぼ影響なし。制限があったのは発電所近くの浜通り沿岸だけです。", stat: "97%", statLabel: "の福島は正常な放射線レベル" },
    { emoji: "📉", title: "放射線が95%減少", text: "福島市の放射線は事故直後の1.91 μSv/hから2025年度には0.10 μSv/hに低下 — 東京や主要都市と同レベル。制限区域は県面積の12%から2.2%に縮小しました。", stat: "0.10 μSv/h", statLabel: "福島市、2025年度（出典：福島県）" },
    { emoji: "🍚", title: "食品の安全性", text: "日本の食品放射能基準（100 Bq/kg）は米国（1,200）やEU（1,250）より12倍厳しい。2024年度、9,027件の検査で基準超過はわずか3件。49カ国が輸入規制を完全解除。", stat: "3 / 9,027", statLabel: "2024年度の食品検査で基準超過" },
    { emoji: "🌊", title: "ALPS処理水", text: "ALPSで62種類の放射性物質を除去。残るトリチウムは243 Bq/Lに希釈 — WHO飲料水基準（10,000 Bq/L）の43分の1。IAEAがすべての放出を独立して監視。", stat: "243 Bq/L", statLabel: "トリチウム濃度 — WHO基準10,000 Bq/L比" },
    { emoji: "🏘️", title: "復興進行中", text: "避難者は160,000人（2012年）から23,410人（2026年2月）に減少。インフラは99%復旧。JR常磐線は2020年3月全線再開。2024年度の外国人観光客数は過去最高を記録。", stat: "99%", statLabel: "インフラ復旧率（出典：復興庁）" },
  ],
};

const REFERENCES = [
  { label: "Fukushima Prefecture Monitoring", url: "https://www.pref.fukushima.lg.jp/site/portal-english/" },
  { label: "IAEA – ALPS Water Reviews", url: "https://www.iaea.org/topics/fukushima-daiichi-nuclear-power-station" },
  { label: "TEPCO Decommissioning Updates", url: "https://www.tepco.co.jp/en/hd/decommission/" },
  { label: "UNSCEAR 2020/2021 Report", url: "https://www.unscear.org/unscear/en/publications/2020_2021_1.html" },
  { label: "Reconstruction Agency – Fukushima", url: "https://www.reconstruction.go.jp/english/" },
  { label: "Japan Environment Ministry – Decontamination", url: "https://josen.env.go.jp/en/" },
  { label: "METI – ALPS Water", url: "https://www.meti.go.jp/english/earthquake/nuclear/decommissioning/alps.html" },
  { label: "WHO – Drinking Water Guidelines", url: "https://www.who.int/publications/i/item/9789241549950" },
];

function generateSessionId() {
  return "sess_" + Math.random().toString(36).slice(2) + "_" + Date.now();
}

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [topic, setTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showLearn, setShowLearn] = useState(false);
  const [showRefs, setShowRefs] = useState(false);
  const [consent, setConsent] = useState(null); // null = not asked, true/false = answered
  const [sessionId] = useState(generateSessionId);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const countdownRef = useRef(null);

  const t = UI_TEXT[language];
  const dir = LANGUAGES[language].dir;
  const facts = FACT_SHEETS[language] || FACT_SHEETS.en;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, countdown]);

  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(countdownRef.current);
    }
  }, [countdown]);

  // Save to localStorage on every message change
  useEffect(() => {
    if (topic && messages.length > 0) {
      localStorage.setItem("daiichi_chat", JSON.stringify({ topic, language, messages }));
    }
  }, [messages, topic, language]);

  // Restore from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem("daiichi_chat");
    if (saved) {
      try {
        const { topic: t, language: l, messages: m } = JSON.parse(saved);
        if (t && m && m.length > 0) {
          setTopic(t);
          setLanguage(l || "en");
          setMessages(m);
        }
      } catch (e) {}
    }
  }, []);

  async function callAPI(msgs, topicKey, lang) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs, topic: topicKey, language: lang }),
    });
    const data = await res.json();
    if (res.status === 429 && data.retryAfter) {
      const waitSec = Math.min(data.retryAfter + 2, 30);
      setCountdown(waitSec);
      await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));
      setCountdown(0);
      const res2 = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs, topic: topicKey, language: lang }),
      });
      return await res2.json();
    }
    return data;
  }

  async function saveToSupabase(msgs) {
    try {
      await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs,
          topic,
          language,
          sessionId,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (e) {
      // Silent fail — don't bother user if save fails
    }
  }

  async function startTopic(topicKey) {
    setTopic(topicKey);
    setMessages([]);
    localStorage.removeItem("daiichi_chat");
    setLoading(true);
    try {
      const data = await callAPI(
        [{ role: "user", content: "Start the conversation naturally." }],
        topicKey, language
      );
      const initMsg = [{ role: "assistant", content: data.error ? "Error: " + data.error : data.response }];
      setMessages(initMsg);
    } catch (err) {
      setMessages([{ role: "assistant", content: "Connection error: " + err.message }]);
    }
    setLoading(false);
    setCountdown(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const data = await callAPI(newMessages, topic, language);
      const finalMessages = [...newMessages, { role: "assistant", content: data.error ? "Error: " + data.error : data.response }];
      setMessages(finalMessages);
      // Auto-save if user consented
      if (consent === true) {
        await saveToSupabase(finalMessages);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Connection error: " + err.message }]);
    }
    setLoading(false);
    setCountdown(0);
  }

  function goBack() {
    setTopic(null);
    setMessages([]);
    setInput("");
    localStorage.removeItem("daiichi_chat");
  }

  function handleConsent(agreed) {
    setConsent(agreed);
    if (agreed && messages.length > 0) {
      saveToSupabase(messages);
    }
  }

  return (
    <>
      <Head>
        <title>Daiichi — Fukushima Myth-Buster</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Conversational AI that corrects Fukushima misconceptions. Built by IER Research Team, Fukushima University." />
      </Head>

      <div style={{ ...styles.container, direction: dir }}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.logo}>🌿</div>
            <div>
              <h1 style={styles.headerTitle}>{t.title}</h1>
              <p style={styles.headerSub}>{t.subtitle}</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.langBar}>
              {Object.entries(LANGUAGES).map(([key, val]) => (
                <button key={key}
                  onClick={() => { setLanguage(key); setTopic(null); setMessages([]); localStorage.removeItem("daiichi_chat"); }}
                  style={{ ...styles.langBtn, ...(language === key ? styles.langBtnActive : {}) }}>
                  {val.flag} {val.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {!topic ? (
          <main style={styles.topicScreen}>
            <div style={styles.heroSection}>
              <div style={styles.heroEmoji}>🌱</div>
              <h2 style={styles.heroTitle}>{t.chooseTopic}</h2>
            </div>
            <div style={styles.topicGrid}>
              {Object.entries(TOPICS).map(([key, val]) => (
                <button key={key} onClick={() => startTopic(key)} style={styles.topicCard}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,58,42,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,58,42,0.08)"; }}>
                  <span style={styles.topicEmoji}>{val.emoji}</span>
                  <span style={styles.topicLabel}>{val[language]}</span>
                </button>
              ))}
            </div>
            <footer style={styles.footer}>{t.credit}</footer>
          </main>
        ) : (
          <div style={styles.chatScreen}>
            <div style={styles.topicBar}>
              <button onClick={goBack} style={styles.backBtn}>{t.back}</button>
              <span style={styles.topicBarLabel}>{TOPICS[topic].emoji} {TOPICS[topic][language]}</span>
            </div>

            {/* Consent banner */}
            {consent === null && messages.length >= 3 && (
              <div style={styles.consentBanner}>
                <p style={styles.consentTitle}>{t.consentTitle}</p>
                <p style={styles.consentText}>{t.consentText}</p>
                <div style={styles.consentBtns}>
                  <button onClick={() => handleConsent(true)} style={styles.consentAgree}>{t.consentAgree}</button>
                  <button onClick={() => handleConsent(false)} style={styles.consentDecline}>{t.consentDecline}</button>
                </div>
              </div>
            )}

            <div style={styles.chatMessages}>
              {messages.map((msg, i) => (
                <div key={i} style={{ ...styles.msgRow, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  {msg.role === "assistant" && <div style={styles.botAvatar}>🌿</div>}
                  <div style={{ ...styles.bubble, ...(msg.role === "user" ? styles.userBubble : styles.botBubble) }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
                  <div style={styles.botAvatar}>🌿</div>
                  <div style={{ ...styles.bubble, ...styles.botBubble, ...styles.loadingBubble }}>
                    {countdown > 0
                      ? <span style={styles.countdownText}>{language === "ar" ? `⏳ ~${countdown}s جاري الانتظار...` : language === "ja" ? `⏳ ~${countdown}秒 お待ちください...` : `⏳ ~${countdown}s please wait...`}</span>
                      : <><span style={styles.dot} /><span style={styles.dot} /><span style={styles.dot} /></>}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} style={styles.inputBar}>
              <input ref={inputRef} type="text" value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.typeMessage}
                style={{ ...styles.input, direction: dir }}
                disabled={loading} />
              <button type="submit" style={styles.sendBtn} disabled={loading || !input.trim()}>{t.send}</button>
            </form>
          </div>
        )}

        {/* FAB Buttons */}
        <div style={styles.fabGroup}>
          <button onClick={() => setShowRefs(true)} style={{ ...styles.fab, background: "#40916c", fontSize: 14, width: "auto", borderRadius: 20, padding: "0 14px" }}>
            {t.refs}
          </button>
          <button onClick={() => setShowLearn(true)} style={styles.fab}>📚</button>
        </div>

        {/* Learn Modal */}
        {showLearn && (
          <div style={styles.modalOverlay} onClick={() => setShowLearn(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>{t.learnTitle}</h2>
                <button onClick={() => setShowLearn(false)} style={styles.modalClose}>✕</button>
              </div>
              <div style={styles.modalBody}>
                {facts.map((fact, i) => (
                  <div key={i} style={styles.factCard}>
                    <div style={styles.factTop}>
                      <span style={styles.factEmoji}>{fact.emoji}</span>
                      <h3 style={styles.factTitle}>{fact.title}</h3>
                    </div>
                    <p style={styles.factText}>{fact.text}</p>
                    <div style={styles.factStat}>
                      <span style={styles.factStatNum}>{fact.stat}</span>
                      <span style={styles.factStatLabel}>{fact.statLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* References Modal */}
        {showRefs && (
          <div style={styles.modalOverlay} onClick={() => setShowRefs(false)}>
            <div style={{ ...styles.modal, maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>📎 References</h2>
                <button onClick={() => setShowRefs(false)} style={styles.modalClose}>✕</button>
              </div>
              <div style={{ ...styles.modalBody, gap: 8 }}>
                {REFERENCES.map((ref, i) => (
                  <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" style={styles.refLink}>
                    <span style={styles.refNum}>[{i + 1}]</span>
                    <span style={styles.refLabel}>{ref.label} ↗</span>
                  </a>
                ))}
                <p style={{ fontSize: 12, color: "#6b8f7a", marginTop: 8 }}>
                  Built by IER Research Team · Institute of Environmental Radioactivity · Fukushima University
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes blink { 0%,80%,100%{opacity:0.3} 40%{opacity:1} }
        a { text-decoration: none; }
      `}</style>
    </>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", flexDirection: "column", maxWidth: 900, margin: "0 auto", background: "#f0f7f2" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "linear-gradient(135deg, #1a3a2a, #2d6a4f)", color: "#fff", flexWrap: "wrap", gap: 8 },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  logo: { fontSize: 32 },
  headerTitle: { fontSize: 22, fontWeight: 700 },
  headerSub: { fontSize: 11, opacity: 0.8, marginTop: 2 },
  langBar: { display: "flex", gap: 4 },
  langBtn: { padding: "6px 10px", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, background: "transparent", color: "#fff", cursor: "pointer", fontSize: 12 },
  langBtnActive: { background: "rgba(255,255,255,0.2)", borderColor: "#fff", fontWeight: 700 },
  topicScreen: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 28, overflowY: "auto" },
  heroSection: { textAlign: "center" },
  heroEmoji: { fontSize: 52, marginBottom: 10 },
  heroTitle: { fontSize: 22, fontWeight: 700, color: "#1a3a2a" },
  topicGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, width: "100%", maxWidth: 500 },
  topicCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "24px 16px", background: "#fff", border: "2px solid #d8f3dc", borderRadius: 16, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 12px rgba(26,58,42,0.08)" },
  topicEmoji: { fontSize: 34 },
  topicLabel: { fontSize: 14, fontWeight: 600, color: "#1a3a2a", textAlign: "center" },
  footer: { fontSize: 12, color: "#6b8f7a" },
  chatScreen: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topicBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "#d8f3dc", borderBottom: "1px solid #b7e4c7" },
  backBtn: { background: "none", border: "none", color: "#2d6a4f", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  topicBarLabel: { fontSize: 14, fontWeight: 600, color: "#1a3a2a" },
  consentBanner: { background: "#fffbe6", borderBottom: "1px solid #f0d080", padding: "14px 20px" },
  consentTitle: { fontWeight: 700, fontSize: 14, color: "#1a3a2a", marginBottom: 4 },
  consentText: { fontSize: 13, color: "#3a5a48", marginBottom: 10 },
  consentBtns: { display: "flex", gap: 8, flexWrap: "wrap" },
  consentAgree: { padding: "8px 16px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  consentDecline: { padding: "8px 16px", background: "none", color: "#6b8f7a", border: "1px solid #b7e4c7", borderRadius: 20, cursor: "pointer", fontSize: 13 },
  chatMessages: { flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 },
  msgRow: { display: "flex", alignItems: "flex-end", gap: 8 },
  botAvatar: { width: 32, height: 32, borderRadius: "50%", background: "#2d6a4f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 },
  bubble: { maxWidth: "75%", padding: "12px 16px", borderRadius: 18, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" },
  userBubble: { background: "#2d6a4f", color: "#fff", borderBottomRightRadius: 4 },
  botBubble: { background: "#fff", color: "#1b2e24", border: "1px solid #d8f3dc", borderBottomLeftRadius: 4, boxShadow: "0 1px 4px rgba(26,58,42,0.06)" },
  loadingBubble: { display: "flex", gap: 5, padding: "14px 20px", alignItems: "center" },
  countdownText: { fontSize: 13, color: "#2d6a4f", fontWeight: 500 },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "#74c69d", display: "inline-block", animation: "blink 1.4s infinite both" },
  inputBar: { display: "flex", gap: 8, padding: "12px 16px", background: "#fff", borderTop: "1px solid #d8f3dc" },
  input: { flex: 1, padding: "12px 16px", border: "2px solid #d8f3dc", borderRadius: 24, fontSize: 14, outline: "none", fontFamily: "inherit" },
  sendBtn: { padding: "10px 24px", background: "#2d6a4f", color: "#fff", border: "none", borderRadius: 24, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  fabGroup: { position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", zIndex: 100 },
  fab: { width: 52, height: 52, borderRadius: "50%", background: "#2d6a4f", border: "none", fontSize: 24, cursor: "pointer", boxShadow: "0 4px 16px rgba(26,58,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600 },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modal: { background: "#f0f7f2", borderRadius: 20, width: "100%", maxWidth: 600, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.2)" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "linear-gradient(135deg, #1a3a2a, #2d6a4f)", color: "#fff" },
  modalTitle: { fontSize: 18, fontWeight: 700 },
  modalClose: { background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" },
  modalBody: { overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 },
  factCard: { background: "#fff", borderRadius: 14, padding: 18, border: "1px solid #d8f3dc" },
  factTop: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  factEmoji: { fontSize: 26 },
  factTitle: { fontSize: 15, fontWeight: 700, color: "#1a3a2a" },
  factText: { fontSize: 13, lineHeight: 1.6, color: "#3a5a48", marginBottom: 10 },
  factStat: { display: "flex", alignItems: "baseline", gap: 8, padding: "8px 12px", background: "#d8f3dc", borderRadius: 8 },
  factStatNum: { fontSize: 20, fontWeight: 800, color: "#1a3a2a" },
  factStatLabel: { fontSize: 12, color: "#3a5a48" },
  refLink: { display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid #d8f3dc", color: "#1a3a2a" },
  refNum: { fontWeight: 700, color: "#2d6a4f", fontSize: 13, flexShrink: 0 },
  refLabel: { fontSize: 13, color: "#2d6a4f" },
};

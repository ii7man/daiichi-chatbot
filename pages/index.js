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
    subtitle: "Fukushima Myth-Buster Chatbot",
    chooseTopic: "Choose a topic to start:",
    typeMessage: "Type your message...",
    send: "Send",
    powered: "Built at IER, Fukushima University",
    by: "By Abdulrahman Alblooshi",
    back: "← Change Topic",
    loading: "Daiichi is thinking...",
  },
  ar: {
    title: "دايتشي",
    subtitle: "روبوت محادثة لتصحيح خرافات فوكوشيما",
    chooseTopic: "اختر موضوعاً للبدء:",
    typeMessage: "اكتب رسالتك...",
    send: "إرسال",
    powered: "تم بناؤه في IER، جامعة فوكوشيما",
    by: "بواسطة عبدالرحمن البلوشي",
    back: "→ تغيير الموضوع",
    loading: "دايتشي يفكر...",
  },
  ja: {
    title: "ダイイチ",
    subtitle: "福島の誤解を正すチャットボット",
    chooseTopic: "トピックを選んでください：",
    typeMessage: "メッセージを入力...",
    send: "送信",
    powered: "福島大学IERで開発",
    by: "Abdulrahman Alblooshi 作成",
    back: "← トピックを変更",
    loading: "ダイイチが考えています...",
  },
};

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [topic, setTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const countdownRef = useRef(null);

  const t = UI_TEXT[language];
  const dir = LANGUAGES[language].dir;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, countdown]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(countdownRef.current);
    }
  }, [countdown]);

  async function callAPI(msgs, topicKey, lang) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs, topic: topicKey, language: lang }),
    });
    const data = await res.json();

    // If rate limited and has retryAfter, do countdown and auto-retry
    if (res.status === 429 && data.retryAfter) {
      const waitSec = Math.min(data.retryAfter + 2, 30);
      setCountdown(waitSec);
      await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));
      setCountdown(0);
      // One final retry
      const res2 = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs, topic: topicKey, language: lang }),
      });
      return await res2.json();
    }

    return data;
  }

  async function startTopic(topicKey) {
    setTopic(topicKey);
    setMessages([]);
    setLoading(true);

    try {
      const data = await callAPI(
        [{ role: "user", content: "Start the conversation. Introduce yourself and present the first myth." }],
        topicKey,
        language
      );
      if (data.error) {
        setMessages([{ role: "assistant", content: `Error: ${data.error}` }]);
      } else {
        setMessages([{ role: "assistant", content: data.response }]);
      }
    } catch (err) {
      setMessages([{ role: "assistant", content: `Connection error: ${err.message}` }]);
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
      if (data.error) {
        setMessages([...newMessages, { role: "assistant", content: `Error: ${data.error}` }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: data.response }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: `Connection error: ${err.message}` }]);
    }
    setLoading(false);
  }

  function goBack() {
    setTopic(null);
    setMessages([]);
    setInput("");
  }

  return (
    <>
      <Head>
        <title>Daiichi — Fukushima Myth-Buster</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="An AI chatbot that corrects Fukushima misconceptions using Conversational Inoculation." />
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
          <div style={styles.langBar}>
            {Object.entries(LANGUAGES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setLanguage(key); setTopic(null); setMessages([]); }}
                style={{
                  ...styles.langBtn,
                  ...(language === key ? styles.langBtnActive : {}),
                }}
              >
                {val.flag} {val.label}
              </button>
            ))}
          </div>
        </header>

        {/* Main Content */}
        {!topic ? (
          /* Topic Selection */
          <main style={styles.topicScreen}>
            <div style={styles.heroSection}>
              <div style={styles.heroEmoji}>🌱</div>
              <h2 style={styles.heroTitle}>{t.chooseTopic}</h2>
              <p style={styles.heroDesc}>
                {language === "en" && "Learn the truth about Fukushima by challenging common myths."}
                {language === "ar" && "تعرّف على الحقيقة حول فوكوشيما من خلال تحدي الخرافات الشائعة."}
                {language === "ja" && "よくある誤解に挑戦して、福島の真実を学びましょう。"}
              </p>
            </div>
            <div style={styles.topicGrid}>
              {Object.entries(TOPICS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => startTopic(key)}
                  style={styles.topicCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,58,42,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,58,42,0.08)";
                  }}
                >
                  <span style={styles.topicEmoji}>{val.emoji}</span>
                  <span style={styles.topicLabel}>{val[language]}</span>
                </button>
              ))}
            </div>
            <footer style={styles.footer}>
              <p>{t.powered} &middot; {t.by}</p>
            </footer>
          </main>
        ) : (
          /* Chat Screen */
          <div style={styles.chatScreen}>
            {/* Topic bar */}
            <div style={styles.topicBar}>
              <button onClick={goBack} style={styles.backBtn}>{t.back}</button>
              <span style={styles.topicBarLabel}>
                {TOPICS[topic].emoji} {TOPICS[topic][language]}
              </span>
            </div>

            {/* Messages */}
            <div style={styles.chatMessages}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.msgRow,
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.role === "assistant" && <div style={styles.botAvatar}>🌿</div>}
                  <div
                    style={{
                      ...styles.bubble,
                      ...(msg.role === "user" ? styles.userBubble : styles.botBubble),
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
                  <div style={styles.botAvatar}>🌿</div>
                  <div style={{ ...styles.bubble, ...styles.botBubble, ...styles.loadingBubble }}>
                    {countdown > 0 ? (
                      <span style={styles.countdownText}>
                        {language === "ar" ? `⏳ ~${countdown}s جاري الانتظار...` :
                         language === "ja" ? `⏳ ~${countdown}秒 お待ちください...` :
                         `⏳ ~${countdown}s please wait...`}
                      </span>
                    ) : (
                      <><span style={styles.dot} /><span style={styles.dot} /><span style={styles.dot} /></>
                    )}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={styles.inputBar}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.typeMessage}
                style={{ ...styles.input, direction: dir }}
                disabled={loading}
              />
              <button type="submit" style={styles.sendBtn} disabled={loading || !input.trim()}>
                {t.send}
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    maxWidth: 900,
    margin: "0 auto",
    background: "#f0f7f2",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "linear-gradient(135deg, #1a3a2a, #2d6a4f)",
    color: "#fff",
    flexWrap: "wrap",
    gap: 8,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    fontSize: 32,
    lineHeight: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  headerSub: {
    fontSize: 12,
    opacity: 0.85,
    marginTop: 2,
  },
  langBar: {
    display: "flex",
    gap: 4,
  },
  langBtn: {
    padding: "6px 12px",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 20,
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    transition: "all 0.2s",
  },
  langBtnActive: {
    background: "rgba(255,255,255,0.2)",
    borderColor: "#fff",
    fontWeight: 600,
  },
  topicScreen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 32,
    overflowY: "auto",
  },
  heroSection: {
    textAlign: "center",
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1a3a2a",
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 15,
    color: "#3a5a48",
    maxWidth: 440,
    lineHeight: 1.5,
  },
  topicGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
    width: "100%",
    maxWidth: 520,
  },
  topicCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    padding: "28px 16px",
    background: "#fff",
    border: "2px solid #d8f3dc",
    borderRadius: 16,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 12px rgba(26,58,42,0.08)",
  },
  topicEmoji: {
    fontSize: 36,
  },
  topicLabel: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1a3a2a",
    textAlign: "center",
  },
  footer: {
    fontSize: 12,
    color: "#6b8f7a",
    textAlign: "center",
  },
  chatScreen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topicBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#d8f3dc",
    borderBottom: "1px solid #b7e4c7",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#2d6a4f",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  topicBarLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1a3a2a",
  },
  chatMessages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  msgRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#2d6a4f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: 18,
    fontSize: 14,
    lineHeight: 1.55,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  userBubble: {
    background: "#2d6a4f",
    color: "#fff",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    background: "#fff",
    color: "#1b2e24",
    border: "1px solid #d8f3dc",
    borderBottomLeftRadius: 4,
    boxShadow: "0 1px 4px rgba(26,58,42,0.06)",
  },
  loadingBubble: {
    display: "flex",
    gap: 5,
    padding: "14px 20px",
    alignItems: "center",
  },
  countdownText: {
    fontSize: 13,
    color: "#2d6a4f",
    fontWeight: 500,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#74c69d",
    display: "inline-block",
    animation: "blink 1.4s infinite both",
  },
  inputBar: {
    display: "flex",
    gap: 8,
    padding: "12px 16px",
    background: "#fff",
    borderTop: "1px solid #d8f3dc",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    border: "2px solid #d8f3dc",
    borderRadius: 24,
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  sendBtn: {
    padding: "10px 24px",
    background: "#2d6a4f",
    color: "#fff",
    border: "none",
    borderRadius: 24,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
    fontFamily: "inherit",
  },
};

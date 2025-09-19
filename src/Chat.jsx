"use client"

import { useState, useEffect, useRef } from "react"
import {
  FaPlus,
  FaBars,
  FaChevronLeft,
  FaTimes,
  FaPaperPlane,
  FaMicrophone,
  FaHome,
  FaHistory,
  FaCog,
  FaRobot,
  FaUser,
  FaCopy,
  FaCheck,
  FaRedo,
} from "react-icons/fa"

function Chat() {
  // Sidebar states
  const [collapsed, setCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [conversations] = useState([
    { id: 1, title: "Getting started with AMI", timestamp: "2 hours ago" },
    { id: 2, title: "Help me plan my day", timestamp: "1 day ago" },
    { id: 3, title: "Email management tips", timestamp: "2 days ago" },
    { id: 4, title: "Calendar scheduling", timestamp: "3 days ago" },
  ])

  // Chat states
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  const inputBarRef = useRef(null)
  const [copiedMessageId, setCopiedMessageId] = useState(null)

  // Quick suggestion options
  const quickSuggestions = [
    "Help me organize my schedule",
    "Email management tips",
    "Set up reminders",
    "Plan my workday",
  ]

  useEffect(() => {
    const checkScreenSize = () => {
      const newIsMobile = window.innerWidth <= 768
      setIsMobile(newIsMobile)

      if (!newIsMobile && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [mobileMenuOpen])

  const handleLogout = () => {
    window.location.href = "/login"
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Measure the bottom input bar and set padding on the chat container so messages never touch the input
  useEffect(() => {
    const setPadding = () => {
      try {
        const bar = inputBarRef.current
        const container = chatContainerRef.current
        if (!bar || !container) return
        const rect = bar.getBoundingClientRect()
  // Add extra 48px gap above the input bar for even more spacing
  const padding = rect.height + 48
  container.style.paddingBottom = padding + 'px'
      } catch (e) {
        // ignore measurement errors
      }
    }

    setPadding()
    window.addEventListener('resize', setPadding)
    const obs = new ResizeObserver(setPadding)
    if (inputBarRef.current) obs.observe(inputBarRef.current)
    return () => {
      window.removeEventListener('resize', setPadding)
      try {
        obs.disconnect()
      } catch (e) {}
    }
  }, [isMobile, inputValue])

  const handleSendMessage = (messageText = null) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend) return

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    }

    if (!hasStartedChat) {
      setIsAnimating(true)
      setHasStartedChat(true)
      setTimeout(() => {
        setMessages([userMessage])
        setIsAnimating(false)
        setTimeout(() => {
          const essayText = `**The Next Decade of Artificial Intelligence: An Outlook**

Artificial Intelligence (AI) has moved from a niche research field to a core driver of global change in just a few decades. Today it powers everything from language translation and medical diagnostics to logistics and creative design. Looking ahead ten years, AI is poised to reshape society even more profoundly. While predicting the future is never exact, clear trends in computing power, data availability, and human needs suggest where AI is heading.

1. From Narrow to Broader Intelligence: Most AI today is “narrow,” built to excel at specific tasks such as image recognition or text generation. Over the next decade, we can expect systems to become increasingly general—able to learn and reason across multiple domains. These models will be more adaptable, switching between activities like planning travel, tutoring students, and drafting code without being separately trained for each.

2. Seamless Human–AI Collaboration: Rather than replacing people wholesale, AI will act as a collaborator. Professionals will work alongside digital teammates that understand context, remember preferences, and anticipate needs. Doctors may use AI to synthesize patient histories and suggest treatments; lawyers might rely on AI for instant analysis of complex case law; artists will co-create music, film, and visual art with tools that respond to mood and style.

3. Personalized and Adaptive Experiences: Ten years from now, personalization will be far deeper than today’s targeted ads or playlists. AI systems will build rich models of individuals’ habits, health indicators, and goals—always with consent and strong privacy safeguards. Education could become a lifelong adaptive service, and healthcare will shift toward continuous, AI-guided monitoring.

4. Ethical and Societal Challenges: Greater capability brings greater responsibility. Issues of bias, transparency, and accountability will remain central. Societies will need robust governance frameworks to prevent misuse in surveillance, warfare, or disinformation. Questions of data ownership, privacy, and the economic impact of automation will demand global cooperation.

5. Infrastructure and Sustainability: AI’s hunger for computation and energy is already significant. Over the coming years, we will see a push toward more efficient algorithms, specialized hardware, and renewable energy to reduce the environmental footprint.

Conclusion: By 2035, AI will not be a separate technology we “use,” but a woven part of daily life—embedded in homes, workplaces, cities, and even the natural environment. The choices we make now—about transparency, inclusivity, and sustainability—will determine whether AI in ten years is a tool of broad benefit or a source of deeper inequality.`

          const aiResponse = {
            id: Date.now() + 1,
            text: essayText,
            html:
              '<div class="assistant-explain">' +
              '<h3>The Next Decade of Artificial Intelligence: An Outlook</h3>' +
              '<p>Artificial Intelligence (AI) has moved from a niche research field to a core driver of global change in just a few decades. Today it powers everything from language translation and medical diagnostics to logistics and creative design. Looking ahead ten years, AI is poised to reshape society even more profoundly. While predicting the future is never exact, clear trends in computing power, data availability, and human needs suggest where AI is heading.</p>' +
              '<h4>1. From Narrow to Broader Intelligence</h4>' +
              '<p>Most AI today is “narrow,” built to excel at specific tasks such as image recognition or text generation. Over the next decade, systems will become increasingly general—able to learn and reason across multiple domains, switching between activities without separate training.</p>' +
              '<h4>2. Seamless Human–AI Collaboration</h4>' +
              '<p>Rather than replacing people wholesale, AI will act as a collaborator. Professionals will work alongside digital teammates that understand context, remember preferences, and anticipate needs.</p>' +
              '<h4>3. Personalized and Adaptive Experiences</h4>' +
              '<p>Personalization will be far deeper: AI systems will model individuals’ habits and goals—ideally with consent and strong privacy safeguards—enabling lifelong adaptive education and continuous healthcare monitoring.</p>' +
              '<h4>4. Ethical and Societal Challenges</h4>' +
              '<p>Greater capability brings responsibility. Issues of bias, transparency, and accountability will demand robust governance frameworks to prevent misuse and ensure equitable outcomes.</p>' +
              '<h4>5. Infrastructure and Sustainability</h4>' +
              '<p>Expect a push toward efficient algorithms, specialized hardware, and renewable energy to reduce AI’s environmental footprint.</p>' +
              '<p><strong>Conclusion:</strong> By 2035, AI will be woven into daily life. The choices we make now—about transparency, inclusivity, and sustainability—will determine whether AI becomes a force for broad benefit or deeper inequality.</p>' +
              '</div>',
            sender: "assistant",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiResponse])
        }, 600)
      }, 400)
    } else {
      setMessages((prev) => [...prev, userMessage])
      setTimeout(() => {
        const essayText = `**The Next Decade of Artificial Intelligence: An Outlook**

Artificial Intelligence (AI) has moved from a niche research field to a core driver of global change in just a few decades. Today it powers everything from language translation and medical diagnostics to logistics and creative design. Looking ahead ten years, AI is poised to reshape society even more profoundly. While predicting the future is never exact, clear trends in computing power, data availability, and human needs suggest where AI is heading.

1. From Narrow to Broader Intelligence: Most AI today is “narrow,” built to excel at specific tasks such as image recognition or text generation. Over the next decade, we can expect systems to become increasingly general—able to learn and reason across multiple domains. These models will be more adaptable, switching between activities like planning travel, tutoring students, and drafting code without being separately trained for each.

2. Seamless Human–AI Collaboration: Rather than replacing people wholesale, AI will act as a collaborator. Professionals will work alongside digital teammates that understand context, remember preferences, and anticipate needs. Doctors may use AI to synthesize patient histories and suggest treatments; lawyers might rely on AI for instant analysis of complex case law; artists will co-create music, film, and visual art with tools that respond to mood and style.

3. Personalized and Adaptive Experiences: Ten years from now, personalization will be far deeper than today’s targeted ads or playlists. AI systems will build rich models of individuals’ habits, health indicators, and goals—always with consent and strong privacy safeguards. Education could become a lifelong adaptive service, and healthcare will shift toward continuous, AI-guided monitoring.

4. Ethical and Societal Challenges: Greater capability brings greater responsibility. Issues of bias, transparency, and accountability will remain central. Societies will need robust governance frameworks to prevent misuse in surveillance, warfare, or disinformation. Questions of data ownership, privacy, and the economic impact of automation will demand global cooperation.

5. Infrastructure and Sustainability: AI’s hunger for computation and energy is already significant. Over the coming years, we will see a push toward more efficient algorithms, specialized hardware, and renewable energy to reduce the environmental footprint.

Conclusion: By 2035, AI will not be a separate technology we “use,” but a woven part of daily life—embedded in homes, workplaces, cities, and even the natural environment. The choices we make now—about transparency, inclusivity, and sustainability—will determine whether AI in ten years is a tool of broad benefit or a source of deeper inequality.`

        const aiResponse = {
          id: Date.now() + 1,
          text: essayText,
          html:
            '<div class="assistant-explain">' +
            '<h3>The Next Decade of Artificial Intelligence: An Outlook</h3>' +
            '<p>Artificial Intelligence (AI) has moved from a niche research field to a core driver of global change in just a few decades. Today it powers everything from language translation and medical diagnostics to logistics and creative design. Looking ahead ten years, AI is poised to reshape society even more profoundly. While predicting the future is never exact, clear trends in computing power, data availability, and human needs suggest where AI is heading.</p>' +
            '<h4>1. From Narrow to Broader Intelligence</h4>' +
            '<p>Most AI today is “narrow,” built to excel at specific tasks such as image recognition or text generation. Over the next decade, systems will become increasingly general—able to learn and reason across multiple domains, switching between activities without separate training.</p>' +
            '<h4>2. Seamless Human–AI Collaboration</h4>' +
            '<p>Rather than replacing people wholesale, AI will act as a collaborator. Professionals will work alongside digital teammates that understand context, remember preferences, and anticipate needs.</p>' +
            '<h4>3. Personalized and Adaptive Experiences</h4>' +
            '<p>Personalization will be far deeper: AI systems will model individuals’ habits and goals—ideally with consent and strong privacy safeguards—enabling lifelong adaptive education and continuous healthcare monitoring.</p>' +
            '<h4>4. Ethical and Societal Challenges</h4>' +
            '<p>Greater capability brings responsibility. Issues of bias, transparency, and accountability will demand robust governance frameworks to prevent misuse and ensure equitable outcomes.</p>' +
            '<h4>5. Infrastructure and Sustainability</h4>' +
            '<p>Expect a push toward efficient algorithms, specialized hardware, and renewable energy to reduce AI’s environmental footprint.</p>' +
            '<p><strong>Conclusion:</strong> By 2035, AI will be woven into daily life. The choices we make now—about transparency, inclusivity, and sustainability—will determine whether AI becomes a force for broad benefit or deeper inequality.</p>' +
            '</div>',
          sender: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 600)
    }

    setInputValue("")
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleMicClick = () => {
    console.log("Mic clicked - implement voice recording")
  }

  // Helper: generate a labeled code block (language label, code area, copy control)
  const generateLabeledCodeBlock = ({ language = 'C', content = '' } = {}) => {
  // escape content for HTML and preserve indentation
  let safe = content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // replace leading spaces on each line with &nbsp; to preserve indentation in HTML
  safe = safe.replace(/^ +/gm, (m) => '&nbsp;'.repeat(m.length))
    return `
      <div class="labeled-code-wrapper" style="position:relative; width:100%;">
        <div class="code-block-wrap labeled" style="position:relative;">
          <div class="code-topbar">
            <div class="code-label">${language}</div>
            <button class="code-copy-btn" title="Copy" aria-label="Copy code">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1H4a2 2 0 0 0-2 2v12" stroke="#0b1220" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 7h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" stroke="#0b1220" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <pre style="white-space: pre;"><code class="language-${language.toLowerCase()}">${safe}</code></pre>
        </div>
      </div>
    `
  }

  // Helper: unescape HTML entities (simple)
  const unescapeHtml = (escaped) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = escaped
    return txt.value
  }

  // Helper: extract visible text from HTML string
  const extractTextFromHtml = (html) => {
    try {
      const div = document.createElement('div')
      div.innerHTML = html || ''
      return div.innerText || div.textContent || ''
    } catch (e) {
      return ''
    }
  }

  // Helper: convert markdown code fences and inline code to HTML
  const convertCodeMarkdownToHtml = (text) => {
    if (!text) return null

    // Convert fenced code blocks ```lang\n...``` to <pre><code class="lang">...</code></pre>
    const fenced = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (m, lang, code) => {
      const safe = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const cls = lang ? ` class="language-${lang}"` : ''
      return `<div class="code-block-wrap"><pre><code${cls}>${safe}</code></pre><button class="code-copy-btn" title="Copy code">Copy</button></div>`
    })

    // Convert inline code `x` to <code class="inline-code">x</code>
    const inline = fenced.replace(/`([^`\n]+)`/g, (m, code) => {
      const safe = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `<code class="inline-code">${safe}</code>`
    })

    return inline
  }

  // Helper: convert a markdown table (pipe-separated) to HTML table
  const markdownTableToHtml = (md) => {
    const lines = md.trim().split('\n').map((l) => l.trim())
    if (lines.length < 2) return null

    // detect separator line like |---|---|
    const sepLine = lines[1]
    if (!/^[\|]?\s*[:\-]+(\s*\|\s*[:\-]+)+\s*[\|]?$/.test(sepLine)) return null

    const headers = lines[0].split('|').map((h) => h.trim()).filter(Boolean)
    const rows = []
    for (let i = 2; i < lines.length; i++) {
      const cols = lines[i].split('|').map((c) => c.trim()).filter(() => true)
      // keep same number of columns as headers (pad or truncate)
      rows.push(cols)
    }

  // build HTML (use ami-table class so CSS styles apply)
  let html = '<table class="ami-table" style="width:100%; border-collapse: collapse; font-family: inherit;">'
    html += '<thead><tr>'
    headers.forEach((h) => {
      html += `<th style="text-align:left; padding:8px; border-bottom:2px solid #e5e7eb;">${h}</th>`
    })
    html += '</tr></thead><tbody>'
    rows.forEach((r) => {
      html += '<tr>'
      for (let i = 0; i < headers.length; i++) {
        const cell = r[i] !== undefined ? r[i] : ''
        html += `<td style="padding:8px; border-bottom:1px solid #f3f4f6;">${cell}</td>`
      }
      html += '</tr>'
    })
    html += '</tbody></table>'
    return html
  }

  // Helper: try to extract/convert table HTML from assistant text
  const extractTableHtmlFromText = (text) => {
    if (!text) return null

    // If text already contains a table tag, return it (maybe unescape HTML entities first)
    if (text.includes('<table')) {
      // If it appears escaped like &lt;table&gt;, unescape
      if (text.includes('&lt;table') || text.includes('&lt;tbody')) {
        return unescapeHtml(text)
      }
      return text
    }

    // If text is inside a code fence with html, extract the inner content
    const codeFenceMatch = text.match(/```\s*(?:html)?\n([\s\S]*?)\n```/i)
    if (codeFenceMatch && codeFenceMatch[1]) {
      const inner = codeFenceMatch[1]
      if (inner.includes('<table')) return inner
      // maybe the inner is markdown table
      const htmlFromMd = markdownTableToHtml(inner)
      if (htmlFromMd) return htmlFromMd
    }

    // If text looks like a markdown table (contains pipes and a separator line), convert
    const mdTableMatch = text.split('\n').slice(0, 6).join('\n')
    if (mdTableMatch.includes('|') && /[-:]+\s*\|/.test(mdTableMatch)) {
      const htmlFromMd = markdownTableToHtml(text)
      if (htmlFromMd) return htmlFromMd
    }

    return null
  }

  // Sidebar component with improved translucency
  const renderSidebar = () => {
    const sidebarItems = [
      { icon: FaHome, label: "Home", id: "home" },
      { icon: FaHistory, label: "History", id: "history" },
      { icon: FaCog, label: "Settings", id: "settings" },
    ]

    if (isMobile) {
      return (
        <>
          {!mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                position: "fixed",
                top: "1rem",
                left: "1rem",
                zIndex: 1001,
                background: "rgba(79, 70, 229, 0.9)",
                backdropFilter: "blur(10px)",
                border: "none",
                color: "#fff",
                fontSize: "1.2rem",
                padding: "0.75rem",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "0 8px 30px rgba(79, 70, 229, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
              }}
            >
              <FaBars />
            </button>
          )}

          {mobileMenuOpen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 999,
                backdropFilter: "blur(8px)",
              }}
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          <div
            style={{
              height: "100vh",
              width: "300px",
              background: "rgba(102, 126, 234, 0.95)",
              backdropFilter: "blur(20px)",
              color: "#ffffff",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 1000,
              boxShadow: "4px 0 30px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              transform: `translateX(${mobileMenuOpen ? "0" : "-100%"})`,
              transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                padding: "2rem 1.5rem 1.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "0.5rem",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaRobot size={20} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>AMI Assistant</h2>
                  <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.8 }}>Your AI-powered helper</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "8px",
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={{ padding: "1.5rem 1rem" }}>
              <button
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.25)"
                  e.target.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.15)"
                  e.target.style.transform = "translateY(0)"
                }}
              >
                <FaPlus size={14} />
                New Chat
              </button>
            </div>

            <div style={{ flex: 1, padding: "0 1rem", overflowY: "auto" }}>
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Recent Conversations
              </h3>

              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  style={{
                    padding: "0.875rem 1rem",
                    margin: "0 0 0.5rem 0",
                    cursor: "pointer",
                    borderRadius: "10px",
                    transition: "all 0.2s ease",
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)"
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.borderColor = "transparent"
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      color: "#ffffff",
                      marginBottom: "0.25rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conversation.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>{conversation.timestamp}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "1rem" }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  background: "rgba(220, 38, 38, 0.2)",
                  color: "#fca5a5",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(220, 38, 38, 0.3)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(220, 38, 38, 0.2)"
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )
    }

    return (
      <div
        style={{
          height: "100vh",
          width: collapsed ? "80px" : "280px",
          background: "rgba(102, 126, 234, 0.95)",
          backdropFilter: "blur(20px)",
          color: "#ffffff",
          transition: "width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          boxShadow: "4px 0 30px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1rem",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "0.5rem",
            borderRadius: "8px",
            cursor: "pointer",
            color: "#fff",
            fontSize: "1rem",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.25)"
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.15)"
          }}
        >
          {collapsed ? <FaBars /> : <FaChevronLeft />}
        </button>

        {!collapsed && (
          <div
            style={{
              padding: "4.5rem 1.5rem 2rem",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "0.5rem",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaRobot size={20} />
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    letterSpacing: "-0.025em",
                  }}
                >
                  AMI Assistant
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    opacity: 0.8,
                    fontWeight: "400",
                  }}
                >
                  Your AI-powered helper
                </p>
              </div>
            </div>
          </div>
        )}

        {collapsed && <div style={{ height: "5rem" }} />}

        {!collapsed && (
          <div style={{ padding: "0 1rem 1.5rem" }}>
            <button
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.25)"
                e.target.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.15)"
                e.target.style.transform = "translateY(0)"
              }}
            >
              <FaPlus size={14} />
              New Chat
            </button>
          </div>
        )}

        <div style={{ flex: 1, padding: collapsed ? "0 0.75rem" : "0 1rem", overflowY: "auto" }}>
          {!collapsed && (
            <>
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Recent Conversations
              </h3>

              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  style={{
                    padding: "0.875rem 1rem",
                    margin: "0 0 0.5rem 0",
                    cursor: "pointer",
                    borderRadius: "10px",
                    transition: "all 0.2s ease",
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)"
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.borderColor = "transparent"
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      color: "#ffffff",
                      marginBottom: "0.25rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conversation.title}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>{conversation.timestamp}</div>
                </div>
              ))}
            </>
          )}

          {/* Navigation items for collapsed sidebar */}
          {collapsed && (
            <div style={{ marginTop: "2rem" }}>
              {sidebarItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "1rem 0.75rem",
                    margin: "0 0 0.5rem 0",
                    cursor: "pointer",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                  }}
                  title={item.label}
                >
                  <item.icon size={18} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: collapsed ? "1rem 0.75rem" : "1rem" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: "rgba(220, 38, 38, 0.2)",
              color: "#fca5a5",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s ease",
            }}
            title={collapsed ? "Logout" : ""}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(220, 38, 38, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(220, 38, 38, 0.2)"
            }}
          >
            {collapsed ? <FaTimes size={16} /> : "Logout"}
          </button>
        </div>

        {!collapsed && (
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(0,0,0,0.1)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.6)",
                textAlign: "center",
              }}
            >
              AMI beta v1.0
            </p>
          </div>
        )}
      </div>
    )
  }

  // Attach copy handlers for table copy buttons inside assistant HTML
  useEffect(() => {
    // delegate clicks to container
    const container = chatContainerRef.current
    if (!container) return

    function onClick(e) {
  // Table-level copy button (copies whole table: headers + rows)
  const tableBtn = e.target.closest && e.target.closest('.table-copy-btn')
      if (tableBtn) {
  // The copy button lives in the wrapper header (outside the table).
  // Find the nearest wrapper and then the table inside it.
  const wrapper = tableBtn.closest && tableBtn.closest('.ami-table-wrapper')
  const table = (wrapper && wrapper.querySelector && wrapper.querySelector('table.ami-table')) || tableBtn.closest('table')
  if (!table) return

        // Collect header texts (if any)
        const headerCells = Array.from(table.querySelectorAll('thead th'))
          .map((h) => h.innerText.trim())
          .filter(Boolean)

        // Collect body rows (or all rows excluding the header)
        const rowEls = Array.from(table.querySelectorAll('tbody tr'))
        // Fallback: if no tbody, include all tr except those in thead
        const rows = rowEls.length
          ? rowEls
          : Array.from(table.querySelectorAll('tr')).filter((r) => !r.closest('thead'))

        const rowTexts = rows.map((row) => {
          const cells = Array.from(row.querySelectorAll('td,th'))
          const textCells = cells.filter((c) => !c.classList.contains('copy-cell'))
          return textCells.map((c) => c.innerText.trim()).join(' | ')
        }).filter(Boolean)

        let fullText = ''
        if (headerCells.length) fullText += headerCells.join(' | ') + '\n'
        fullText += rowTexts.join('\n')

        navigator.clipboard?.writeText(fullText).then(() => {
          const prev = tableBtn.innerHTML
          // show a simple check mark feedback (preserve innerHTML to restore)
          tableBtn.innerHTML = '✓'
          setTimeout(() => (tableBtn.innerHTML = prev), 1200)
        })

        return
      }

      // Code block copy button
      const codeBtn = e.target.closest && e.target.closest('.code-copy-btn')
      if (codeBtn) {
        // try to find code block wrap nearby; header buttons may live in .labeled-code-wrapper
        let pre = codeBtn.closest && codeBtn.closest('.code-block-wrap')
        if (!pre) {
          const wrapper = codeBtn.closest && codeBtn.closest('.labeled-code-wrapper')
          pre = wrapper && wrapper.querySelector && wrapper.querySelector('.code-block-wrap')
        }
        const codeEl = pre && pre.querySelector && pre.querySelector('pre code')
        if (!codeEl) return

        const text = codeEl.innerText
        navigator.clipboard?.writeText(text).then(() => {
          const prev = codeBtn.innerText
          codeBtn.innerText = '✓'
          setTimeout(() => (codeBtn.innerText = prev), 1200)
        })
        return
      }

      // Per-row copy button (legacy, still supported)
      const btn = e.target.closest && e.target.closest('.copy-btn')
      if (!btn) return

      const row = btn.closest('tr')
      if (!row) return

      // extract text from the row's cells (excluding the copy cell)
      const cells = Array.from(row.querySelectorAll('td'))
      const textCells = cells.filter((c) => !c.classList.contains('copy-cell'))
      const rowText = textCells.map((c) => c.innerText.trim()).join(' | ')

      navigator.clipboard?.writeText(rowText).then(() => {
        const prev = btn.innerText
        btn.innerText = '✓'
        setTimeout(() => (btn.innerText = prev), 1200)
      })
    }

    container.addEventListener('click', onClick)
    return () => container.removeEventListener('click', onClick)
  }, [messages])

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {renderSidebar()}

      <div
        style={{
          marginLeft: isMobile ? "0" : collapsed ? "80px" : "280px",
          flex: 1,
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header Bar - Only show in chat mode */}
        {hasStartedChat && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              padding: isMobile ? "1rem 1rem 1rem 4rem" : "1.25rem 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 20px rgba(0, 0, 0, 0.05)",
              position: "sticky",
              top: 0,
              zIndex: 50,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "0.5rem",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaRobot size={18} color="white" />
              </div>
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: isMobile ? "1.3rem" : "1.5rem",
                    fontWeight: "700",
                    color: "#1a202c",
                    letterSpacing: "-0.025em",
                  }}
                >
                  AMI Chat Assistant
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    fontWeight: "400",
                  }}
                >
                  Intelligent AI assistant ready to help
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#ffffff",
                  }}
                />
                Online
              </div>
            </div>
          </div>
        )}

        {/* Landing State - Centered Input */}
        {!hasStartedChat && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "2rem 1rem" : "3rem 2rem",
            }}
          >
            <div
              style={{
                maxWidth: "600px",
                width: "100%",
                textAlign: "center",
              }}
            >
              {/* Welcome Message */}
              <div
                style={{
                  marginBottom: "3rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 2rem",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <FaRobot size={35} color="white" />
                </div>

                <h1
                  style={{
                    margin: "0 0 1rem 0",
                    fontSize: isMobile ? "2rem" : "2.5rem",
                    fontWeight: "700",
                    color: "#1a202c",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Welcome to AMI
                </h1>

                <p
                  style={{
                    margin: "0 0 2rem 0",
                    fontSize: "1.1rem",
                    color: "#6b7280",
                    lineHeight: "1.6",
                    fontWeight: "400",
                  }}
                >
                  Your intelligent assistant ready to help with anything you need
                </p>
              </div>

              {/* Centered Input Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  background: "#ffffff",
                  borderRadius: "50px",
                  padding: "1rem 1.5rem",
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                  border: "2px solid rgba(79, 70, 229, 0.1)",
                  maxWidth: "500px",
                  margin: "0 auto",
                  transform: isAnimating ? "scale(0.98)" : "scale(1)",
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              >
                {/* Mic Button */}
                <button
                  onClick={handleMicClick}
                  style={{
                    background: "rgba(107, 114, 128, 0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    color: "#6b7280",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(79, 70, 229, 0.1)"
                    e.target.style.color = "#4f46e5"
                    e.target.style.transform = "scale(1.05)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(107, 114, 128, 0.1)"
                    e.target.style.color = "#6b7280"
                    e.target.style.transform = "scale(1)"
                  }}
                >
                  <FaMicrophone size={16} />
                </button>

                {/* Input Field */}
                {/* Input Field (wrapped so text never touches the send button) */}
                <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: "1rem",
                      color: "#374151",
                      backgroundColor: "transparent",
                      fontFamily: "inherit",
                      fontWeight: "400",
                      // ensure input text never reaches the send button
                      paddingRight: "56px",
                    }}
                  />

                  {/* Absolutely positioned send button so input text can't collide with it */}
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: inputValue.trim()
                        ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                        : "rgba(156, 163, 175, 0.3)",
                      border: "none",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: inputValue.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      color: inputValue.trim() ? "#ffffff" : "#9ca3af",
                      boxShadow: inputValue.trim() ? "0 4px 20px rgba(79, 70, 229, 0.4)" : "none",
                      flexShrink: 0,
                      zIndex: 2,
                    }}
                    onMouseEnter={(e) => {
                      if (inputValue.trim()) {
                        e.target.style.transform = "translateY(-50%) scale(1.05)"
                        e.target.style.boxShadow = "0 8px 25px rgba(79, 70, 229, 0.5)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(-50%) scale(1)"
                      if (inputValue.trim()) {
                        e.target.style.boxShadow = "0 4px 20px rgba(79, 70, 229, 0.4)"
                      }
                    }}
                  >
                    <FaPaperPlane size={14} />
                  </button>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                  gap: "0.75rem",
                  marginTop: "2rem",
                  maxWidth: "500px",
                  margin: "2rem auto 0",
                }}
              >
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      padding: "0.875rem 1.25rem",
                      background: "rgba(79, 70, 229, 0.05)",
                      border: "1px solid rgba(79, 70, 229, 0.1)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      color: "#4f46e5",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(79, 70, 229, 0.1)"
                      e.target.style.borderColor = "rgba(79, 70, 229, 0.2)"
                      e.target.style.transform = "translateY(-1px)"
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(79, 70, 229, 0.05)"
                      e.target.style.borderColor = "rgba(79, 70, 229, 0.1)"
                      e.target.style.transform = "translateY(0)"
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages Area */}
        {hasStartedChat && (
          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              padding: isMobile ? "1rem 0.75rem" : "2rem 2rem",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "1rem" : "1.5rem",
              paddingBottom: "140px",
              scrollBehavior: "smooth",
              background: "transparent",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                  opacity: 0,
                  transform: "translateY(20px)",
                  animation: `fadeInMessage 0.6s ease-out ${index * 0.1}s forwards`,
                }}
              >
                {/* Assistant Avatar */}
                {message.sender === "assistant" && (
                  <div
                    style={{
                      minWidth: isMobile ? "30px" : "36px",
                      height: isMobile ? "30px" : "36px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                      marginTop: "0.25rem",
                    }}
                  >
                    <FaRobot size={isMobile ? 14 : 16} color="white" />
                  </div>
                )}

                  <div
                    style={{
                      maxWidth: isMobile ? "92%" : "70%",
                      position: "relative",
                    }}
                  >
                  <div
                    style={{
                      padding: isMobile ? "0.9rem 1rem" : "1.25rem 1.5rem",
                      borderRadius: message.sender === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                      backgroundColor:
                        message.sender === "user"
                          ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                          : "rgba(255, 255, 255, 0.95)",
                      color: message.sender === "user" ? "#ffffff" : "#374151",
                      boxShadow:
                        message.sender === "user"
                          ? "0 8px 25px rgba(79, 70, 229, 0.25)"
                          : "0 4px 20px rgba(0, 0, 0, 0.08)",
                      fontSize: isMobile ? "0.95rem" : "0.95rem",
                      lineHeight: "1.5",
                      wordWrap: "break-word",
                      border: message.sender === "assistant" ? "1px solid rgba(0, 0, 0, 0.05)" : "none",
                      backdropFilter: message.sender === "assistant" ? "blur(20px)" : "none",
                      background:
                        message.sender === "user"
                          ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                          : "rgba(255, 255, 255, 0.95)",
                      position: "relative",
                    }}
                  >
                    {(() => {
                      // prefer explicit message.html
                      if (message.html) return <div className="message-content" dangerouslySetInnerHTML={{ __html: message.html }} />

                      // try to extract/convert table HTML from message.text
                      const extracted = extractTableHtmlFromText(message.text)
                      if (extracted) return <div className="message-content" dangerouslySetInnerHTML={{ __html: extracted }} />

                      // convert code fences / inline code to HTML (renderable)
                      const codeHtml = convertCodeMarkdownToHtml(message.text)
                      // only return HTML if conversion changed the input
                      if (codeHtml && codeHtml !== message.text) return <div className="message-content" dangerouslySetInnerHTML={{ __html: codeHtml }} />

                      return <div className="message-content">{message.text}</div>
                    })()}

                    <div
                      style={{
                        fontSize: "0.75rem",
                        opacity: message.sender === "user" ? 0.8 : 0.6,
                        marginTop: "0.75rem",
                        textAlign: message.sender === "user" ? "right" : "left",
                        fontWeight: "400",
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Message Actions (Copy & Refresh for AI messages) */}
                  {message.sender === "assistant" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "flex-end",
                        marginTop: "0.5rem",
                        paddingRight: "0.25rem",
                      }}
                    >
                      <button
                        onClick={() => {
                          const toCopy = (message.text && message.text.trim()) || extractTextFromHtml(message.html) || ''
                          if (!toCopy) return
                          navigator.clipboard.writeText(toCopy).then(() => {
                            setCopiedMessageId(message.id)
                            setTimeout(() => setCopiedMessageId(null), 1800)
                          })
                        }}
                        style={{
                          background: "rgba(107, 114, 128, 0.1)",
                          border: "none",
                          borderRadius: "6px",
                          width: isMobile ? "26px" : "28px",
                          height: isMobile ? "26px" : "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          color: "#6b7280",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "rgba(107, 114, 128, 0.2)"
                          e.target.style.color = "#374151"
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "rgba(107, 114, 128, 0.1)"
                          e.target.style.color = "#6b7280"
                        }}
                        title={copiedMessageId === message.id ? 'Copied' : 'Copy message'}
                      >
                        {copiedMessageId === message.id ? (
                          <FaCheck size={isMobile ? 12 : 14} color="#10b981" />
                        ) : (
                          <FaCopy size={isMobile ? 11 : 12} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          // Regenerate response logic would go here
                          console.log("Regenerating response...")
                        }}
                        style={{
                          background: "rgba(107, 114, 128, 0.1)",
                          border: "none",
                          borderRadius: "6px",
                          width: isMobile ? "26px" : "28px",
                          height: isMobile ? "26px" : "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          color: "#6b7280",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "rgba(107, 114, 128, 0.2)"
                          e.target.style.color = "#374151"
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "rgba(107, 114, 128, 0.1)"
                          e.target.style.color = "#6b7280"
                        }}
                        title="Regenerate response"
                      >
                        <FaRedo size={isMobile ? 11 : 12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {message.sender === "user" && (
                  <div
                    style={{
                      minWidth: isMobile ? "30px" : "36px",
                      height: isMobile ? "30px" : "36px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                      marginTop: "0.25rem",
                    }}
                  >
                    <FaUser size={isMobile ? 12 : 14} color="white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Input Bar - Only in Chat Mode */}
        {hasStartedChat && (
          <div
            ref={inputBarRef}
            style={{
              position: "fixed",
              bottom: "0",
              left: isMobile ? "0" : collapsed ? "80px" : "280px",
              right: "0",
              padding: isMobile ? "1rem" : "1.5rem 2rem 2rem",
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              zIndex: 100,
              boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.08)",
              transition: "left 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                boxSizing: "border-box",
                paddingLeft: isMobile ? "0.75rem" : "0.75rem",
                paddingRight: isMobile ? "0.75rem" : "0.75rem",
              }}
            >
              {/* Mic Button */}
              <button
                onClick={handleMicClick}
                style={{
                  background: "rgba(107, 114, 128, 0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  color: "#6b7280",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(79, 70, 229, 0.1)"
                  e.target.style.color = "#4f46e5"
                  e.target.style.transform = "scale(1.05)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(107, 114, 128, 0.1)"
                  e.target.style.color = "#6b7280"
                  e.target.style.transform = "scale(1)"
                }}
              >
                <FaMicrophone size={16} />
              </button>

              {/* Input Field Container (textarea padded to avoid send button) */}
              <div
                style={{
                  flex: 1,
                  maxWidth: "1000px",
                  position: "relative",
                  background: "#ffffff",
                  borderRadius: "24px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "2px solid rgba(79, 70, 229, 0.1)",
                  overflow: "hidden",
                }}
              >
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  style={{
                    width: "100%",
                    minHeight: "24px",
                    maxHeight: "120px",
                    padding: "1rem 72px 1rem 1.5rem", // right padding leaves space for the button
                    border: "none",
                    outline: "none",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                    resize: "none",
                    backgroundColor: "transparent",
                    fontFamily: "inherit",
                    color: "#374151",
                    fontWeight: "400",
                  }}
                  rows={1}
                  onInput={(e) => {
                    if (!e.target.value) {
                      e.target.style.height = "24px";
                    } else {
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                    }
                  }}
                  onFocus={(e) => {
                    e.target.parentElement.style.borderColor = "rgba(79, 70, 229, 0.3)"
                    e.target.parentElement.style.boxShadow = "0 4px 20px rgba(79, 70, 229, 0.15)"
                  }}
                  onBlur={(e) => {
                    e.target.parentElement.style.borderColor = "rgba(79, 70, 229, 0.1)"
                    e.target.parentElement.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)"
                  }}
                />

                {/* Send Button (absolute inside the container) */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: inputValue.trim()
                      ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                      : "rgba(156, 163, 175, 0.3)",
                    border: "none",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: inputValue.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    color: inputValue.trim() ? "#ffffff" : "#9ca3af",
                    boxShadow: inputValue.trim() ? "0 4px 15px rgba(79, 70, 229, 0.4)" : "none",
                    zIndex: 2,
                  }}
                  onMouseEnter={(e) => {
                    if (inputValue.trim()) {
                      e.target.style.transform = "translateY(-50%) scale(1.05)"
                      e.target.style.boxShadow = "0 6px 20px rgba(79, 70, 229, 0.5)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(-50%) scale(1)"
                    if (inputValue.trim()) {
                      e.target.style.boxShadow = "0 4px 15px rgba(79, 70, 229, 0.4)"
                    }
                  }}
                >
                  <FaPaperPlane size={12} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CSS Animations and Styles */}
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
          
          @keyframes fadeInMessage {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Custom scrollbar styling */
          div::-webkit-scrollbar {
            width: 6px;
          }
          
          div::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 3px;
          }
          
          div::-webkit-scrollbar-thumb {
            background: rgba(79, 70, 229, 0.3);
            border-radius: 3px;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: rgba(79, 70, 229, 0.5);
          }
          
          /* Textarea focus styles */
          textarea:focus {
            outline: none;
          }
          
          /* Input focus styles */
          input:focus {
            outline: none;
          }
          
          /* Placeholder styling */
          textarea::placeholder,
          input::placeholder {
            color: #9ca3af;
            font-weight: 400;
          }
          
          /* Mobile optimizations */
          @media (max-width: 768px) {
            textarea, input {
              font-size: 16px !important;
            }
            /* Make assistant tables and code blocks full width on small screens */
            .ami-table, .labeled-code-wrapper, .code-block-wrap {
              width: 100% !important;
              overflow-x: auto;
            }
            .ami-table thead th, .ami-table tbody td {
              padding: 10px !important;
            }
            /* Reduce spacing so content fits better on narrow screens */
            .ami-table { font-size: 0.9rem; }
            .code-topbar .code-label { font-size: 0.8rem; }
          }
          
          /* Smooth transitions for all interactive elements */
          * {
            transition: all 0.2s ease;
          }

          /* Message content responsiveness: prevent large code blocks or tables from pushing layout */
          .message-content {
            max-width: 100%;
            word-break: break-word;
          }

          .message-content pre,
          .message-content code {
            display: block;
            max-width: 100%;
            overflow: auto;
            white-space: pre-wrap; /* allow wrapping for very long lines */
            word-break: break-word;
            background: #0f172a;
            color: #f8fafc;
            padding: 12px;
            border-radius: 8px;
          }

          .message-content table {
            width: 100% !important;
            max-width: 100%;
            overflow: auto;
            display: block;
          }

          .message-content img {
            max-width: 100%;
            height: auto;
            display: block;
          }
          
          /* Focus ring for accessibility */
          button:focus-visible {
            outline: 2px solid rgba(79, 70, 229, 0.5);
            outline-offset: 2px;
          }
          
          textarea:focus-visible,
          input:focus-visible {
            outline: none;
          }
          /* Table improvements for assistant HTML tables */
          .ami-table {
            font-size: 0.95rem;
            color: #0f172a;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);
          }

          .ami-table thead th {
            background: linear-gradient(90deg, #f8fafc 0%, #eef2ff 100%);
            font-weight: 700;
            color: #0b1220;
            padding: 12px 14px;
          }

          .ami-table tbody tr:nth-child(odd) {
            background: #ffffff;
          }

          .ami-table tbody tr:nth-child(even) {
            background: #fbfbff;
          }

          .ami-table td {
            /* leave extra right padding so floating copy controls don't overlap text */
            padding: 12px 56px 12px 14px; /* top/right/bottom/left */
            vertical-align: top;
            word-break: break-word;
            overflow-wrap: anywhere; /* break long words/URLs */
            position: relative; /* ensure absolute-positioned controls inside cells anchor correctly */
          }

          .ami-table td .icon {
            margin-right: 8px;
            display: inline-block;
            width: 20px;
            text-align: center;
            opacity: 0.95;
          }

          .ami-table strong {
            font-weight: 700;
            color: #111827;
          }

          /* Responsive: stack rows on narrow screens */
          @media (max-width: 640px) {
            .ami-table,
            .ami-table thead,
            .ami-table tbody,
            .ami-table th,
            .ami-table td,
            .ami-table tr {
              display: block;
              width: 100%;
            }

            .ami-table thead {
              display: none;
            }

            .ami-table tbody tr {
              margin-bottom: 12px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
            }

            .ami-table td {
              display: flex;
              justify-content: space-between;
              padding: 10px 12px;
            }

            /* In stacked mobile view, make the copy button static so it doesn't overlap the content */
            .ami-table td .table-copy-btn {
              position: static !important;
              width: auto !important;
              height: auto !important;
              margin-left: 8px;
              margin-top: 6px;
              border-radius: 6px;
            }

            .ami-table td::before {
              content: attr(data-label) " :";
              font-weight: 600;
              margin-right: 12px;
              color: #0b1220;
              flex: 0 0 40%;
            }
          }
          /* Hover effect */
          .ami-table tbody tr:hover {
            background: #f1f5ff;
          }

          /* Copy button styles */
          .copy-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 14px;
            line-height: 1;
            padding: 6px;
            border-radius: 6px;
            transition: background 0.15s ease, transform 0.12s ease;
          }

          .copy-btn:hover {
            background: rgba(79, 70, 229, 0.06);
            transform: translateY(-1px);
          }

          .copy-btn:active {
            transform: translateY(0);
          }

          /* Consistent small icon sizing */
          .ami-table .icon, .copy-btn {
            font-size: 16px;
            vertical-align: middle;
          }

          /* Table-level copy button */
          .table-copy-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
          }

          .table-copy-btn svg {
            opacity: 0.9;
          }

          /* Wrapper and header for table to host the copy button without taking a table column */
          .ami-table-wrapper {
            position: relative;
            width: 100%;
            margin: 0.5rem 0 1rem 0;
            padding-bottom: 46px; /* give space for the floating control at the bottom */
          }

          .ami-table-header {
            position: relative;
          }

          /* place the copy button visually above the table at top-right */
          .ami-table-wrapper .table-copy-btn {
            position: absolute;
            right: 12px;
            bottom: 12px; /* anchored to the bottom-right corner */
            background: rgba(15,23,42,0.04);
            padding: 8px;
            z-index: 30;
            pointer-events: auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(2,6,23,0.06);
            border-radius: 8px;
          }

          /* When copy button is placed inside a table cell, make it look like a compact circular control */
          .ami-table td .table-copy-btn {
            position: absolute;
            right: 8px;
            bottom: 8px;
            background: rgba(15,23,42,0.04);
            width: 34px;
            height: 34px;
            padding: 6px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(2,6,23,0.06);
            transition: transform 0.12s ease, background 0.12s ease;
          }

          .ami-table td .table-copy-btn:hover {
            transform: translateY(-2px);
            background: rgba(79,70,229,0.08);
          }

          .ami-table td .table-copy-btn:focus-visible {
            outline: 2px solid rgba(79,70,229,0.2);
            outline-offset: 2px;
          }

          /* Code block and inline code styling */
          .code-block-wrap {
            position: relative;
            margin: 0.75rem 0;
          }

          .labeled-code-wrapper {
            position: relative;
            width: 100%;
            margin: 0.75rem 0;
          }

          /* Make the labeled code block a single rectangular unit */
          .code-block-wrap.labeled {
            background: #0b1220;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(2,6,23,0.12);
          }

          .code-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 8px 12px;
            /* much lighter top bar than the code area */
            background: rgba(255,255,255,0.12);
            color: #f1f5f9;
          }

          .code-topbar .code-label {
            font-weight: 700;
            font-size: 0.85rem;
            /* lighter label background and text for emphasis */
            color: #07202a;
            background: rgba(255,255,255,0.22);
            padding: 4px 8px;
            border-radius: 6px;
          }

          .code-block-wrap pre {
            margin: 0;
            background: #0f172a;
            color: #e6edf3;
            padding: 12px 16px;
            border-radius: 8px;
            overflow: auto;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.5;
          }

          /* Slightly different spacing for labeled blocks */
          .code-block-wrap.labeled pre {
            margin: 0;
            padding: 12px 16px;
            background: transparent; /* wrapper provides background */
            color: #e6edf3;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.5;
            overflow: auto;
            white-space: pre; /* preserve original formatting and indentation */
          }

          .code-topbar .code-copy-btn {
            background: rgba(255,255,255,0.06);
            border: none;
            color: #07202a; /* match the label text color */
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .code-topbar .code-copy-btn:hover {
            background: rgba(255,255,255,0.14);
            transform: translateY(-1px);
          }

          .inline-code {
            background: rgba(15, 23, 42, 0.06);
            padding: 2px 6px;
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
            font-size: 0.9em;
            color: #0f172a;
          }

          .code-copy-btn {
            position: absolute;
            right: 8px;
            top: 8px;
            background: rgba(255,255,255,0.06);
            color: #fff;
            border: none;
            padding: 6px 8px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 0 4px 10px rgba(2,6,23,0.08);
          }

          .code-copy-btn:hover {
            background: rgba(255,255,255,0.12);
            transform: translateY(-1px);
          }

          /* small tooltip near inline copy button */
          .ami-table td .table-copy-btn { position: relative; }
          .ami-table td .table-copy-btn::after {
            content: "Copy table";
            position: absolute;
            right: 42px;
            bottom: 6px;
            background: rgba(2,6,23,0.9);
            color: white;
            padding: 6px 8px;
            border-radius: 6px;
            font-size: 12px;
            opacity: 0;
            transform: translateY(6px);
            transition: opacity 0.12s ease, transform 0.12s ease;
            pointer-events: none;
            white-space: nowrap;
          }

          .ami-table td .table-copy-btn:hover::after,
          .ami-table td .table-copy-btn:focus-visible::after {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
      </div>
    </div>
  )
}

export default Chat

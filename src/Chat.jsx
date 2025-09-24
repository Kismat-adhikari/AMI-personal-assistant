"use client"

import { useState, useEffect, useRef } from "react"
import {
  FaPlus,
  FaBars,
  FaChevronLeft,
  FaTimes,
  FaArrowRight,
  FaPaperPlane,
  FaMicrophone,
  FaImage,
  FaFileUpload,
  FaBook,
  FaHome,
  FaHistory,
  FaCog,
  FaUser,
  FaCopy,
  FaCheck,
  FaRedo,
  FaRobot,
} from "react-icons/fa"
import { HiOutlinePhotograph, HiOutlineCloudUpload, HiOutlineBookOpen } from 'react-icons/hi'

function Chat() {
  // Sidebar states
  const [collapsed, setCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // start with no saved conversations; show a helpful placeholder when empty
  const [conversations] = useState([])

  // Chat states
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const chatContainerRef = useRef(null)
  const lastMessageRef = useRef(null)
  const inputRef = useRef(null)
  const selectionDuringMouseDownRef = useRef('')
  const inputBarRef = useRef(null)
  const [copiedMessageId, setCopiedMessageId] = useState(null)
  const [plusMenuOpen, setPlusMenuOpen] = useState(false)
  const [plusMenuAnchor, setPlusMenuAnchor] = useState(null) // 'landing' or 'bottom'

  // Ask ChatGPT floating hint states (keep only floating affordance)
  const [showAskFloating, setShowAskFloating] = useState(false)
  const [askFloatingPos, setAskFloatingPos] = useState({ x: 0, y: 0 })
  // Make the floating Ask button non-interactive while selection is being dragged
  const [askClickable, setAskClickable] = useState(false)
  // Preview state for Ask ChatGPT selection behavior
  // (preview removed) - keep only floating Ask affordance

  // Handler: when user clicks the floating Ask button, capture selection into input
  const handleAskSelection = () => {
    try {
      const sel = window.getSelection()
      const selected = sel ? sel.toString().trim() : ''
      if (!selected) return
      // Only act if the selection is inside an assistant message
      function nodeHasAssistantAncestor(node) {
        while (node) {
          if (node.getAttribute && node.getAttribute('data-ami-assistant') === 'true') return true
          node = node.parentNode
        }
        return false
      }

      const anchor = sel.anchorNode
      const focus = sel.focusNode
      if (!(nodeHasAssistantAncestor(anchor) || nodeHasAssistantAncestor(focus))) return

  // set the quoted message to the selected text but do NOT populate the input
  const selectedText = selected
  setQuotedMessage({ id: Date.now(), text: selectedText })
      setShowAskFloating(false)
      // focus textarea so user can edit/send
      setTimeout(() => inputRef.current && inputRef.current.focus(), 40)
    } catch (e) {
      console.warn('handleAskSelection failed', e)
    }
  }

  // preview UI removed; Ask AMI floating button remains and no longer inserts text above input

  // Quick suggestion options
  const quickSuggestions = [
    "Help me organize my schedule",
    "Email management tips",
    "Set up reminders",
    "Plan my workday",
  ]
  
  const handleSendMessage = (messageText = null) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend) return

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      // attach quoted message if present
      quoted: quotedMessage || null,
      timestamp: new Date(),
    }

    // Start chat on first message
    if (!hasStartedChat) setHasStartedChat(true)

    setMessages((prev) => [...prev, userMessage])

    // Simulate assistant response after a short delay
    setTimeout(() => {
      const aiText = `Thanks — I received: ${textToSend.slice(0, 200)}`
      const aiResponse = {
        id: Date.now() + 1,
        text: aiText,
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 600)

    setInputValue('')
    // clear quoted message after sending
    setQuotedMessage(null)
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

  const handlePlusClick = () => {
    console.log('Plus (+) clicked - implement add/attachment action')
  }

  const togglePlusMenu = (anchor) => {
    setPlusMenuAnchor(anchor)
    setPlusMenuOpen((v) => (v && plusMenuAnchor === anchor ? false : true))
  }

  useEffect(() => {
    function onDocClick(e) {
      // close when clicking outside the menu or the plus buttons
      if (!plusMenuOpen) return
      const menu = document.querySelector('.plus-menu')
      const plusBtns = document.querySelectorAll('[aria-label="Add"]')
      if (menu && !menu.contains(e.target)) {
        // allow clicks on the plus buttons to toggle
        let clickedPlus = false
        plusBtns.forEach((b) => { if (b.contains(e.target)) clickedPlus = true })
        if (!clickedPlus) setPlusMenuOpen(false)
      }
    }

    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [plusMenuOpen, plusMenuAnchor])

  // Safe logout placeholder to avoid runtime ReferenceError when button is clicked
  const handleLogout = () => {
    // Minimal non-destructive behavior: reset chat and log action
    console.log('handleLogout invoked — clearing session state')
    setMessages([])
    setInputValue('')
    setHasStartedChat(false)
    // In a real app, you'd call auth sign-out / redirect here
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

              {conversations.length === 0 ? (
                <div style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', padding: '0.5rem 1rem' }}>
                  Start a conversation to have a chat history
                </div>
              ) : (
                conversations.map((conversation) => (
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
                ))
              )
            }
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
              // make header compact so it sits near the top beside the collapse button
              padding: "1.25rem 1.25rem 1rem",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "0.35rem",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaRobot size={16} />
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    letterSpacing: "-0.02em",
                  }}
                >
                  AMI Assistant
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8rem",
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

  {collapsed && <div style={{ height: "3rem" }} />}

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

              {conversations.length === 0 ? (
                <div style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', padding: '0.5rem 1rem' }}>
                  Start a conversation to have a chat history
                </div>
              ) : (
                conversations.map((conversation) => (
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
                ))
              )
            }
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

  // Auto-scroll to last message when messages change
  useEffect(() => {
    if (!lastMessageRef.current || !chatContainerRef.current) return
    try {
      // smooth scroll the last message into view
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    } catch (e) {
      // fallback
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Show floating Ask button only when the user selects text inside an assistant message
  useEffect(() => {
    function nodeHasAssistantAncestor(node) {
      while (node) {
        if (node.getAttribute && node.getAttribute('data-ami-assistant') === 'true') return true
        node = node.parentNode
      }
      return false
    }

    function onSelectionChange() {
      try {
        // First, handle textarea (input) selection which doesn't use document selection
        const ta = inputRef.current
        if (ta && document.activeElement === ta) {
          try {
            const start = ta.selectionStart
            const end = ta.selectionEnd
            if (typeof start === 'number' && typeof end === 'number' && end > start) {
              const selText = ta.value.slice(start, end).trim()
              if (selText) {
                // position the floating button near the input's top-right for simplicity
                const r = ta.getBoundingClientRect()
                const x = Math.min(window.innerWidth - 60, r.right + window.scrollX - 36)
                const y = Math.max(8, r.top + window.scrollY - 48)
                setAskFloatingPos({ x, y })
                setShowAskFloating(true)
                return
              }
            }
          } catch (e) {
            // ignore textarea selection errors and continue to document selection
          }
        }

        // Fallback: check document selection (for assistant message text)
        const sel = window.getSelection()
        const text = sel ? sel.toString().trim() : ''
        if (!text) {
          setShowAskFloating(false)
          return
        }

        const anchor = sel.anchorNode
        const focus = sel.focusNode
        // Ensure the selection is fully contained inside the same assistant message.
        function getAssistantAncestor(node) {
          while (node) {
            if (node.getAttribute && node.getAttribute('data-ami-assistant') === 'true') return node
            node = node.parentNode
          }
          return null
        }

        const ancA = getAssistantAncestor(anchor)
        const ancF = getAssistantAncestor(focus)
        if (!(ancA && ancF && ancA === ancF)) {
          // selection either straddles outside the assistant message or is only partially inside -> don't show
          setShowAskFloating(false)
          return
        }

        const range = sel.rangeCount ? sel.getRangeAt(0) : null
        if (!range) {
          setShowAskFloating(false)
          return
        }

        const rect = range.getBoundingClientRect()
        if (!rect || rect.width === 0 || rect.height === 0) {
          setShowAskFloating(false)
          return
        }

        const x = Math.min(window.innerWidth - 60, rect.right + window.scrollX - 36)
        const y = Math.max(8, rect.top + window.scrollY - 48)
        setAskFloatingPos({ x, y })
        setShowAskFloating(true)
      } catch (e) {
        console.warn('Error in onSelectionChange:', e)
        setShowAskFloating(false)
      }
    }

    document.addEventListener('selectionchange', onSelectionChange)
    return () => document.removeEventListener('selectionchange', onSelectionChange)
  }, [])

  // Enable the Ask button only after mouseup/touchend so it doesn't steal the mouseup event
  useEffect(() => {
    function onEnd() {
      // slight delay to allow selection to settle
      setTimeout(() => setAskClickable(true), 10)
    }

    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchend', onEnd)

    return () => {
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchend', onEnd)
    }
  }, [])

  // (Removed Ask panel/modal — keep only floating affordance)

  // Ensure textarea height resets when content is cleared programmatically or by user
  useEffect(() => {
    const ta = inputRef.current
    if (!ta) return

    // choose min heights consistent with the two implementations
    const minHeight = hasStartedChat ? 40 : 36

    // If input is empty, set to the min height; otherwise let it size naturally
    if (!inputValue) {
      ta.style.height = minHeight + 'px'
    } else {
      // ensure it fits content if there is any
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, hasStartedChat ? 220 : 120) + 'px'
    }
  }, [inputValue, hasStartedChat])

  // Autofocus input when chat starts
  useEffect(() => {
    if (hasStartedChat && inputRef.current) {
      // slight timeout to ensure textarea is mounted and any layout changes applied
      setTimeout(() => inputRef.current.focus(), 50)
    }
  }, [hasStartedChat])

  // Keep chat container bottom padding in sync with the input bar height
  useEffect(() => {
    const container = chatContainerRef.current
    const bar = inputBarRef.current
    if (!container || !bar) return

    const applyPadding = () => {
      const rect = bar.getBoundingClientRect()
      // add margin so messages aren't flush against the input
      const pad = Math.ceil(rect.height + 12)
      container.style.paddingBottom = pad + 'px'
    }

    applyPadding()

    let ro
    if (window.ResizeObserver) {
      ro = new ResizeObserver(applyPadding)
      ro.observe(bar)
    } else {
      // fallback: poll occasionally while chat is open
      const id = setInterval(applyPadding, 300)
      ro = { disconnect: () => clearInterval(id) }
    }

    // also reapply when window resizes
    window.addEventListener('resize', applyPadding)

    return () => {
      ro && ro.disconnect && ro.disconnect()
      window.removeEventListener('resize', applyPadding)
    }
  }, [hasStartedChat])

  const [quotedMessage, setQuotedMessage] = useState(null)

  const handleQuoteMessage = (message) => {
    setQuotedMessage(message)
    setTimeout(() => inputRef.current && inputRef.current.focus(), 40)
  }

  // Click handler for assistant messages: if the user has an active text selection, don't treat it as a whole-message click
  const handleAssistantClick = (message) => (e) => {
    try {
      // If the user currently has a selection (e.g. clicked-and-dragged text),
      // do not treat this as a plain click. Returning here avoids moving
      // focus to the input, which collapses the page selection.
      const sel = window.getSelection && window.getSelection()
      const selected = sel ? (sel.toString && sel.toString().trim()) : ''
      if (selected) {
        // let selection remain — do nothing on click
        return
      }

      // No active selection: focus the input so user can type
      setTimeout(() => inputRef.current && inputRef.current.focus(), 40)
      return
    } catch (err) {
      // ignore
    }
  }

  const clearQuotedMessage = () => {
    setQuotedMessage(null)
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {renderSidebar()}

      {/* Floating Ask button shown when text is selected inside an assistant message (no-op) */}
      {showAskFloating && (
        <button
          onMouseDown={(e) => { e.preventDefault(); /* keep selection when clicking */ }}
          onClick={(e) => {
            e.preventDefault()
            if (!askClickable) return
            handleAskSelection()
          }}
          title="Ask AMI about selection"
          style={{
            position: 'absolute',
            left: askFloatingPos.x,
            top: askFloatingPos.y,
            zIndex: 1200,
            background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 10px',
            borderRadius: '999px',
            boxShadow: '0 6px 18px rgba(79,70,229,0.28)',
            cursor: 'pointer',
          }}
        >
          Ask AMI
        </button>
      )}

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

              {/* Input Row - single shared textarea used for both landing and chat */}
              <div
                style={{
                  // center overlay when landing, fixed bottom when in chat
                  position: hasStartedChat ? 'static' : 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  // outer landing container already provides padding; keep this wrapper tight
                  padding: 0,
                }}
              >
                  <div
                    className="landing-input-wrapper"
                    style={{
                      alignItems: 'center',
                      gap: '1rem',
                      background: '#ffffff',
                      borderRadius: hasStartedChat ? '24px' : '30px',
                      padding: hasStartedChat ? '1rem 0.75rem' : '0.75rem 1rem',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                      border: '1px solid rgba(79, 70, 229, 0.08)',
                      maxWidth: hasStartedChat ? '1000px' : '520px',
                      width: '100%',
                      margin: hasStartedChat ? '0 auto' : '0 auto',
                      transform: isAnimating ? 'scale(0.995)' : 'scale(1)',
                      transition: 'all 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  >
                    {/* Grid layout for landing input: mic | textarea | send - prevents overlap */}
                    <div style={{ display: 'grid', gridTemplateColumns: '40px 40px 1fr 40px', alignItems: 'center', gap: '10px', padding: '6px' }}>
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => togglePlusMenu('landing')}
                          style={{
                            background: 'rgba(107, 114, 128, 0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            color: '#6b7280',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.08)'
                            e.currentTarget.style.color = '#4f46e5'
                            e.currentTarget.style.transform = 'scale(1.05)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)'
                            e.currentTarget.style.color = '#6b7280'
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
                          aria-label="Add"
                        >
                          <FaPlus size={12} />
                        </button>

                        {plusMenuOpen && plusMenuAnchor === 'landing' && (
                          <div className="plus-menu" style={{ position: 'absolute', bottom: '56px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(180deg,#ffffff 0%, #f8fafc 100%)', color: '#0f172a', borderRadius: '10px', boxShadow: '0 10px 30px rgba(2,6,23,0.16)', minWidth: '220px', overflow: 'visible', zIndex: 200 }}>
                            <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '16px', height: '16px', background: 'linear-gradient(180deg,#ffffff 0%, #f8fafc 100%)', boxShadow: '0 6px 16px rgba(2,6,23,0.06)' }} />
                            <button onClick={() => console.log('Upload image')} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                              <HiOutlinePhotograph style={{ color: '#7c3aed', minWidth: '20px' }} />
                              <span style={{ fontWeight: 600 }}>Upload image</span>
                            </button>
                            <button onClick={() => console.log('Upload file')} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                              <HiOutlineCloudUpload style={{ color: '#4f46e5', minWidth: '20px' }} />
                              <span style={{ fontWeight: 600 }}>Upload file</span>
                            </button>
                            <button onClick={() => console.log('Study mode')} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                              <HiOutlineBookOpen style={{ color: '#10b981', minWidth: '20px' }} />
                              <span style={{ fontWeight: 600 }}>Study mode</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleMicClick}
                        style={{
                          background: 'rgba(107, 114, 128, 0.1)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          color: '#6b7280',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.08)'
                          e.currentTarget.style.color = '#4f46e5'
                          e.currentTarget.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)'
                          e.currentTarget.style.color = '#6b7280'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                        aria-label="Start voice input"
                      >
                        <FaMicrophone size={14} />
                      </button>

                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={'Ask me anything...'}
                        style={{
                          width: '100%',
                          minHeight: '36px',
                          maxHeight: '140px',
                          padding: '10px 8px',
                          border: 'none',
                          outline: 'none',
                          fontSize: '0.98rem',
                          lineHeight: '1.4',
                          resize: 'none',
                          backgroundColor: 'transparent',
                          fontFamily: 'inherit',
                          color: '#374151',
                          fontWeight: '400',
                        }}
                        rows={1}
                        onInput={(e) => {
                          if (!e.target.value) {
                            e.target.style.height = '36px'
                          } else {
                            e.target.style.height = 'auto'
                            e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
                          }
                        }}
                        /* focus/blur handled via .landing-input-wrapper:focus-within in CSS */
                      />

                      <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim()}
                        style={{
                          background: inputValue.trim() ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'rgba(156, 163, 175, 0.3)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                          transition: 'all 0.18s ease',
                          color: inputValue.trim() ? '#ffffff' : '#9ca3af',
                        }}
                        aria-label="Send message"
                      >
                        <FaPaperPlane size={12} />
                      </button>
                    </div>
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
                  {/* If this is a user message that includes a quoted payload, render the quoted block above the bubble */}
                  {message.sender === 'user' && message.quoted && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                      <div style={{ maxWidth: isMobile ? '84%' : '64%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', background: 'rgba(255,255,255,0.98)', padding: '8px 12px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 6px 18px rgba(2,6,23,0.04)', color: '#374151', fontSize: 13 }} title={message.quoted.text}>
                          <div style={{ width: 4, height: '100%', background: '#e6edf8', borderRadius: 2, marginRight: 10 }} />
                          <div style={{ flex: 1, wordBreak: 'break-word', whiteSpace: 'normal' }}>{message.quoted.text}</div>
                        </div>
                        <div style={{ marginTop: 6, fontSize: 11, color: '#6b7280', textAlign: 'right' }}>Quoted</div>
                      </div>
                    </div>
                  )}
                  <div
                    {...(message.sender === "assistant" ? { "data-ami-assistant": "true" } : {})}
                    onMouseDown={message.sender === 'assistant' ? (e) => {
                      try {
                        const sel = window.getSelection()
                        selectionDuringMouseDownRef.current = sel ? sel.toString() : ''
                      } catch (err) { selectionDuringMouseDownRef.current = '' }
                    } : undefined}
                    onTouchStart={message.sender === 'assistant' ? (e) => {
                      try {
                        const sel = window.getSelection()
                        selectionDuringMouseDownRef.current = sel ? sel.toString() : ''
                      } catch (err) { selectionDuringMouseDownRef.current = '' }
                    } : undefined}
                    onMouseUp={message.sender === 'assistant' ? (e) => {
                      // clear shortly after mouse up so click can check it
                      setTimeout(() => { selectionDuringMouseDownRef.current = '' }, 10)
                    } : undefined}
                    onTouchEnd={message.sender === 'assistant' ? (e) => {
                      setTimeout(() => { selectionDuringMouseDownRef.current = '' }, 10)
                    } : undefined}
                    onClick={message.sender === 'assistant' ? handleAssistantClick({ id: message.id, text: (message.html ? extractTextFromHtml(message.html) : message.text) || '' }) : undefined}
                    role={message.sender === 'assistant' ? 'button' : undefined}
                    tabIndex={message.sender === 'assistant' ? 0 : undefined}
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
                      position: "relative",
                      cursor: message.sender === 'assistant' ? 'pointer' : 'default',
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
            {/* Attach a dummy anchor at the end to ensure scrollIntoView always has a target */}
            <div ref={lastMessageRef} />
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
              {/* Mic Button moved inside input container (visual: inside the rounded input) */}

              {/* Input Field Container */}
              <div
                style={{
                  flex: 1,
                  maxWidth: "1000px",
                  position: "relative",
                  background: "#ffffff",
                  borderRadius: "24px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "2px solid rgba(79, 70, 229, 0.1)",
                  overflow: "visible", /* allow the + menu to overflow above the container */
                }}
              >
                {/* Ask preview removed - keep only floating Ask button */}
                {/* Grid layout: mic | textarea | send - avoids overlap */}
                <div style={{ display: 'grid', gridTemplateColumns: '44px 44px 1fr 44px', alignItems: 'center', gap: '12px', padding: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => togglePlusMenu('bottom')}
                      style={{
                        background: 'rgba(107, 114, 128, 0.08)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        color: '#6b7280',
                      }}
                      aria-label="Add"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.08)'
                        e.currentTarget.style.color = '#4f46e5'
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.08)'
                        e.currentTarget.style.color = '#6b7280'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      <FaPlus size={12} />
                    </button>

                    {plusMenuOpen && plusMenuAnchor === 'bottom' && (
                      <div className="plus-menu" style={{ position: 'absolute', bottom: '56px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(180deg,#ffffff 0%, #f8fafc 100%)', color: '#0f172a', borderRadius: '10px', boxShadow: '0 10px 30px rgba(2,6,23,0.16)', minWidth: '220px', overflow: 'visible', zIndex: 200 }}>
                        <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '16px', height: '16px', background: 'linear-gradient(180deg,#ffffff 0%, #f8fafc 100%)', boxShadow: '0 6px 16px rgba(2,6,23,0.06)' }} />
                        <button onClick={() => console.log('Upload image')} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <HiOutlinePhotograph style={{ color: '#7c3aed', minWidth: '20px' }} />
                          <span style={{ fontWeight: 600 }}>Upload image</span>
                        </button>
                        <button onClick={() => console.log('Upload file')} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <HiOutlineCloudUpload style={{ color: '#4f46e5', minWidth: '20px' }} />
                          <span style={{ fontWeight: 600 }}>Upload file</span>
                        </button>
                        <button onClick={() => console.log('Study mode')} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <HiOutlineBookOpen style={{ color: '#10b981', minWidth: '20px' }} />
                          <span style={{ fontWeight: 600 }}>Study mode</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleMicClick}
                    style={{
                      background: 'rgba(107, 114, 128, 0.08)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      color: '#6b7280',
                    }}
                    aria-label="Start voice input"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.08)'
                      e.currentTarget.style.color = '#4f46e5'
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.08)'
                      e.currentTarget.style.color = '#6b7280'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    <FaMicrophone size={14} />
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {quotedMessage && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f3f4f6', padding: '8px 12px', borderRadius: 12, border: '1px solid #e6e9ef', maxWidth: '100%', boxSizing: 'border-box' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#eef2ff 0%,#ede9fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', flex: '0 0 36px' }}>
                          <FaArrowRight size={14} />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#111827', fontSize: 13 }} title={quotedMessage.text}>{quotedMessage.text}</div>
                        <button onClick={clearQuotedMessage} aria-label="Clear quoted message" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                          <FaTimes />
                        </button>
                      </div>
                    )}

                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onInput={(e) => {
                        const val = e.target.value
                        setInputValue(val)
                        // auto-resize
                        try {
                          e.target.style.height = 'auto'
                          const h = Math.min(e.target.scrollHeight, 220)
                          e.target.style.height = h + 'px'
                        } catch (err) {}
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      style={{
                        width: '100%',
                        minHeight: '40px',
                        maxHeight: '220px',
                        padding: '12px 8px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.95rem',
                        lineHeight: '1.4',
                        resize: 'none',
                        backgroundColor: 'transparent',
                        fontFamily: 'inherit',
                        color: '#374151',
                        fontWeight: '400',
                      }}
                    />
                  </div>

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    style={{
                      background: inputValue.trim() ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'rgba(156, 163, 175, 0.3)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.18s ease',
                      color: inputValue.trim() ? '#ffffff' : '#9ca3af',
                      boxShadow: inputValue.trim() ? '0 4px 15px rgba(79, 70, 229, 0.4)' : 'none',
                    }}
                    aria-label="Send message"
                  >
                    <FaPaperPlane size={14} />
                  </button>
                </div>
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

          /* Animate textarea resizing for smooth expand/shrink */
          textarea {
            transition: height 160ms ease, min-height 160ms ease, max-height 160ms ease;
            overflow: hidden; /* prevents odd scroll flashes during transition */
          }

          /* Landing input wrapper focus style - subtle ring but no giant rect */
          .landing-input-wrapper:focus-within {
            box-shadow: 0 6px 24px rgba(79, 70, 229, 0.12);
            border-color: rgba(79, 70, 229, 0.18) !important;
          }

          /* Allow textareas to scroll when content exceeds max-height */
          textarea {
            overflow: auto;
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

          /* Focus ring for accessibility */
          button:focus-visible {
            outline: 2px solid rgba(79,70,229,0.5);
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
  );
}

export default Chat

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
          const aiResponse = {
            id: Date.now() + 1,
            text: `Great! I'd be happy to help you with "${textToSend}". Let me provide you with some guidance on that topic.`,
            sender: "assistant",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiResponse])
        }, 600)
      }, 400)
    } else {
      setMessages((prev) => [...prev, userMessage])
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: "I understand what you need. Let me help you with that right away!",
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
                  }}
                />

                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  style={{
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
                  }}
                  onMouseEnter={(e) => {
                    if (inputValue.trim()) {
                      e.target.style.transform = "scale(1.05)"
                      e.target.style.boxShadow = "0 8px 25px rgba(79, 70, 229, 0.5)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)"
                    if (inputValue.trim()) {
                      e.target.style.boxShadow = "0 4px 20px rgba(79, 70, 229, 0.4)"
                    }
                  }}
                >
                  <FaPaperPlane size={14} />
                </button>
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
              padding: isMobile ? "1.5rem 1rem" : "2rem 2rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
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
                      minWidth: "36px",
                      height: "36px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                      marginTop: "0.25rem",
                    }}
                  >
                    <FaRobot size={16} color="white" />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: isMobile ? "75%" : "70%",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      padding: "1.25rem 1.5rem",
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
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
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
                    {message.text}

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
                          navigator.clipboard.writeText(message.text)
                        }}
                        style={{
                          background: "rgba(107, 114, 128, 0.1)",
                          border: "none",
                          borderRadius: "6px",
                          width: "28px",
                          height: "28px",
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
                        title="Copy message"
                      >
                        <FaCopy size={12} />
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
                          width: "28px",
                          height: "28px",
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
                        <FaRedo size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {message.sender === "user" && (
                  <div
                    style={{
                      minWidth: "36px",
                      height: "36px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                      marginTop: "0.25rem",
                    }}
                  >
                    <FaUser size={14} color="white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Input Bar - Only in Chat Mode */}
        {hasStartedChat && (
          <div
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
                gap: "1rem",
                alignItems: "center",
                maxWidth: "1000px",
                margin: "0 auto",
                marginLeft: isMobile ? "0" : "1rem",
                marginRight: isMobile ? "0" : "1rem",
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

              {/* Input Field Container */}
              <div
                style={{
                  flex: 1,
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
                    padding: "1rem 60px 1rem 1.5rem",
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
                    e.target.style.height = "auto"
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
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

                {/* Send Button */}
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
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: inputValue.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    color: inputValue.trim() ? "#ffffff" : "#9ca3af",
                    boxShadow: inputValue.trim() ? "0 4px 15px rgba(79, 70, 229, 0.4)" : "none",
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
          }
          
          /* Smooth transitions for all interactive elements */
          * {
            transition: all 0.2s ease;
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
        `}</style>
      </div>
    </div>
  )
}

export default Chat

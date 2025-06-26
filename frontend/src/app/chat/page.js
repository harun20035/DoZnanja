"use client"

import { useState, useEffect, useRef } from "react"
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemText,
  ListItemAvatar, Avatar, Paper, Container, Grid, IconButton,
  Badge, Divider, TextField,
} from "@mui/material"
import {
  Phone, VideoCall, MoreVert, AttachFile, EmojiEmotions, Send, Circle,
} from "@mui/icons-material"
import styles from "./Chat.module.css"
import getHeaderByRole from "../../components/layoutComponents"
import { useParams, useRouter } from "next/navigation"
import { getRoleFromToken, getUserDataFromToken } from "@/utils/auth";
import Footer from "../../components/footer/Footer"


export default function ChatPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const socketRef = useRef(null)
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState('');
  const router = useRouter()
 
 
 
  useEffect(() => {
        const checkAuthorization = () => {
          try {
            const role = getRoleFromToken();
            setRole(role);
            const user = getUserDataFromToken();
            setUsername(user?.username || '');
            
            // Ako korisnik ima bilo koju rolu, smatramo ga autoriziranim
            if (role) {
              // Dodatna logika ako je potrebno
            } else {
              router.push("/login"); // Preusmjeri na login ako nema role
            }
          } catch (error) {
            console.error("Authorization error:", error);
            router.push("/login");
          }
        };
    
        checkAuthorization();
      }, [router]);
  

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getInitials = (name) => {
    if (!name) return "U"
    return name.split(" ").map((n) => n[0]).join("").toUpperCase()
  }

  useEffect(() => {
    const fetchChatPartners = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const response = await fetch("http://localhost:8000/chat/partners", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error("Greška pri dohvatanju partnera.")

        const data = await response.json()
        const transformed = data.map((partner) => ({
          id: partner.id,
          name: partner.name,
          surname: partner.surname,
          role: "CHAT_PARTNER",
          course: partner.course_title || partner.courseTitle,
          courseId: partner.course_id ?? partner.courseId ?? null,
          avatar: partner.profile_image
            ? `http://localhost:8000/${partner.profile_image.replace(/\\/g, "/")}`
            : null,
          lastMessage: "Klikni da započneš razgovor",
          lastMessageTime: "--:--",
          unreadCount: 0,
          isOnline: true,
        }))
        setUsers(transformed)
      } catch (error) {
        console.error("Greška:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatPartners()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      const token = localStorage.getItem("auth_token")
      const ws = new WebSocket(
        `ws://localhost:8000/chat/ws/chat/${selectedUser.id}/${selectedUser.courseId}?token=${token}`
      )

      ws.onopen = () => console.log("🔌 WebSocket konektovan")

      ws.onmessage = (event) => {
        const now = new Date()
        const msg = {
          id: Date.now(),
          senderId: selectedUser.id,
          message: event.data,
          timestamp: now.toLocaleTimeString("sr-Latn-BA", { hour: "2-digit", minute: "2-digit" }),
          isOwn: false,
        }
        setMessages((prev) => [...prev, msg])
      }

      ws.onclose = () => console.log("🔌 WebSocket zatvoren")
      socketRef.current = ws

      return () => ws.close()
    }
  }, [selectedUser])

  // 🔥 DODANO OVDJE: Fetch starih poruka iz API-ja
  const fetchMessages = async (userId, courseId) => {
    try {
      const token = localStorage.getItem("auth_token")
      const res = await fetch(`http://localhost:8000/chat/messages/${userId}/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Greška pri dohvatanju poruka.")

      const data = await res.json()

      const formatted = data.map((msg) => ({
        id: msg.id,
        senderId: msg.sender_id,
        message: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleTimeString("sr-Latn-BA", {
          hour: "2-digit", minute: "2-digit"
        }),
        isOwn: msg.sender_id !== userId,
      }))

      setMessages(formatted)
    } catch (err) {
      console.error("❌ Greška kod učitavanja poruka:", err)
    }
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setMessages([])
    fetchMessages(user.id, user.courseId) // ✅ OVO JE JEDINO DODANO U POSTOJEĆI KOD
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser && socketRef.current) {
      const now = new Date()
      const msg = {
        id: Date.now(),
        senderId: "me",
        message: newMessage,
        timestamp: now.toLocaleTimeString("sr-Latn-BA", { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
      }
      socketRef.current.send(newMessage)
      setMessages((prev) => [...prev, msg])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isMounted || isLoading) {
    return (
      <Box p={4}>
        <Typography>Učitavanje konverzacija...</Typography>
      </Box>
    )
  }

  return (
     <Box className={styles.chatContainer}>
      
                {getHeaderByRole(role)}
      
      

      <Container maxWidth="xl" className={styles.mainContent}>
        <Grid container spacing={0} className={styles.chatGrid}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper className={styles.usersSidebar}>
              <Box className={styles.sidebarHeader}>
                <Typography variant="h6" className={styles.sidebarTitle}>Konverzacije</Typography>
              </Box>
              <Divider className={styles.divider} />
              <List className={styles.usersList}>
                {users.map((user) => (
                  <ListItem key={`${user.id}-${user.courseId}`} disablePadding>

                    <ListItemButton
                      onClick={() => handleUserSelect(user)}
                      className={`${styles.userItem} ${selectedUser?.id === user.id ? styles.activeUser : ""}`}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                          badgeContent={user.isOnline ? <Circle className={styles.onlineIndicator} /> : null}
                        >
                          <Avatar src={user.avatar} alt={user.name}>
                            {!user.avatar && getInitials(`${user.name} ${user.surname}`)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box className={styles.userInfo}>
                            <Typography className={styles.userName}>
                              {user.name} {user.surname}
                            </Typography>
                            {user.unreadCount > 0 && (
                              <Badge badgeContent={user.unreadCount} className={styles.unreadBadge} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography className={styles.userRole}>
                              Kurs: <strong>{user.course}</strong>
                            </Typography>
                            <Typography className={styles.lastMessage}>{user.lastMessage}</Typography>
                          </Box>
                        }
                      />
                      <Typography className={styles.messageTime}>{user.lastMessageTime}</Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            {selectedUser ? (
              <Paper className={styles.chatArea}>
                <Box className={styles.chatAreaHeader}>
                  <Box className={styles.chatUserInfo}>
                    <Avatar src={selectedUser.avatar} alt={selectedUser.name}>
                      {!selectedUser.avatar && getInitials(`${selectedUser.name} ${selectedUser.surname}`)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" className={styles.chatUserName}>
                        {selectedUser.name} {selectedUser.surname}
                      </Typography>
                      <Typography className={styles.chatUserRole}>
                        Kurs: {selectedUser.course} • {selectedUser.isOnline ? "Online" : "Offline"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className={styles.chatActions}>
                    <IconButton className={styles.actionButton}><Phone /></IconButton>
                    <IconButton className={styles.actionButton}><VideoCall /></IconButton>
                    <IconButton className={styles.actionButton}><MoreVert /></IconButton>
                  </Box>
                </Box>

                <Box className={styles.messagesArea}>
                  {messages.map((msg) => (
                    <Box
  key={`${msg.id}-${msg.timestamp}`}
  className={`${styles.messageContainer} ${msg.isOwn ? styles.ownMessage : styles.otherMessage}`}
>

                      <Box className={styles.messageBubble}>
                        <Typography className={styles.messageText}>{msg.message}</Typography>
                        <Typography className={styles.messageTimestamp}>{msg.timestamp}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box className={styles.messageInput}>
                  <IconButton className={styles.attachButton}><AttachFile /></IconButton>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Napišite poruku..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    className={styles.inputField}
                  />
                  <IconButton className={styles.emojiButton}><EmojiEmotions /></IconButton>
                  <IconButton onClick={handleSendMessage} className={styles.sendButton}><Send /></IconButton>
                </Box>
              </Paper>
            ) : (
              <Paper className={styles.noChatSelected}>
                <Typography variant="h6" className={styles.noChatText}>
                  Odaberite konverzaciju da počnete chat
                </Typography>
                <Typography variant="body2" className={styles.noChatSubtext}>
                  Kliknite na korisnika s lijeve strane
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
      <Footer/>
    </Box>
    
  )
}

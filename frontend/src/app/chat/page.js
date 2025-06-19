"use client"

import { useState, useEffect } from "react"
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemText,
  ListItemAvatar, Avatar, Paper, Container, Grid, IconButton,
  Badge, Divider, TextField,
} from "@mui/material"
import {
  Phone, VideoCall, MoreVert, AttachFile, EmojiEmotions, Send, Circle,
} from "@mui/icons-material"
import styles from "./Chat.module.css"

export default function ChatPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isMounted, setIsMounted] = useState(false)

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
        const token = localStorage.getItem("auth_token");
        

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
          course: partner.course_title,
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

  const getMessagesForUser = (userId) => {
    const messagesByUser = {
      1: [
        {
          id: 1,
          senderId: 1,
          message: "Zdravo! Kako napreduje sa React kursem?",
          timestamp: "14:25",
          isOwn: false,
        },
        {
          id: 2,
          senderId: "me",
          message: "Super! Upravo završavam lekciju o hooks-ima.",
          timestamp: "14:27",
          isOwn: true,
        },
      ],
    }
    return messagesByUser[userId] || []
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setMessages(getMessagesForUser(user.id))
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const now = new Date()
      const message = {
        id: messages.length + 1,
        senderId: "me",
        message: newMessage,
        timestamp: now.toLocaleTimeString("sr-Latn-BA", { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
      }
      setMessages([...messages, message])
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
      <Box className={styles.chatHeader}>
        <Container maxWidth="xl">
          <Typography variant="h3" className={styles.chatTitle}>
            Poruke i Chat
          </Typography>
          <Typography variant="h6" className={styles.chatDescription}>
            Komunicirajte sa instruktorima i studentima uz kupljene kurseve
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" className={styles.mainContent}>
        <Grid container spacing={0} className={styles.chatGrid}>
          {/* Sidebar */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper className={styles.usersSidebar}>
              <Box className={styles.sidebarHeader}>
                <Typography variant="h6" className={styles.sidebarTitle}>
                  Konverzacije
                </Typography>
              </Box>
              <Divider className={styles.divider} />
              <List className={styles.usersList}>
                {users.map((user) => (
                  <ListItem key={user.id} disablePadding>
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

          {/* Chat Area */}
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
                      key={msg.id}
                      className={`${styles.messageContainer} ${
                        msg.isOwn ? styles.ownMessage : styles.otherMessage
                      }`}
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
    </Box>
  )
}

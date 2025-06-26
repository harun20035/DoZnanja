"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageSquare } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Typography,
} from "@mui/material"
import styles from "./chat-preview.module.css"

export function UserChatPreview() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch("http://localhost:8000/chat/messages/last", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Greška pri dohvatanju poruka.")
        const data = await res.json()

        const transformed = data.map((msg) => ({
          id: msg.id,
          user: `${msg.name} ${msg.surname}`,
          message: msg.message.length > 80 ? msg.message.slice(0, 80) + "..." : msg.message,
          time: new Date(msg.timestamp).toLocaleTimeString("sr-Latn-BA", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: msg.avatar
            ? `http://localhost:8000/${msg.avatar.replace(/\\/g, "/")}`
            : `${msg.name[0]}${msg.surname[0]}`.toUpperCase(),
        }))

        setMessages(transformed)
      } catch (err) {
        console.error("❌ Ne mogu dohvatiti poruke:", err)
      }
    }

    fetchMessages()
  }, [])

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.cardHeader}
        title={
          <Typography component="div" className={styles.cardTitle}>
            <MessageSquare className={styles.titleIcon} />
            Nedavne poruke
          </Typography>
        }
      />
      <CardContent className={styles.cardContent}>
        <div className={styles.messageList}>
          {messages.length === 0 ? (
            <p className={styles.noMessages}>Nema poruka za prikaz.</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={styles.messageItem}>
                {message.avatar.startsWith("http") ? (
                  <Avatar
                    className={`${styles.messageAvatar} ${styles.avatarBlue}`}
                    src={message.avatar}
                  />
                ) : (
                  <Avatar className={`${styles.messageAvatar} ${styles.avatarPurple}`}>
                    {message.avatar}
                  </Avatar>
                )}

                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <div>
                      <p className={styles.messageSender}>{message.user}</p>
                    </div>
                    <span className={styles.messageTime}>{message.time}</span>
                  </div>
                  <p className={styles.messageText}>{message.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardActions className={styles.cardFooter}>
        <Button variant="outlined" className={styles.viewAllButton}>
          <Link href="/user/chat" className={styles.viewAllLink}>
            <MessageSquare className={styles.buttonIcon} />
            Pogledaj sve poruke
          </Link>
        </Button>
      </CardActions>
    </Card>
  )
}

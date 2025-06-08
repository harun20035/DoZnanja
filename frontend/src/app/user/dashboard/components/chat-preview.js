import Link from "next/link"
import { MessageSquare } from "lucide-react"
import { Button, Card, CardContent, CardActions, CardHeader, Avatar, Typography } from "@mui/material"
import styles from "./chat-preview.module.css"

export function UserChatPreview() {
  const messages = [
    {
      id: 1,
      user: "David Miller",
      role: "Instruktor",
      message: "Zdravo Alex! Kako ti se čini JavaScript modul?",
      time: "Prije 2h",
      avatar: "DM",
      unread: true,
    },
    {
      id: 2,
      user: "Sarah Wilson",
      role: "Asistent za nastavu",
      message: "Tvoj projekat izgleda odlično! Ostavio/la sam neke komentare.",
      time: "Jučer",
      avatar: "SW",
      unread: false,
    },
  ]

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}
        title={
          <Typography component="div" className={styles.cardTitle}>
            <MessageSquare className={styles.titleIcon} />
            Nedavne poruke
          </Typography>
        }
      />
      <CardContent className={styles.cardContent}>
        <div className={styles.messageList}>
          {messages.map((message) => (
            <div key={message.id} className={`${styles.messageItem} ${message.unread ? styles.unread : ""}`}>
              <Avatar className={styles.messageAvatar} src={`/placeholder.svg?height=40&width=40`}>
                {/* fallback: ako nema slike, pokaži avatar tekst */}
                {message.avatar}
              </Avatar>
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <div>
                    <p className={styles.messageSender}>{message.user}</p>
                    <p className={styles.messageRole}>{message.role}</p>
                  </div>
                  <span className={styles.messageTime}>{message.time}</span>
                </div>
                <p className={styles.messageText}>{message.message}</p>
                {message.unread && <span className={styles.unreadIndicator}></span>}
              </div>
            </div>
          ))}
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

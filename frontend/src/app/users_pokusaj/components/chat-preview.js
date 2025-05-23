import Link from "next/link";
import { MessageSquare } from "lucide-react"; // Ikonicu možeš zameniti ili skinuti sa interneta ako ne koristiš lucide

import styles from "./chat-preview.module.css";

export function UserChatPreview() {
  const messages = [
    {
      id: 1,
      user: "David Miller",
      role: "Instructor",
      message: "Hi Alex! How are you finding the JavaScript module?",
      time: "2h ago",
      avatar: "DM",
      unread: true,
    },
    {
      id: 2,
      user: "Sarah Wilson",
      role: "Teaching Assistant",
      message: "Your project submission looks great! I've left some feedback.",
      time: "Yesterday",
      avatar: "SW",
      unread: false,
    },
  ];

  return (
    <div className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <MessageSquare className={styles.titleIcon} />
          Recent Messages
        </h2>
      </header>

      <main className={styles.cardContent}>
        <div className={styles.messageList}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageItem} ${
                message.unread ? styles.unread : ""
              }`}
            >
              <div className={styles.messageAvatar}>
                {/* Avatar fallback */}
                <div className={styles.avatarFallback}>{message.avatar}</div>
              </div>

              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <div>
                    <p className={styles.messageSender}>{message.user}</p>
                    <p className={styles.messageRole}>{message.role}</p>
                  </div>
                  <span className={styles.messageTime}>{message.time}</span>
                </div>
                <p className={styles.messageText}>{message.message}</p>
                {message.unread && (
                  <span className={styles.unreadIndicator}></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.cardFooter}>
        <Link href="/user/chat" className={styles.viewAllLink}>
          <button className={styles.viewAllButton}>
            <MessageSquare className={styles.buttonIcon} />
            View All Messages
          </button>
        </Link>
      </footer>
    </div>
  );
}

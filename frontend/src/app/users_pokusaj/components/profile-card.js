import { User, Settings } from "lucide-react"
import styles from "./profile-card.module.css"

export function UserProfileCard() {
  // Hardkodirani user podaci
  const userData = {
    name: "Jovan Jovanović",
    role: "Student",
    avatar: "", // ili neka URL slika ako imaš, npr "/avatar.jpg"
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Simple Button komponenta
  const Button = ({ children, variant, className, ...props }) => {
    const baseClass = variant === "outline" ? styles.editButton : ""
    return (
      <button className={`${baseClass} ${className || ""}`} {...props}>
        {children}
      </button>
    )
  }

  // Simple Card komponenta
  const Card = ({ children, className }) => (
    <div className={`${styles.card} ${className || ""}`}>{children}</div>
  )
  const CardHeader = ({ children, className }) => (
    <div className={`${styles.cardHeader} ${className || ""}`}>{children}</div>
  )
  const CardTitle = ({ children, className }) => (
    <h2 className={`${styles.cardTitle} ${className || ""}`}>{children}</h2>
  )
  const CardContent = ({ children, className }) => (
    <div className={`${styles.cardContent} ${className || ""}`}>{children}</div>
  )
  const CardFooter = ({ children, className }) => (
    <div className={`${styles.cardFooter} ${className || ""}`}>{children}</div>
  )

  // Simple Avatar komponenta
  const Avatar = ({ src, alt, fallback, className }) => (
    <div className={`${styles.avatar} ${className || ""}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
        />
      ) : (
        <div className={styles.avatarFallback}>{fallback}</div>
      )}
    </div>
  )

  // Simple Progress bar
  const Progress = ({ value, className }) => (
    <div
      className={className}
      style={{ backgroundColor: "#f3e8ff", borderRadius: "4px", overflow: "hidden" }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "0.5rem",
          backgroundColor: "#6b46c1",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <User className={styles.titleIcon} />
          My Profile
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Avatar src={userData.avatar} alt="Profile" fallback={getInitials(userData.name)} />

        <h3 className={styles.userName}>{userData.name}</h3>
        <p className={styles.userRole}>{userData.role}</p>

        <div className={styles.goalsSection}>
          <div className={styles.goalHeader}>
            <span className={styles.goalLabel}>Learning Goals</span>
            <span className={styles.goalProgress}>3/5 completed</span>
          </div>
          <Progress value={60} className={styles.progressBar} />
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <p className={styles.statValue}>7</p>
            <p className={styles.statLabel}>Courses</p>
          </div>
          <div className={styles.statItem}>
            <p className={styles.statValue}>12</p>
            <p className={styles.statLabel}>Certificates</p>
          </div>
          <div className={styles.statItem}>
            <p className={styles.statValue}>86h</p>
            <p className={styles.statLabel}>Learning</p>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline">
          <a href="/user/profile/edit" className={styles.editButtonLink}>
            <Settings className={styles.editButtonIcon} />
            Edit Profile
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

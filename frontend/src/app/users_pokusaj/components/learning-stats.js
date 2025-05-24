import { Clock, Award, Calendar, BookOpen } from "lucide-react"
import styles from "./learning-stats.module.css"

export function LearningStats() {
  return (
    <div className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <Award className={styles.titleIcon} />
          Learning Stats
        </h2>
      </header>
      <section className={styles.cardContent}>
        <div className={styles.statsList}>
          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <Clock className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Learning Time</p>
              <p className={styles.statValue}>86 hours total</p>
              <p className={styles.statChange}>+5 hours this week</p>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <BookOpen className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Courses Completed</p>
              <p className={styles.statValue}>12 of 19</p>
              <p className={styles.statChange}>2 completed this month</p>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <Calendar className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Learning Streak</p>
              <p className={styles.statValue}>8 days</p>
              <p className={styles.statStreak}>Keep it up!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { Clock, Award, Calendar, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, Typography } from "@mui/material"
import styles from "./learning-stats.module.css"

export function LearningStats() {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader} 
        title={
          <Typography variant="h6" className={styles.cardTitle} component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Award className={styles.titleIcon} />
            Learning Stats
          </Typography>
        }
      />
      <CardContent className={styles.cardContent}>
        <div className={styles.statsList}>
          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <Clock className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <Typography variant="body2" className={styles.statLabel}>Learning Time</Typography>
              <Typography variant="subtitle1" className={styles.statValue}>86 hours total</Typography>
              <Typography variant="caption" className={styles.statChange}>+5 hours this week</Typography>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <BookOpen className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <Typography variant="body2" className={styles.statLabel}>Courses Completed</Typography>
              <Typography variant="subtitle1" className={styles.statValue}>12 of 19</Typography>
              <Typography variant="caption" className={styles.statChange}>2 completed this month</Typography>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <Calendar className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <Typography variant="body2" className={styles.statLabel}>Learning Streak</Typography>
              <Typography variant="subtitle1" className={styles.statValue}>8 days</Typography>
              <Typography variant="caption" className={styles.statStreak}>Keep it up!</Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

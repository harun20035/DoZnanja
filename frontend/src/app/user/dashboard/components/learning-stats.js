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
            Statistike učenja
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
              <Typography variant="body2" className={styles.statLabel}>Vrijeme učenja</Typography>
              <Typography variant="subtitle1" className={styles.statValue}>86 sati ukupno</Typography>
              <Typography variant="caption" className={styles.statChange}>+5 sati ovog tjedna</Typography>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <BookOpen className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <Typography variant="body2" className={styles.statLabel}>Završeni kursevi</Typography>
              <Typography variant="subtitle1" className={styles.statValue}>12 od 19</Typography>
              <Typography variant="caption" className={styles.statChange}>2 završena ovog mjeseca</Typography>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIconWrapper}>
              <Calendar className={styles.statIcon} />
            </div>
            <div className={styles.statInfo}>
              <Typography variant="body2" className={styles.statLabel}>Streak učenja</Typography>
              <Typography variant="subtitle1" className={styles.statValue}>8 dana</Typography>
              <Typography variant="caption" className={styles.statStreak}>Nastavi tako!</Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

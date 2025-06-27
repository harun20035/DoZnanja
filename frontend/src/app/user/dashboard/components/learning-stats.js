import { Sparkles, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./learning-stats.module.css";

const SAVJETI = [
  {
    naslov: "Uči pametnije, ne više.",
    opis: "Mozak voli pauze — koristi tehniku 25/5: 25 minuta učenja, 5 minuta odmora.",
    podtekst: "🔁 Fokus + pauza = uspjeh!"
  },
  {
    naslov: "Ponovi odmah poslije učenja.",
    opis: "Recitiraj šta si naučio naglas – to jača pamćenje.",
    podtekst: "🧠 Aktivno učenje > pasivno čitanje"
  },
  {
    naslov: "Uči kad si najfokusiraniji.",
    opis: "Neki bolje uče ujutro, neki navečer – pronađi svoj ritam.",
    podtekst: "⏰ Prilagodi ritam sebi"
  },
  {
    naslov: "Piši rukom umjesto tipkanja.",
    opis: "Ručnim pisanjem više angažuješ mozak i bolje pamtiš.",
    podtekst: "✍️ Mozak voli olovku"
  },
  {
    naslov: "Pravi mini-kvizove za sebe.",
    opis: "Testiranje pomaže dugoročnom pamćenju više nego samo čitanje.",
    podtekst: "📚 Testiraj um – učvrsti znanje"
  },
  {
    naslov: "Spavanje je dio učenja.",
    opis: "Mozak konsoliduje informacije dok spavaš – nemoj učiti do 3 ujutro.",
    podtekst: "😴 Spavaj pametno"
  },
  {
    naslov: "Uči kao da predaješ.",
    opis: "Zamisli da moraš objasniti gradivo nekome drugom – tada ga bolje razumiješ.",
    podtekst: "🎓 Najbolji učenik je dobar učitelj"
  }
];

export function LearningStats() {
  const [savjeti, setSavjeti] = useState([]);

  useEffect(() => {
    const shuffled = [...SAVJETI].sort(() => 0.5 - Math.random());
    setSavjeti(shuffled.slice(0, 2)); // uzmi prva 2 iz izmiješane liste
  }, []);

  if (savjeti.length !== 2) return null;

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.cardHeader}
        title={
          <Typography
            variant="h6"
            className={styles.cardTitle}
            component="div"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Sparkles className={styles.titleIcon} />
            Savjeti za učenje
          </Typography>
        }
      />
      <CardContent className={styles.cardContent}>
        <div className={styles.statsList}>
          {savjeti.map((savjet, index) => (
            <div key={index} className={styles.statItem} style={{ marginBottom: index === 0 ? '1rem' : 0 }}>
              <div className={styles.statIconWrapper}>
                <Lightbulb className={styles.statIcon} />
              </div>
              <div className={styles.statInfo}>
                <Typography variant="body2" className={styles.statLabel}>
                  {savjet.naslov}
                </Typography>
                <Typography variant="subtitle1" className={styles.statValue}>
                  {savjet.opis}
                </Typography>
                <Typography variant="caption" className={styles.statStreak}>
                  {savjet.podtekst}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

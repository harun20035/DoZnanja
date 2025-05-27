import React from "react"
import Link from "next/link"
import { Box, Typography } from "@mui/material"

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid #5a32a3",
        backgroundColor: "#6b46c1",  // tamniji ljubičasti kao header
        py: 5,
        color: "white",              // bela slova
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "space-between",
          }}
        >
          {/* Logo and description */}
          <Box sx={{ flex: "1 1 250px", minWidth: 250 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontSize: 32, mr: 1 }}>📚</Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: 20, color: "white" }}>DoZnanja</Typography>
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
              Platforma za online učenje koja povezuje studente sa kvalitetnim kursevima.
            </Typography>
          </Box>

          {/* Linkovi */}
          <Box sx={{ flex: "1 1 150px", minWidth: 150 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1, color: "white" }}>Linkovi</Typography>
            {[
              { href: "/about", label: "O nama" },
              { href: "/courses", label: "Kursevi" },
              { href: "/instructors", label: "Predavači" },
              { href: "/blog", label: "Blog" },
            ].map(({ href, label }) => (
              <Box key={href} sx={{ mb: 0.5 }}>
                <Link href={href} passHref legacyBehavior>
                  <Typography
                    component="a"
                    sx={{
                      textDecoration: "none",
                      color: "rgba(255,255,255,0.8)",
                      fontSize: 14,
                      "&:hover": { textDecoration: "underline", color: "#d8b4fe" },
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Box>

          {/* Podrška */}
          <Box sx={{ flex: "1 1 150px", minWidth: 150 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1, color: "white" }}>Podrška</Typography>
            {[
              { href: "/help", label: "Pomoć" },
              { href: "/faq", label: "Česta pitanja" },
              { href: "/contact", label: "Kontakt" },
            ].map(({ href, label }) => (
              <Box key={href} sx={{ mb: 0.5 }}>
                <Link href={href} passHref legacyBehavior>
                  <Typography
                    component="a"
                    sx={{
                      textDecoration: "none",
                      color: "rgba(255,255,255,0.8)",
                      fontSize: 14,
                      "&:hover": { textDecoration: "underline", color: "#d8b4fe" },
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            mt: 4,
            pt: 4,
            borderTop: "1px solid #5a32a3",
            textAlign: "center",
            color: "rgba(255,255,255,0.6)",
            fontSize: 12,
          }}
        >
          &copy; {new Date().getFullYear()} DoZnanja. Sva prava zadržana.
        </Box>
      </Box>
    </Box>
  )
}

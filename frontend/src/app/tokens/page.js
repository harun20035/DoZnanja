"use client"
import { useRouter } from 'next/navigation';
import { getRoleFromToken, getUserDataFromToken } from '@/utils/auth';
import getHeaderByRole from "../../components/layoutComponents";
import Footer from "../../components/footer/Footer";
import { useEffect, useState } from "react"
import TokenInfo from "./components/TokenInfo"
import TokenPurchase from "./components/TokenPurchase"
import "./tokens.css"

export default function TokensPage() {
  const [currentTokens, setCurrentTokens] = useState(0)
  const [isAddingTokens, setIsAddingTokens] = useState(false)
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(null);

  // Fetch podataka o korisniku (uključujući credits)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // zamijeni ako token čuvaš drugdje
          },
        })

        const data = await response.json()
        // Ako je response tipa { username: ..., credits: ... }
        setCurrentTokens(data.credits)
      } catch (error) {
        console.error("Greška pri dohvaćanju korisničkih podataka:", error)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const role = getRoleFromToken();
        setRole(role);
        const user = getUserDataFromToken();
        setUsername(user?.username || '');
        
        // Ako korisnik ima bilo koju rolu, smatramo ga autoriziranim
        if (role) {
          // Dodatna logika ako je potrebno
        } else {
          router.push("/login"); // Preusmjeri na login ako nema role
        }
      } catch (error) {
        console.error("Authorization error:", error);
        router.push("/login");
      }
    };

    checkAuthorization();
  }, [router]);

  if (!role) {
    return <div>Loading...</div>; // Bolje od null za UX
  }

  const handleTokenPurchase = (tokenAmount) => {
    setIsAddingTokens(true)
    setTimeout(() => {
      setCurrentTokens((prev) => prev + tokenAmount)
      setIsAddingTokens(false)
    }, 1500)
  }

  return (
    <>
      {getHeaderByRole(role)}
      <div className="tokens-page">
        <div className="container-fluid">
          <div className="row min-vh-100">
            <div className="col-lg-6 col-md-12 info-section">
              <TokenInfo currentTokens={currentTokens} isAddingTokens={isAddingTokens} />
            </div>
            <div className="col-lg-6 col-md-12 purchase-section">
              <TokenPurchase onPurchase={handleTokenPurchase} />
            </div>
          </div>
        </div>
      </div>
      {<Footer />}
    </>
  )
}

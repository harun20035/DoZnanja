"use client"
import { useRouter } from 'next/navigation';
import { getRoleFromToken, getUserDataFromToken } from '@/utils/auth';
import getHeaderByRole from "../../components/layoutComponents";
import Footer from "../../components/footer/Footer";
import { useEffect, useState, useCallback } from "react"
import TokenInfo from "./components/TokenInfo"
import TokenPurchase from "./components/TokenPurchase"
import "./tokens.css"

export default function TokensPage() {
  const [currentTokens, setCurrentTokens] = useState(0)
  const [isAddingTokens, setIsAddingTokens] = useState(false)
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Memoizirana funkcija za dobijanje korisničkih podataka
  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const data = await response.json();

      const user = getUserDataFromToken();
      console.log("User data from token:", getUserDataFromToken());

      // OVJERENJE: POSTAVI userId NA sub iz tokena, a ne na id
      setUserId(user?.sub || null);  // <- Ovdje je ključna promjena
      setCurrentTokens(data.credits);
    } catch (error) {
      console.error("Greška pri dohvaćanju korisničkih podataka:", error)
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const role = getRoleFromToken();
        setRole(role);
        const user = getUserDataFromToken();

        // Ako user nema username, stavi prazan string
        setUsername(user?.username || '');

        if (!role) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Authorization error:", error);
        router.push("/login");
      }
    };

    checkAuthorization();
  }, [router]);

  const handleTokenPurchase = async (tokenAmount) => {
    setIsAddingTokens(true);
    try {
      // Koristimo userId iz stanja koji je već postavljen
      if (!userId) {
        throw new Error("Korisnik nije autentificiran");
      }

      const response = await fetch("http://localhost:8000/tokens/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          user_id: userId, // Koristimo userId iz stanja
          amount: tokenAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Kupovina tokena nije uspjela");
      }

      const data = await response.json();
      setCurrentTokens(data.new_balance);

      // Osvježite podatke nakon uspješne kupovine
      await fetchUserData();
    } catch (error) {
      console.error("Greška pri kupovini:", error.message);
      // Ovdje možete dodati prikaz greške korisniku
    } finally {
      setIsAddingTokens(false);
    }
  };

  if (!role) {
    return <div>Loading...</div>;
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

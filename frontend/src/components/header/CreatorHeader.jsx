import styles from './Header.module.css';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatorHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserDataAndCart = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const resUser = await fetch("http://localhost:8000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataUser = await resUser.json();
        setUser({ name: dataUser.username, coins: dataUser.credits });

        const resCart = await fetch("http://localhost:8000/user/cart-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resCart.ok) {
          const count = await resCart.json();
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (err) {
        console.error("Greška:", err);
      }
    };

    fetchUserDataAndCart();
  }, []);

  const renderLinks = () => (
    <>
      <Link href="/all-courses" className={styles.link}>Kursevi</Link>
      <Link href="/chat" className={styles.link}>Chat</Link>
      <Link href="/creator" className={styles.link}>Creator Dashboard</Link>
    </>
  );

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerRow}`}>
        <div className={styles.brand}>
          <span className="fs-3 me-2">📚</span>
          <span className="fw-bold">DoZnanja</span>
        </div>

        <nav className={styles.nav}>
          {renderLinks()}
        </nav>

        <div className={styles.profileWrap} ref={dropdownRef}>
          <div className={styles.userInfo}>
            {user && (
              <>
                <div className="fw-semibold">@{user.name}</div>
                <div className="text-muted small">💰 {user.coins} Token/a</div>
              </>
            )}
          </div>
          <div className={styles.avatar} onClick={toggleDropdown}>👤</div>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <Link href="/user/dashboard/cart" className={styles.dropdownItem}>
                <div className="d-flex align-items-center gap-2">
                  <span className={styles.cartBadge}>{cartCount}</span>
                  <span>🛒 Korpa</span>
                </div>
              </Link>
              <Link href="/profil" className={styles.dropdownItem}>👤Profil</Link>
              <Link href="/tokens" className={styles.dropdownItem}>💰Tokeni</Link>
              <div onClick={handleLogout} className={styles.dropdownItem} role="button">🚪 Odjava</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

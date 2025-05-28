import styles from './Header.module.css';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatorHeader({ role }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
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

  const renderLinks = () => (
    <>
      <Link href="/all-courses" className={styles.link}>Kursevi</Link>
      <Link href="/about" className={styles.link}>O nama</Link>
      <Link href="/contact" className={styles.link}>Kontakt</Link>
      <Link href="/blog" className={styles.link}>Blog</Link>
      <Link href="/categories" className={styles.link}>Kategorije</Link>
      <Link href="/instructors" className={styles.link}>Predavači</Link>
    </>
  );

  return (
    <header className={styles.header}>
      <div className="container d-flex justify-content-between align-items-center py-3">
        {/* Logo */}
        <Link href="/" className={styles.brand}>
          <span className="fs-3 me-2">📚</span>
          <span className="fw-bold">DoZnanja</span>
        </Link>

        {/* Navigacija */}
        <nav className={`d-flex flex-wrap align-items-center gap-4 ${styles.nav}`}>
          {renderLinks()}
        </nav>

        {/* Avatar i dropdown */}
        <div className="position-relative" ref={dropdownRef}>
          <div className={styles.avatar} onClick={toggleDropdown}>👤</div>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <Link href="/notifications" className={styles.dropdownItem}>🔔 Notifikacije</Link>
              <Link href="/cart" className={styles.dropdownItem}>🛒 Korpa</Link>
              <Link href="/profile" className={styles.dropdownItem}>👤Profil</Link>
              <Link href="/coins" className={styles.dropdownItem}>💰Tokeni</Link>
              <div onClick={handleLogout} className={styles.dropdownItem} role="button">🚪 Odjava</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

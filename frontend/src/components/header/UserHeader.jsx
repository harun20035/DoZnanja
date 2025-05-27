import styles from './Header.module.css';
import Link from 'next/link';
import { useState } from 'react';

export default function UserHeader({ role }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const renderLinks = () => {
  return (
    <>
      <Link href="/courses" className={styles.link}>Kursevi</Link>
      <Link href="/about" className={styles.link}>O nama</Link>
      <Link href="/contact" className={styles.link}>Kontakt</Link>
      <Link href="/blog" className={styles.link}>Blog</Link>
      <Link href="/categories" className={styles.link}>Kategorije</Link>
      <Link href="/instructors" className={styles.link}>Predavači</Link>
    </>
  );
};

  const renderAuth = () => {
    if (role === 'user' || role === 'creator') {
      return (
        <div className={styles.avatarContainer} onClick={toggleDropdown}>
          <div className={styles.avatar}>👤</div>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <Link href="/profile" className={styles.dropdownItem}>Moj profil</Link>
              <Link href="/logout" className={styles.dropdownItem}>Odjava</Link>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <>
        </>
      );
    }
  };

  return (
    <header className={styles.header}>
      <div className="container d-flex justify-content-between align-items-center py-3">
        {/* Logo */}
        <Link href="/" className={styles.brand}>
          <span className="fs-3 me-2">📚</span>
          <span className="fw-bold">DoZnanja</span>
        </Link>

        {/* Navigacija */}
        <nav className={`d-flex flex-wrapalign-items-center gap-4 ${styles.nav}`}>
          {renderLinks()}
        </nav>

        {/* Autentikacija */}
        <div className={`d-flex align-items-center gap-3 ${styles.auth}`}>
          {renderAuth()}
        </div>
      </div>
    </header>
  );
}
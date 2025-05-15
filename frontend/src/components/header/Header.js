import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={`${styles.header}`}>
      <div className="container">
        <nav className="navbar navbar-expand-lg py-3">
          <div className="container-fluid px-0">
            <Link href="/" className={`navbar-brand d-flex align-items-center ${styles.brand}`}>
              <span className="fs-3 me-2">📚</span>
              <span className="fw-bold">DoZnanja</span>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarContent">
              <form className="d-none d-md-flex mx-auto position-relative">
                <span className={`position-absolute top-50 start-0 translate-middle-y ms-3 ${styles.searchIcon}`}>🔍</span>
                <input
                  type="search"
                  className={`form-control ps-5 ${styles.searchInput}`}
                  placeholder="Pretraži kurseve..."
                />
              </form>

              <div className={`mx-auto d-none d-lg-flex ${styles.navLinks}`}>
                <Link href="/link1" className={styles.linkText}>Link 1</Link>
                <Link href="/link2" className={styles.linkText}>Link 2</Link>
                <Link href="/link3" className={styles.linkText}>Link 3</Link>
                <Link href="/link4" className={styles.linkText}>Link 4</Link>
              </div>

              <div className={`ms-auto d-flex align-items-center gap-3 ${styles.authLinks}`}>
                <Link href="/login" className={styles.linkText}>Prijava</Link>
                <Link href="/register" className={styles.linkText}>Registracija</Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

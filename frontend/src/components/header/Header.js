import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={`sticky-top border-bottom bg-white ${styles.header}`}>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light py-3">
          <div className="container-fluid px-0">
            <Link href="/" className="navbar-brand d-flex align-items-center">
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
                <span className="position-absolute top-50 start-0 translate-middle-y ms-3">🔍</span>
                <input
                  type="search"
                  className="form-control ps-5"
                  placeholder="Pretraži kurseve..."
                  style={{ width: '350px' }}
                />
              </form>

              <div className="ms-auto d-flex align-items-center gap-3">
                <Link href="/login" className="text-decoration-none text-secondary fw-medium">
                  Prijava
                </Link>
                <Link href="/signup" className="btn btn-primary d-flex align-items-center">
                  <span className="me-2">➡️</span>
                  Registracija
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

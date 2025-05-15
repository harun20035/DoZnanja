import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={`border-top bg-white py-5 ${styles.footer}`}>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <div className="d-flex align-items-center mb-3">
              <span className="fs-4 me-2">📚</span>
              <span className="fs-5 fw-bold">DoZnanja</span>
            </div>
            <p className="text-secondary small">
              Platforma za online učenje koja povezuje studente sa kvalitetnim kursevima.
            </p>
          </div>

          <div className="col-6 col-lg-3 mb-4 mb-lg-0">
            <h5 className="fs-6 fw-medium mb-3">Linkovi</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link href="/about" className="nav-link p-0 text-secondary">O nama</Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="/courses" className="nav-link p-0 text-secondary">Kursevi</Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="/instructors" className="nav-link p-0 text-secondary">Predavači</Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="/blog" className="nav-link p-0 text-secondary">Blog</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-lg-3 mb-4 mb-lg-0">
            <h5 className="fs-6 fw-medium mb-3">Podrška</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link href="/help" className="nav-link p-0 text-secondary">Pomoć</Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="/faq" className="nav-link p-0 text-secondary">Česta pitanja</Link>
              </li>
              <li className="nav-item mb-2">
                <Link href="/contact" className="nav-link p-0 text-secondary">Kontakt</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-6 col-lg-3">
            <h5 className="fs-6 fw-medium mb-3">Pretplati se</h5>
            <p className="text-secondary small mb-3">Budite u toku sa najnovijim kursevima i popustima.</p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email adresa"
                aria-label="Email adresa"
              />
              <button className="btn btn-primary" type="button">Prijavi se</button>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center pt-4 mt-4 border-top text-secondary small">
          &copy; {new Date().getFullYear()} DoZnanja. Sva prava zadržana.
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link"
import "./ApplicationStatus.css"

export default function ApplicationStatus({ status }) {
  if (!status?.has_application) {
    return null
  }

  return (
    <div className="application-status alert alert-success">
      <div className="status-header">
        <i className="bi bi-check-circle me-2"></i>
        <h5 className="mb-0">🎉 Čestitamo! Vi ste kreator sadržaja!</h5>
      </div>

      <div className="status-details mt-3">
        <p>
          <strong>Postali ste kreator:</strong> {new Date(status.created_at).toLocaleDateString("bs-BA")}
        </p>

        <p className="mb-0">
          <i className="bi bi-star me-1"></i>
          Sada možete kreirati i prodavati svoje kurseve na platformi!
        </p>

        <div className="mt-3">
          <Link href="/creator" className="btn btn-success me-2">
            <i className="bi bi-speedometer2 me-1"></i>
            Creator Dashboard
          </Link>
          <Link href="/creator/courses" className="btn btn-outline-success">
            <i className="bi bi-collection me-1"></i>
            Moji kursevi
          </Link>
        </div>
      </div>
    </div>
  )
}

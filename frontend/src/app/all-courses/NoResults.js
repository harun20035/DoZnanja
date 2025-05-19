export default function NoResults() {
  return (
    <div className="text-center py-5 search-no-results">
      <i className="bi bi-search display-1 text-muted"></i>
      <h3 className="mt-3">Nema rezultata za vašu pretragu</h3>
      <p className="text-muted">Pokušajte sa drugačijim ključnim riječima ili filterima</p>
    </div>
  )
}

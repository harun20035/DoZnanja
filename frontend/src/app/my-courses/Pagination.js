"use client"

export default function Pagination({ currentPage, totalPages, paginate }) {
  return (
    <>
      {totalPages > 1 && (
        <nav className="mt-5">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Prethodna
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => {
              // Prikaži samo određeni broj stranica
              if (index === 0 || index === totalPages - 1 || (index >= currentPage - 2 && index <= currentPage + 2)) {
                return (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                    <button
                      className={`page-link ${currentPage === index + 1 ? "bg-purple border-purple" : ""}`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                )
              } else if (
                (index === currentPage - 3 && currentPage > 3) ||
                (index === currentPage + 3 && currentPage < totalPages - 3)
              ) {
                return (
                  <li key={index} className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )
              }
              return null
            })}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sljedeća
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  )
}

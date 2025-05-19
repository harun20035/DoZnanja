"use client"

export default function SearchAndSort({ searchTerm, setSearchTerm, sortBy, setSortBy, sortOptions }) {
  return (
    <div className="row mb-4">
      <div className="col-md-6 mb-3 mb-md-0">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Pretraži moje kurseve..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-purple" type="button">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>
      <div className="col-md-6">
        <div className="d-flex justify-content-md-end">
          <select
            className="form-select me-2"
            style={{ maxWidth: "200px" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

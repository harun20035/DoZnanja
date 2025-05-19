"use client"

export default function StatusFilter({ statuses, selectedStatus, setSelectedStatus }) {
  return (
    <div className="mb-4">
      <div className="d-flex flex-wrap gap-2">
        {statuses.map((status, index) => (
          <button
            key={index}
            className={`btn ${selectedStatus === status ? "btn-purple" : "btn-outline-purple"} me-2`}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  )
}

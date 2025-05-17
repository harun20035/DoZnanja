"use client"

export default function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="mb-4 categories-scroll">
      <div className="d-flex flex-nowrap overflow-auto pb-2">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`btn ${selectedCategory === category ? "btn-purple" : "btn-outline-purple"} me-2 flex-shrink-0`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

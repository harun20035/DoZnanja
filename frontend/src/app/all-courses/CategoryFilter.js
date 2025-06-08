"use client"

export default function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  const categoryTranslations = {
    "Programming": "Programiranje",
    "Design": "Dizajn",
    "Marketing": "Marketing",
    "Business": "Biznis",
    "Photography": "Fotografija"
  };

  return (
    <div className="mb-4 categories-scroll">
      <div className="d-flex flex-nowrap overflow-auto pb-2">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`btn ${selectedCategory === category ? "btn-purple" : "btn-outline-purple"} me-2 flex-shrink-0`}
            onClick={() => setSelectedCategory(category)}
          >
            {categoryTranslations[category] || category} {/* Prikazujemo prevedenu kategoriju */}
          </button>
        ))}
      </div>
    </div>
  )
}

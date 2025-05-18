import Image from "next/image";
import Link from "next/link";

export default function CourseCard({ course }) {
  // Izračunaj cijenu s popustom
  const discountedPrice = course.discount_percent > 0 
    ? course.price * (1 - course.discount_percent / 100)
    : course.price;

  // Formatiraj datum kreiranja
  const formattedDate = new Date(course.created_at).toLocaleDateString();

  return (
    <div className="card course-card h-100 shadow-sm">
      <div className="card-img-top" style={{ height: "160px", overflow: "hidden" }}>
        <Image
          src={course.image_thumbnail}
          width={300}
          height={160}
          alt={course.title}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{course.title}</h5>
        <p className="card-text text-muted mb-1">{course.description.substring(0, 60)}...</p>
        
        <div className="d-flex align-items-center mt-2">
          <div className="me-2">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bi ${
                  i < Math.floor(course.average_rating) 
                    ? "bi-star-fill" 
                    : i < course.average_rating 
                      ? "bi-star-half" 
                      : "bi-star"
                } text-warning`}
              ></i>
            ))}
          </div>
          <small className="text-muted">
            {course.average_rating.toFixed(1)} (ocjena)
          </small>
        </div>
        
        <div className="mt-2">
          <span className="badge bg-primary text-white me-1 mb-1">
            {course.category}
          </span>
          <span className="badge bg-secondary text-white me-1 mb-1">
            {formattedDate}
          </span>
          {course.discount_percent > 0 && (
            <span className="badge bg-danger text-white me-1 mb-1">
              -{course.discount_percent}%
            </span>
          )}
        </div>
        
        <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
          <div>
            {course.discount_percent > 0 ? (
              <>
                <span className="text-decoration-line-through text-muted me-2">
                  {course.price.toFixed(2)} KM
                </span>
                <span className="fw-bold text-danger">
                  {discountedPrice.toFixed(2)} KM
                </span>
              </>
            ) : (
              <span className="fw-bold">{course.price.toFixed(2)} KM</span>
            )}
          </div>
          <Link href={`/courses/${course.id}`} className="btn btn-outline-primary">
            Detalji
          </Link>
        </div>
      </div>
    </div>
  );
}
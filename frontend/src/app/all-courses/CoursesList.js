"use client"

import CourseCard from "./CourseCard";

export default function CoursesList({ courses, loading, error }) {
  if (loading) return <div className="text-center my-5 py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <p className="text-center my-5 text-danger">Došlo je do greške: {error}</p>;
  if (courses.length === 0) return <p className="text-center my-5">Nema dostupnih kurseva.</p>;

  return (
    <div className="container my-5">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {courses.map((course) => (
          <div className="col" key={course.id}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
}
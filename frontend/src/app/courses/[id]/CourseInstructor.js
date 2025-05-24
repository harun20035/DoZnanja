import Image from "next/image"

export default function CourseInstructor({ course }) {
  // Use instructor data from course if available, otherwise use mock data
  const instructorName = course.instructor_name || "Prof. Marko Marković"
  const instructorTitle = course.instructor_title || "Profesor računarskih nauka"
  const instructorBio =
    course.instructor_bio ||
    "Iskusni predavač s više od 10 godina iskustva u podučavanju programiranja i računarskih nauka. Diplomirao je na Elektrotehničkom fakultetu i magistrirao računarske nauke. Specijaliziran je za web razvoj, baze podataka i softverski inženjering."
  const instructorImage = course.instructor_image || "/placeholder.svg?height=80&width=80"

  return (
    <div className="course-instructor-section">
      <div className="course-section">
        <h3 className="course-section-title">O instruktoru</h3>

        <div className="course-instructor">
          <div className="course-instructor-avatar">
            <Image src={instructorImage || "/placeholder.svg"} alt={instructorName} width={80} height={80} />
          </div>
          <div className="course-instructor-info">
            <h4>{instructorName}</h4>
            <p className="text-muted">{instructorTitle}</p>
          </div>
        </div>

        <p>{instructorBio}</p>

        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card bg-light-purple border-0 mb-3">
              <div className="card-body">
                <h5 className="text-purple">
                  <i className="bi bi-mortarboard me-2"></i>
                  Obrazovanje
                </h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-purple me-2"></i>
                    Magistar računarskih nauka
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-purple me-2"></i>
                    Diplomirani inženjer elektrotehnike
                  </li>
                  <li>
                    <i className="bi bi-check-circle text-purple me-2"></i>
                    Certifikovani web developer
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-light-purple border-0">
              <div className="card-body">
                <h5 className="text-purple">
                  <i className="bi bi-briefcase me-2"></i>
                  Iskustvo
                </h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-purple me-2"></i>
                    10+ godina predavačkog iskustva
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-purple me-2"></i>
                    15+ godina rada u industriji
                  </li>
                  <li>
                    <i className="bi bi-check-circle text-purple me-2"></i>
                    Autor 5 knjiga o programiranju
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CourseDescription({ course }) {
  return (
    <div className="course-description">
      <div className="course-section">
        <h3 className="course-section-title">Opis kursa</h3>
        <p>{course.description}</p>
      </div>

      <div className="course-section">
        <h3 className="course-section-title">Šta ćete naučiti</h3>
        <div className="row">
          <div className="col-md-6">
            <ul className="course-list">
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Osnove programiranja u odabranom jeziku</span>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Rad sa bazama podataka</span>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Kreiranje web aplikacija</span>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Implementacija sigurnosnih mehanizama</span>
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <ul className="course-list">
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Optimizacija performansi</span>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Testiranje i debugging</span>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Deployment aplikacija</span>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Najbolje prakse u industriji</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="course-section">
        <h3 className="course-section-title">Preduslovi</h3>
        <ul className="course-list">
          <li>
            <i className="bi bi-arrow-right-circle-fill"></i>
            <span>Osnovno poznavanje rada na računaru</span>
          </li>
          <li>
            <i className="bi bi-arrow-right-circle-fill"></i>
            <span>Osnovno razumijevanje programskih koncepata</span>
          </li>
          <li>
            <i className="bi bi-arrow-right-circle-fill"></i>
            <span>Želja za učenjem i napredovanjem</span>
          </li>
        </ul>
      </div>

      <div className="course-section">
        <h3 className="course-section-title">Za koga je ovaj kurs</h3>
        <ul className="course-list">
          <li>
            <i className="bi bi-person-fill"></i>
            <span>Početnici koji žele naučiti programiranje</span>
          </li>
          <li>
            <i className="bi bi-person-fill"></i>
            <span>Studenti informatičkih smjerova</span>
          </li>
          <li>
            <i className="bi bi-person-fill"></i>
            <span>Profesionalci koji žele proširiti znanje</span>
          </li>
          <li>
            <i className="bi bi-person-fill"></i>
            <span>Entuzijasti koji žele razviti vlastite projekte</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

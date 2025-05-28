import React from "react";

export default function CourseDescription({ course }) {
  return (
    <div className="course-description bg-white p-4 rounded shadow-sm">
      {/* Opis kursa */}
      <Section title="Opis kursa">
        <p className="text-muted">{course.description}</p>
      </Section>

      {/* Šta ćete naučiti */}
      <Section title="Šta ćete naučiti">
        <div className="row">
          <div className="col-md-6">
            <CourseList items={[
              "Osnove programiranja u odabranom jeziku",
              "Rad sa bazama podataka",
              "Kreiranje web aplikacija",
              "Implementacija sigurnosnih mehanizama"
            ]} />
          </div>
          <div className="col-md-6">
            <CourseList items={[
              "Optimizacija performansi",
              "Testiranje i debugging",
              "Deployment aplikacija",
              "Najbolje prakse u industriji"
            ]} />
          </div>
        </div>
      </Section>

      {/* Preduslovi */}
      <Section title="Preduslovi">
        <CourseList 
          items={[
            "Osnovno poznavanje rada na računaru",
            "Osnovno razumijevanje programskih koncepata",
            "Želja za učenjem i napredovanjem"
          ]} 
          icon="bi-arrow-right-circle-fill"
        />
      </Section>

      {/* Za koga je kurs */}
      <Section title="Za koga je ovaj kurs">
        <CourseList 
          items={[
            "Početnici koji žele naučiti programiranje",
            "Studenti informatičkih smjerova",
            "Profesionalci koji žele proširiti znanje",
            "Entuzijasti koji žele razviti vlastite projekte"
          ]} 
          icon="bi-person-fill"
        />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="course-section mb-4">
      <h3 className="course-section-title text-purple mb-3">{title}</h3>
      {children}
    </div>
  );
}

function CourseList({ items, icon = "bi-check-circle-fill" }) {
  return (
    <ul className="list-unstyled course-list">
      {items.map((item, index) => (
        <li key={index} className="d-flex align-items-start mb-2">
          <i className={`bi ${icon} text-purple me-2 mt-1`}></i>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

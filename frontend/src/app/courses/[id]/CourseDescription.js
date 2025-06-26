import React from "react";

export default function CourseDescription({ course }) {
  return (
    <div className="course-description bg-white p-4 rounded shadow-sm">
      {/* Opis kursa */}
      <Section title="Opis kursa">
        <p className="text-muted">{course.description}</p>
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

"use client"

import Link from "next/link"
import Image from "next/image"
import "./styles.css"
import Header from "../components/header/Header"
import Footer from "../components/footer/Footer"


export default function HomePage() {
  // Nema potrebe za useEffect za učitavanje Bootstrap-a jer je već učitan preko CDN-a u layout.jsx

  return (
    <div className="d-flex flex-column min-vh-100">


     <Header role="guest" />

      <main className="flex-grow-1">
        {/* Hero Section */}
        <section className="bg-light py-5">
          <div className="container py-4">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="mb-4">
                  <h1 className="display-4 fw-bold mb-3">Uči bilo gde, bilo kada</h1>
                  <p className="lead text-secondary mb-4">
                    Pristup hiljadama kurseva iz različitih oblasti. Unapredi svoje veštine i karijeru već danas.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <a href="#" className="btn btn-primary btn-lg">
                      Započni učenje
                    </a>
                    <a href="#" className="btn btn-outline-secondary btn-lg">
                      Istraži kurseve
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="text-center">
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-5">
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <div className="mb-3 mb-md-0">
                <h2 className="fw-bold">Popularne kategorije</h2>
                <p className="text-secondary">Istraži najpopularnije oblasti učenja</p>
              </div>
              <Link href="/categories" className="text-decoration-none text-primary d-flex align-items-center">
                <span className="fw-medium">Sve kategorije</span>
                <span className="ms-1">▶️</span>
              </Link>
            </div>

            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
              {categories.map((category) => (
                <div key={category.name} className="col">
                  <Link href={`/category/${category.slug}`} className="text-decoration-none">
                    <div className="card h-100 text-center border-light hover-card">
                      <div className="card-body">
                        <div className="category-icon bg-primary-subtle text-primary rounded-circle mx-auto mb-3">
                          <span className="fs-4">{category.emoji}</span>
                        </div>
                        <h5 className="card-title fs-6 fw-medium">{category.name}</h5>
                        <p className="card-text small text-secondary">{category.count} kurseva</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-5">
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <div className="mb-3 mb-md-0">
                <h2 className="fw-bold mb-2">Istaknuti kursevi</h2>
                <p className="text-secondary">Najpopularniji kursevi ove nedelje</p>
              </div>
              <Link href="/courses" className="text-decoration-none text-primary d-flex align-items-center">
                <span className="text-primary">Svi kursevi</span>
                <span className="ms-1">▶️</span>
              </Link>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {courses.map((course) => (
                <div key={course.id} className="col">
                  <div className="card h-100 border-light shadow-sm hover-card">
                    <div className="course-image-container">
                      
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-light text-dark">{course.category}</span>
                        <small className="text-secondary d-flex align-items-center">
                          <span className="me-1">👥</span>
                          {course.students}
                        </small>
                      </div>
                      <h5 className="card-title text-truncate">{course.title}</h5>
                      <p className="card-text text-secondary small course-description">{course.description}</p>
                    </div>
                    <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        
                        <small className="fw-medium">{course.instructor}</small>
                      </div>
                      <span className="fw-bold">{course.price} €</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-5 bg-light">
          <div className="container py-3">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 text-center">
              {stats.map((stat) => (
                <div key={stat.label} className="col">
                  <div className="py-3">
                    <div className="display-5 fw-bold mb-1">{stat.value}</div>
                    <div className="text-secondary">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-5">Šta kažu naši polaznici</h2>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="col">
                  <div className="card h-100 border-light shadow-sm">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        
                        <div>
                          <h5 className="card-title mb-0">{testimonial.name}</h5>
                          <p className="card-subtitle text-secondary small">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="card-text text-secondary">{testimonial.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5 bg-purple text-white">
          <div className="container py-3 text-center">
            <h3  className="fw-bold mb-3">Spremni da započnete svoje putovanje učenja?</h3>
            <p className="mx-auto mb-4" style={{ maxWidth: "600px" }}>
              Pridružite se hiljadama polaznika koji svakodnevno unapređuju svoje veštine na DoZnanja platformi.
            </p>
            <a href="/register" className="btn btn-light btn-lg px-4 fw-medium text-purple">
              Registruj se besplatno
            </a>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  )
}

// Sample data
const categories = [
  { name: "Programiranje", slug: "programming", count: 328, emoji: "💻" },
  { name: "Dizajn", slug: "design", count: 245, emoji: "🎨" },
  { name: "Marketing", slug: "marketing", count: 189, emoji: "📊" },
  { name: "Biznis", slug: "business", count: 217, emoji: "💼" },
  { name: "Fotografija", slug: "photography", count: 152, emoji: "📷" },
]

// Ažurirani podaci sa stvarnim URL-ovima slika
const courses = [
  {
    id: 1,
    title: "Uvod u programiranje sa JavaScript-om",
    description: "Naučite osnove programiranja kroz JavaScript, najpopularniji programski jezik na webu.",
    image: "https://via.placeholder.com/600x400?text=JavaScript+Kurs",
    category: "Programiranje",
    instructor: "Marko Marković",
    instructorImage: "https://via.placeholder.com/100?text=MM",
    price: "49.99",
    students: "1,245",
  },
  {
    id: 2,
    title: "Web dizajn za početnike",
    description: "Savladajte osnove web dizajna i naučite kako da kreirate moderne i responzivne sajtove.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Dizajn",
    instructor: "Ana Anić",
    instructorImage: "/placeholder.svg?height=100&width=100",
    price: "39.99",
    students: "987",
  },
  {
    id: 3,
    title: "Digitalni marketing od A do Ž",
    description: "Sveobuhvatni kurs koji pokriva sve aspekte digitalnog marketinga, od SEO do društvenih mreža.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Marketing",
    instructor: "Petar Petrović",
    instructorImage: "/placeholder.svg?height=100&width=100",
    price: "59.99",
    students: "1,876",
  },
  {
    id: 4,
    title: "Osnove fotografije",
    description: "Naučite kako da koristite svoj DSLR fotoaparat i snimate profesionalne fotografije.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Fotografija",
    instructor: "Jovana Jovanović",
    instructorImage: "/placeholder.svg?height=100&width=100",
    price: "44.99",
    students: "756",
  },
]

const stats = [
  { label: "Aktivnih kurseva", value: "1,000+" },
  { label: "Stručnih predavača", value: "200+" },
  { label: "Zadovoljnih polaznika", value: "50,000+" },
  { label: "Zemalja", value: "150+" },
]

const testimonials = [
  {
    name: "Nikola Nikolić",
    role: "Student informatike",
    avatar: "https://via.placeholder.com/100?text=NN",
    content: "DoZnanja mi je pomogla da naučim programiranje od nule. Sada radim kao junior developer u IT kompaniji.",
  },
  {
    name: "Milica Milić",
    role: "Grafički dizajner",
    avatar: "/placeholder.svg?height=100&width=100",
    content: "Kursevi su odlično strukturirani i predavači su stvarno stručni. Preporučujem svima!",
  },
  {
    name: "Stefan Stefanović",
    role: "Marketing menadžer",
    avatar: "/placeholder.svg?height=100&width=100",
    content: "Zahvaljujući DoZnanja kursevima, unapredio sam svoje veštine digitalnog marketinga i dobio unapređenje.",
  },
]
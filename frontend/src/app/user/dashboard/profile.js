"use client"

import { useState } from "react"
import Image from "next/image"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("info")

  const userInfo = {
    name: "Korisnik Korisniković",
    email: "korisnik@example.com",
    phone: "+387 61 123 456",
    address: "Zmaja od Bosne bb, Sarajevo",
    bio: "Student računarskih nauka sa interesom za web razvoj i mobilne aplikacije.",
    avatar: "/placeholder.svg?height=150&width=150",
    credits: 120,
    completedCourses: 5,
    activeCourses: 4,
    certificates: 3,
    joinDate: "01.01.2023.",
  }

  const certificates = [
    {
      id: 1,
      title: "Web Programiranje",
      issueDate: "15.03.2023.",
      instructor: "Prof. Marko Marković",
    },
    {
      id: 2,
      title: "Osnove JavaScript-a",
      issueDate: "20.04.2023.",
      instructor: "Dr. Ana Anić",
    },
    {
      id: 3,
      title: "HTML i CSS Osnove",
      issueDate: "10.02.2023.",
      instructor: "Emir Emirović",
    },
  ]

  const transactions = [
    {
      id: 1,
      type: "purchase",
      amount: 100,
      date: "05.05.2023.",
      description: "Kupovina kredita",
    },
    {
      id: 2,
      type: "course",
      amount: -60,
      date: "06.05.2023.",
      description: "Kurs: Web Programiranje",
    },
    {
      id: 3,
      type: "course",
      amount: -45,
      date: "10.05.2023.",
      description: "Kurs: Osnove JavaScript-a",
    },
    {
      id: 4,
      type: "purchase",
      amount: 150,
      date: "15.05.2023.",
      description: "Kupovina kredita",
    },
    {
      id: 5,
      type: "course",
      amount: -70,
      date: "16.05.2023.",
      description: "Kurs: React za početnike",
    },
  ]

  return (
    <div className="row">
      <div className="col-md-4 col-lg-3 mb-4 mb-md-0">
        <div className="card">
          <div className="card-body text-center p-3">
            <div className="mb-3">
              <Image
                src={userInfo.avatar || "/placeholder.svg"}
                width={150}
                height={150}
                className="avatar-lg rounded-circle img-thumbnail"
                alt="Profile"
              />
            </div>
            <h5 className="mb-1">{userInfo.name}</h5>
            <p className="text-muted mb-3">{userInfo.email}</p>
            <div className="d-flex justify-content-center mb-3">
              <div className="px-3 text-center border-end">
                <h6 className="mb-0">{userInfo.completedCourses}</h6>
                <small className="text-muted">Završeni kursevi</small>
              </div>
              <div className="px-3 text-center border-end">
                <h6 className="mb-0">{userInfo.activeCourses}</h6>
                <small className="text-muted">Aktivni kursevi</small>
              </div>
              <div className="px-3 text-center">
                <h6 className="mb-0">{userInfo.certificates}</h6>
                <small className="text-muted">Certifikati</small>
              </div>
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-purple">
                <i className="bi bi-coin me-2"></i>
                Kupi kredite
              </button>
              <button className="btn btn-outline-purple">
                <i className="bi bi-pencil me-2"></i>
                Uredi profil
              </button>
            </div>
          </div>
          <div className="card-footer bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <span>Krediti</span>
              <span className="fw-bold">{userInfo.credits}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span>Član od</span>
              <span>{userInfo.joinDate}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-8 col-lg-9">
        <div className="card">
          <div className="card-header bg-white p-0">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === "info" ? "active text-purple" : ""}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab("info")
                  }}
                >
                  Lični podaci
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === "certificates" ? "active text-purple" : ""}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab("certificates")
                  }}
                >
                  Certifikati
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeTab === "transactions" ? "active text-purple" : ""}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab("transactions")
                  }}
                >
                  Transakcije
                </a>
              </li>
            </ul>
          </div>
          <div className="card-body">
            {activeTab === "info" && (
              <div>
                <h5 className="card-title mb-4">Lični podaci</h5>
                <form>
                  <div className="row mb-3 g-3">
                    <div className="col-md-6">
                      <label htmlFor="fullName" className="form-label">
                        Ime i prezime
                      </label>
                      <input type="text" className="form-control" id="fullName" defaultValue={userInfo.name} />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Email adresa
                      </label>
                      <input type="email" className="form-control" id="email" defaultValue={userInfo.email} />
                    </div>
                  </div>
                  <div className="row mb-3 g-3">
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">
                        Telefon
                      </label>
                      <input type="tel" className="form-control" id="phone" defaultValue={userInfo.phone} />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="address" className="form-label">
                        Adresa
                      </label>
                      <input type="text" className="form-control" id="address" defaultValue={userInfo.address} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">
                      Biografija
                    </label>
                    <textarea className="form-control" id="bio" rows="3" defaultValue={userInfo.bio}></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="avatar" className="form-label">
                      Profilna slika
                    </label>
                    <input type="file" className="form-control" id="avatar" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Trenutna lozinka
                    </label>
                    <input type="password" className="form-control" id="currentPassword" />
                  </div>
                  <div className="row mb-3 g-3">
                    <div className="col-md-6">
                      <label htmlFor="newPassword" className="form-label">
                        Nova lozinka
                      </label>
                      <input type="password" className="form-control" id="newPassword" />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="confirmPassword" className="form-label">
                        Potvrdi novu lozinku
                      </label>
                      <input type="password" className="form-control" id="confirmPassword" />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-outline-secondary me-2">
                      Odustani
                    </button>
                    <button type="submit" className="btn btn-purple">
                      Sačuvaj promjene
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "certificates" && (
              <div>
                <h5 className="card-title mb-4">Moji certifikati</h5>
                <div className="table-responsive" style={{ overflowX: "auto" }}>
                  <table className="table table-hover table-sm">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Naziv kursa</th>
                        <th scope="col">Datum izdavanja</th>
                        <th scope="col">Predavač</th>
                        <th scope="col">Akcije</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert, index) => (
                        <tr key={cert.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{cert.title}</td>
                          <td>{cert.issueDate}</td>
                          <td>{cert.instructor}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-purple me-1">
                              <i className="bi bi-download"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-purple">
                              <i className="bi bi-share"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div>
                <h5 className="card-title mb-4">Historija transakcija</h5>
                <div className="table-responsive" style={{ overflowX: "auto" }}>
                  <table className="table table-hover table-sm">
                    <thead>
                      <tr>
                        <th scope="col">Datum</th>
                        <th scope="col">Opis</th>
                        <th scope="col">Iznos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>{transaction.date}</td>
                          <td>{transaction.description}</td>
                          <td className={transaction.amount > 0 ? "text-success" : "text-danger"}>
                            {transaction.amount > 0 ? "+" : ""}
                            {transaction.amount} kredita
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

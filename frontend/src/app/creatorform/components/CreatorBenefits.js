import "./CreatorBenefits.css"

export default function CreatorBenefits() {
  const benefits = [
    {
      icon: "💰",
      title: "Zaradite novac",
      description: "Dobijajte tokene za svaki prodani kurs",
    },
    {
      icon: "📈",
      title: "Izgradite reputaciju",
      description: "Postanite prepoznati ekspert u svojoj oblasti",
    },
    {
      icon: "🌍",
      title: "Globalna publika",
      description: "Dosegnite studente iz cijelog svijeta",
    },
    {
      icon: "🎯",
      title: "Fleksibilnost",
      description: "Radite u svoje vrijeme i tempom",
    },
  ]

  return (
    <div className="benefits-section mb-5">
      <h3 className="section-title">
        <i className="bi bi-star-fill me-2"></i>
        Prednosti kreatora
      </h3>
      <div className="row">
        {benefits.map((benefit, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="benefit-item">
              <div className="benefit-icon">{benefit.icon}</div>
              <div>
                <h5>{benefit.title}</h5>
                <p>{benefit.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

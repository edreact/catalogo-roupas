export default function SectionPreview({ title, description, children }) {
  return (
    <section className="section-preview">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{/*Em breve*/}</p>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

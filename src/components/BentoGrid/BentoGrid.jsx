import './BentoGrid.css'

const EXPERIENCE = [
  {
    role: 'Business Analyst Intern, AI & ST — TCS · Summer 2026',
    description: 'Working at the intersection of emerging tech and strategy, still chasing problems that are genuinely hard.',
  },
  {
    role: 'BFSI Data Lab Spring Intern — TCS · 2025',
    description: "Explored data workflows within TCS's Banking, Financial Services & Insurance division.",
  },
  {
    role: 'FinTech Work Experience — HSBC · 2022',
    description: 'Early exposure to banking systems and financial data at HSBC.',
  },
]

const CONTACT_LINKS = [
  { label: 'cv', href: 'https://lavanyakamble.vercel.app/LavanyaKamble-CV.pdf' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/lavanyakamble/' },
  { label: 'github', href: 'https://github.com/lyvnrin' },
  { label: 'credly', href: 'https://www.credly.com/users/lavanya-kamble.73b64a62' },
  { label: 'email', href: 'mailto:lavanya.kamble6@gmail.com' },
]

function BentoGrid({ projects, skills, activeItem, onToggleProject, onToggleSkill }) {
  return (
    <div className="bento-base">
      <div className="bento-col bento-col-left">
        <section className="bento-panel bento-identity">
          <h1 className="bento-name">Lavanya Kamble</h1>
          <p className="bento-subtitle">
            penultimate year cs student @ royal holloway | full-stack developer | summer intern @ TCS, AI & ST
          </p>
        </section>

        <section className="bento-panel bento-experience">
          <h2 className="bento-heading">Experience</h2>
          <div className="bento-experience-list no-scrollbar">
            {EXPERIENCE.map((entry) => (
              <div className="bento-entry" key={entry.role}>
                <p className="bento-entry-role">{entry.role}</p>
                <p className="bento-entry-desc">{entry.description}</p>
              </div>
            ))}
          </div>
          <div className="bento-fade-bottom" aria-hidden="true" />
        </section>
      </div>

      <div className="bento-col bento-col-right">
        <section className="bento-panel bento-projects">
          <h2 className="bento-heading">Projects</h2>
          <span className="bento-scroll-arrow bento-scroll-arrow--left" aria-hidden="true">
            &#8249;
          </span>
          <div className="bento-projects-row no-scrollbar">
            {projects.map((project) => (
              <button
                type="button"
                className={`bento-project-card${activeItem?.type === 'project' && activeItem.id === project ? ' active' : ''}`}
                key={project}
                onClick={() => onToggleProject(project)}
              >
                <div className="bento-project-thumb" />
                <span className="bento-project-label">{project}</span>
              </button>
            ))}
          </div>
          <span className="bento-scroll-arrow bento-scroll-arrow--right" aria-hidden="true">
            &#8250;
          </span>
        </section>

        <section className="bento-panel bento-skills">
          <h2 className="bento-heading">Skills</h2>
          <div className="bento-skills-row">
            {skills.map((skill) => (
              <button
                type="button"
                className={`bento-skill-box${activeItem?.type === 'skill' && activeItem.id === skill ? ' active' : ''}`}
                key={skill}
                onClick={() => onToggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </section>

        <section className="bento-panel bento-contact">
          <nav className="bento-contact-links">
            <span className="bento-heading bento-contact-title">contact</span>
            {CONTACT_LINKS.map(({ label, href }) => {
              const isExternal = !href.startsWith('mailto:')
              return (
                <a
                  href={href}
                  key={label}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  {label}
                </a>
              )
            })}
          </nav>
        </section>
      </div>
    </div>
  )
}

export default BentoGrid

import './BentoGrid.css'

const EXPERIENCE = [
  {
    role: '2026 — BA (Smart Tech) Intern @ TCS',
    description: 'Working on smart technology initiatives across the summer internship program.',
  },
  {
    role: '2025 — Data Science Coursework Project',
    description: 'Built a classification pipeline as part of coursework, from data cleaning to evaluation.',
  },
  {
    role: '2024 — Freelance Web Developer',
    description: 'Delivered small business sites end to end, from design handoff to deployment.',
  },
  {
    role: '2023 — Campus Tech Club Lead',
    description: 'Organized workshops and led a small team of student contributors.',
  },
]

const CONTACT_LINKS = ['cv', 'linkedin', 'github', 'credly', 'email']

function BentoGrid({ projects, skills, activeItem, onToggleProject, onToggleSkill }) {
  return (
    <div className="bento-base">
      <div className="bento-col bento-col-left">
        <section className="bento-panel bento-identity">
          <h1 className="bento-name">Lavanya Kamble</h1>
          <p className="bento-subtitle">
            aspiring data scientist | bsc computer science student | BA summer intern @ TCS
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
            {CONTACT_LINKS.map((link) => (
              <a href="#" key={link}>
                {link}
              </a>
            ))}
          </nav>
        </section>
      </div>
    </div>
  )
}

export default BentoGrid

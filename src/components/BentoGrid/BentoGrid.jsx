import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './BentoGrid.css'

const SKILL_TECH = {
  ai: ['Claude Code', 'OpenAI'],
  data: ['NumPy', 'PostgreSQL', 'MS Excel'],
  design: ['Figma', 'Lovable', 'HTML/CSS'],
  scripting: ['Python', 'JavaScript', 'Java'],
  tools: ['Git', 'Linux/WSL', 'React'],
}

// an onigiri: nori (category name) wraps the box by default, and peels away
// downward on click to reveal the rice (tech list) underneath
function SkillBox({ skill, isUnwrapped, onToggle }) {
  const noriRef = useRef(null)
  const riceRef = useRef(null)
  const wasUnwrapped = useRef(false)

  useLayoutEffect(() => {
    const nori = noriRef.current
    const riceItems = riceRef.current ? Array.from(riceRef.current.children) : []
    if (!nori || riceItems.length === 0) return

    if (isUnwrapped) {
      // nori curls away as it slides, like it's being peeled off
      gsap.to(nori, { yPercent: 100, rotateX: -20, duration: 0.5, ease: 'power1.inOut' })
      // tech names drift up into place one at a time as the nori clears them
      gsap.fromTo(
        riceItems,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.25, delay: 0.15, stagger: 0.06, ease: 'power1.out' },
      )
    } else if (wasUnwrapped.current) {
      // all text fades out together first, then the nori curls back over it
      gsap.to(riceItems, { opacity: 0, duration: 0.15, ease: 'power1.in' })
      gsap.to(nori, { yPercent: 0, rotateX: 0, duration: 0.4, delay: 0.1, ease: 'power1.inOut' })
    }

    wasUnwrapped.current = isUnwrapped
  }, [isUnwrapped])

  return (
    <button type="button" className="bento-skill-box" data-lift-key={`skill:${skill}`} onClick={onToggle}>
      <ul className="bento-skill-rice" ref={riceRef}>
        {SKILL_TECH[skill].map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <div className="bento-skill-nori" ref={noriRef}>
        <span>{skill}</span>
      </div>
    </button>
  )
}

// keep in sync with .bento-entry's compact height in BentoGrid.css
const ENTRY_COMPACT_HEIGHT = 65

// a nigiri: the salmon layer fully covers the rice (the description) by
// default — click folds it back on its bottom hinge to reveal what's underneath
function ExperienceEntry({ entry, isPeeled, onToggle }) {
  const containerRef = useRef(null)
  const salmonRef = useRef(null)
  const riceRef = useRef(null)
  const descRef = useRef(null)
  const wasPeeled = useRef(false)

  useLayoutEffect(() => {
    const container = containerRef.current
    const salmon = salmonRef.current
    const rice = riceRef.current
    const desc = descRef.current
    if (!container || !salmon || !rice || !desc) return

    if (isPeeled) {
      // the rice layer is stretched to the container's current height (absolute,
      // inset 0), so it has no independent natural height to read — measure the
      // description itself instead and add the rice's own padding back in
      const riceStyle = getComputedStyle(rice)
      const padding = parseFloat(riceStyle.paddingTop) + parseFloat(riceStyle.paddingBottom)
      const expandedHeight = desc.scrollHeight + padding

      gsap.to(salmon, { rotateX: -75, duration: 0.5, ease: 'power1.inOut' })
      // both layers are position: absolute, so the container has no in-flow
      // content to size itself against — it has to stay pinned at this measured
      // pixel value ('auto' would collapse it to 0 rather than fit the content
      gsap.to(container, { height: expandedHeight, duration: 0.35, ease: 'power1.out' })
      gsap.to(desc, { opacity: 1, duration: 0.3, delay: 0.2, ease: 'power1.out' })
    } else if (wasPeeled.current) {
      // pin a numeric px height first — gsap can't tween away from 'auto'
      gsap.set(container, { height: container.scrollHeight })
      gsap.to(desc, { opacity: 0, duration: 0.15, ease: 'power1.in' })
      gsap.to(container, { height: ENTRY_COMPACT_HEIGHT, duration: 0.3, ease: 'power1.in' })
      gsap.to(salmon, { rotateX: 0, duration: 0.4, ease: 'power1.inOut' })
    }

    wasPeeled.current = isPeeled
  }, [isPeeled])

  return (
    <button
      type="button"
      className={`bento-entry${isPeeled ? ' peeled' : ''}`}
      ref={containerRef}
      onClick={onToggle}
    >
      <div className="bento-entry-rice" ref={riceRef}>
        <p className="bento-entry-desc" ref={descRef}>
          {entry.description}
        </p>
      </div>
      <div className="bento-entry-salmon" ref={salmonRef}>
        <p className="bento-entry-role">{entry.role}</p>
      </div>
    </button>
  )
}

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

function BentoGrid({
  projects,
  skills,
  liftedItem,
  onToggleProject,
  onToggleSkill,
  peeledExperience,
  onToggleExperience,
}) {
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
              <ExperienceEntry
                key={entry.role}
                entry={entry}
                isPeeled={peeledExperience === entry.role}
                onToggle={() => onToggleExperience(entry.role)}
              />
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
                className={`bento-project-card${liftedItem?.type === 'project' && liftedItem.id === project ? ' active' : ''}`}
                key={project}
                data-lift-key={`project:${project}`}
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
              <SkillBox
                key={skill}
                skill={skill}
                isUnwrapped={liftedItem?.type === 'skill' && liftedItem.id === skill}
                onToggle={() => onToggleSkill(skill)}
              />
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

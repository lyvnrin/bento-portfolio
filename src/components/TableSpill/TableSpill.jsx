import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './TableSpill.css'

function useLastTruthy(value) {
  const [stored, setStored] = useState(value)
  if (value !== null && value !== stored) {
    setStored(value)
    return value
  }
  return value !== null ? value : stored
}

const PROJECT_INFO = {
  oaxaca: {
    name: 'oaxaca',
    description: 'A full-stack restaurant management system, end to end.',
    tech: 'react, fastapi, sqlite',
    link: 'https://github.com/lyvnrin/oaxaca',
  },
  valora: {
    name: 'valora',
    description: 'An AI-powered financial chatbot for economic insight.',
    tech: 'react, python',
    link: 'https://github.com/lyvnrin/Valora',
  },
  'sort it out': {
    name: 'sort it out',
    description: 'An interactive sorting algorithm visualiser.',
    tech: 'react, javascript',
    link: 'https://sorting-visualiser-lk.vercel.app/',
  },
}

const SKILL_POSITIONS = {
  ai: [
    { name: 'Claude Code', right: '6vw', bottom: '18vh', rotate: '2deg' },
    { name: 'GitHub Copilot', right: '15vw', bottom: '10vh', rotate: '-2deg' },
  ],
  data: [
    { name: 'NumPy', right: '6vw', bottom: '20vh', rotate: '-3deg' },
    { name: 'PostgreSQL', right: '16vw', bottom: '10vh', rotate: '2deg' },
    { name: 'MS Excel', right: '10vw', bottom: '26vh', rotate: '-1deg' },
  ],
  design: [
    { name: 'Figma', right: '8vw', bottom: '7vh', rotate: '3deg' },
    { name: 'Lovable', right: '17vw', bottom: '17vh', rotate: '-2deg' },
    { name: 'HTML/CSS', right: '4vw', bottom: '23vh', rotate: '1deg' },
  ],
  scripting: [
    { name: 'Python', right: '12vw', bottom: '18vh', rotate: '-2deg' },
    { name: 'JavaScript', right: '4vw', bottom: '25vh', rotate: '3deg' },
    { name: 'Java', right: '15vw', bottom: '8vh', rotate: '1deg' },
  ],
  tools: [
    { name: 'Git', right: '5vw', bottom: '9vh', rotate: '2deg' },
    { name: 'Linux/WSL', right: '15vw', bottom: '21vh', rotate: '-3deg' },
    { name: 'React', right: '9vw', bottom: '5vh', rotate: '3deg' },
  ],
}

function useSlotAnimation(isActive, contentKey, activeItem, interactive = true) {
  const ref = useRef(null)
  const wasActive = useRef(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (isActive) {
      gsap.set(el, { opacity: 0, x: -10, pointerEvents: interactive ? 'auto' : 'none' })
      gsap.to(el, { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' })
    } else if (wasActive.current) {
      if (activeItem === null) {
        gsap.to(el, {
          opacity: 0,
          x: -10,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => gsap.set(el, { pointerEvents: 'none' }),
        })
      } else {
        gsap.set(el, { opacity: 0, x: -10, pointerEvents: 'none' })
      }
    }

    wasActive.current = isActive
  }, [isActive, contentKey, activeItem, interactive])

  return ref
}

function ProjectSpill({ activeItem }) {
  const isActive = activeItem?.type === 'project'
  const project = useLastTruthy(isActive ? activeItem.id : null)
  const ref = useSlotAnimation(isActive, project, activeItem)

  if (!project) return null
  const info = PROJECT_INFO[project]

  return (
    <div ref={ref} className="spill-project">
      <h3 className="spill-project-name">{info.name}</h3>
      <p className="spill-project-desc">{info.description}</p>
      <p className="spill-project-tech">tech stack: {info.tech}</p>
      <a href={info.link} target="_blank" rel="noopener noreferrer" className="spill-project-link">
        view project &#8594;
      </a>
    </div>
  )
}

function SkillSpill({ activeItem }) {
  const isActive = activeItem?.type === 'skill'
  const skill = useLastTruthy(isActive ? activeItem.id : null)
  const ref = useSlotAnimation(isActive, skill, activeItem, false)

  if (!skill) return null
  const positions = SKILL_POSITIONS[skill]

  return (
    <div ref={ref} className="spill-skill-cluster">
      {positions.map((pos) => (
        <div
          className="spill-logo"
          key={pos.name}
          style={{ right: pos.right, bottom: pos.bottom, transform: `rotate(${pos.rotate})` }}
        >
          <span>{pos.name}</span>
        </div>
      ))}
    </div>
  )
}

function TableSpill({ activeItem }) {
  return (
    <>
      <ProjectSpill activeItem={activeItem} />
      <SkillSpill activeItem={activeItem} />
    </>
  )
}

export default TableSpill

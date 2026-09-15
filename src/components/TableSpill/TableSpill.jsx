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
  'project 1': {
    name: 'project one',
    description: 'A short placeholder description.',
    tech: 'react, node, postgres',
  },
  'project 2': {
    name: 'project two',
    description: 'A short placeholder description.',
    tech: 'python, pandas, scikit-learn',
  },
  'project 3': {
    name: 'project three',
    description: 'A short placeholder description.',
    tech: 'figma, react, css',
  },
  'project 4': {
    name: 'project four',
    description: 'A short placeholder description.',
    tech: 'typescript, express, mongodb',
  },
  'project 5': {
    name: 'project five',
    description: 'A short placeholder description.',
    tech: 'next.js, tailwind, vercel',
  },
}

const SKILL_POSITIONS = {
  ai: [
    { name: 'TensorFlow', right: '5vw', bottom: '22vh', rotate: '2deg' },
    { name: 'PyTorch', right: '14vw', bottom: '12vh', rotate: '-1deg' },
    { name: 'scikit-learn', right: '9vw', bottom: '6vh', rotate: '4deg' },
    { name: 'OpenCV', right: '3vw', bottom: '15vh', rotate: '-2deg' },
  ],
  data: [
    { name: 'Python', right: '6vw', bottom: '20vh', rotate: '-3deg' },
    { name: 'SQL', right: '16vw', bottom: '10vh', rotate: '2deg' },
    { name: 'Pandas', right: '10vw', bottom: '26vh', rotate: '-1deg' },
    { name: 'Tableau', right: '3vw', bottom: '13vh', rotate: '4deg' },
  ],
  design: [
    { name: 'Figma', right: '8vw', bottom: '7vh', rotate: '3deg' },
    { name: 'Canva', right: '17vw', bottom: '17vh', rotate: '-2deg' },
    { name: 'CSS', right: '4vw', bottom: '23vh', rotate: '1deg' },
    { name: 'Photoshop', right: '12vw', bottom: '11vh', rotate: '-4deg' },
  ],
  scripting: [
    { name: 'JavaScript', right: '12vw', bottom: '18vh', rotate: '-2deg' },
    { name: 'Python', right: '4vw', bottom: '25vh', rotate: '3deg' },
    { name: 'Bash', right: '15vw', bottom: '8vh', rotate: '1deg' },
    { name: 'Node.js', right: '7vw', bottom: '14vh', rotate: '-3deg' },
  ],
  tools: [
    { name: 'Git', right: '5vw', bottom: '9vh', rotate: '2deg' },
    { name: 'Docker', right: '15vw', bottom: '21vh', rotate: '-3deg' },
    { name: 'VS Code', right: '9vw', bottom: '5vh', rotate: '3deg' },
    { name: 'Linux', right: '3vw', bottom: '17vh', rotate: '-1deg' },
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
      <a href="#" className="spill-project-link">
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

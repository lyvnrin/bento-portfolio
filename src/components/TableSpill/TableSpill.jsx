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

const SKILL_CONTENTS = {
  ai: ['TensorFlow', 'PyTorch', 'scikit-learn', 'OpenCV'],
  data: ['Python', 'SQL', 'Pandas', 'Tableau'],
  design: ['Figma', 'Canva', 'CSS', 'Photoshop'],
  scripting: ['JavaScript', 'Python', 'Bash', 'Node.js'],
  tools: ['Git', 'Docker', 'VS Code', 'Linux'],
}

const CARD_WIDTH = 200
const VIEWPORT_MARGIN = 16

function useMeasurements() {
  const [rects, setRects] = useState({ left: 0, projectsTop: 0, skillsTop: 0 })

  useLayoutEffect(() => {
    const measure = () => {
      const bento = document.querySelector('.bento-stage')
      const projectsPanel = document.querySelector('.bento-projects')
      const skillsPanel = document.querySelector('.bento-skills')
      if (!bento || !projectsPanel || !skillsPanel) return

      const bentoRect = bento.getBoundingClientRect()
      const projectsRect = projectsPanel.getBoundingClientRect()
      const skillsRect = skillsPanel.getBoundingClientRect()
      const minLeft = bentoRect.right + 16
      const left = Math.min(Math.max(minLeft, 0), window.innerWidth - CARD_WIDTH - VIEWPORT_MARGIN)

      setRects({
        left,
        projectsTop: projectsRect.top + projectsRect.height / 2,
        skillsTop: skillsRect.top + skillsRect.height / 2,
      })
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return rects
}

function useSlotAnimation(isActive, contentKey, activeItem) {
  const ref = useRef(null)
  const wasActive = useRef(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (isActive) {
      gsap.set(el, { yPercent: -50, opacity: 0, x: -10, pointerEvents: 'auto' })
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
        gsap.set(el, { yPercent: -50, opacity: 0, x: -10, pointerEvents: 'none' })
      }
    }

    wasActive.current = isActive
  }, [isActive, contentKey, activeItem])

  return ref
}

function ProjectSpill({ activeItem, left, top }) {
  const isActive = activeItem?.type === 'project'
  const project = useLastTruthy(isActive ? activeItem.id : null)
  const ref = useSlotAnimation(isActive, project, activeItem)

  if (!project) return null
  const info = PROJECT_INFO[project]

  return (
    <div ref={ref} className="spill-project" style={{ left, top }}>
      <h3 className="spill-project-name">{info.name}</h3>
      <p className="spill-project-desc">{info.description}</p>
      <p className="spill-project-tech">tech stack: {info.tech}</p>
      <a href="#" className="spill-project-link">
        view project &#8594;
      </a>
    </div>
  )
}

function SkillSpill({ activeItem, left, top }) {
  const isActive = activeItem?.type === 'skill'
  const skill = useLastTruthy(isActive ? activeItem.id : null)
  const ref = useSlotAnimation(isActive, skill, activeItem)

  if (!skill) return null
  const techs = SKILL_CONTENTS[skill]

  return (
    <div ref={ref} className="spill-skill-row" style={{ left, top }}>
      {techs.map((tech) => (
        <div className="spill-logo" key={tech}>
          <span>{tech}</span>
        </div>
      ))}
    </div>
  )
}

function TableSpill({ activeItem }) {
  const { left, projectsTop, skillsTop } = useMeasurements()
  const leftPx = `${left}px`

  return (
    <>
      <ProjectSpill activeItem={activeItem} left={leftPx} top={`${projectsTop}px`} />
      <SkillSpill activeItem={activeItem} left={leftPx} top={`${skillsTop}px`} />
    </>
  )
}

export default TableSpill

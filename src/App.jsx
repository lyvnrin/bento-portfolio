import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import StickerPeel from './components/StickerPeel/StickerPeel'
import BentoGrid from './components/BentoGrid/BentoGrid'
import TableSpill from './components/TableSpill/TableSpill'
import './App.css'

const PROJECTS = ['project 1', 'project 2', 'project 3', 'project 4', 'project 5']
const SKILLS = ['ai', 'data', 'design', 'scripting', 'tools']

const STICKER_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="100" cy="100" r="100" fill="#D4A69A"/></svg>',
)}`

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [stickerResetKey, setStickerResetKey] = useState(0)
  const [activeItem, setActiveItem] = useState(null)
  const lidRef = useRef(null)
  const didMount = useRef(false)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (isOpen) {
      gsap.to(lidRef.current, {
        rotationX: 85,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.inOut',
        onComplete: () => gsap.set(lidRef.current, { pointerEvents: 'none' }),
      })
    } else {
      gsap.set(lidRef.current, { pointerEvents: 'auto' })
      gsap.to(lidRef.current, { rotationX: 0, opacity: 1, duration: 1.1, ease: 'power3.inOut' })
    }
  }, [isOpen])

  const toggleProject = (id) => {
    setActiveItem((prev) => (prev?.type === 'project' && prev.id === id ? null : { type: 'project', id }))
  }

  const toggleSkill = (id) => {
    setActiveItem((prev) => (prev?.type === 'skill' && prev.id === id ? null : { type: 'skill', id }))
  }

  const handleFinishMeal = () => {
    if (!isOpen) return

    const hadActiveItem = activeItem !== null
    setActiveItem(null)

    setTimeout(
      () => {
        setIsOpen(false)
        setStickerResetKey((key) => key + 1)
      },
      hadActiveItem ? 250 : 0,
    )
  }

  return (
    <>
      <div className="bento-stage">
        <BentoGrid
          projects={PROJECTS}
          skills={SKILLS}
          activeItem={activeItem}
          onToggleProject={toggleProject}
          onToggleSkill={toggleSkill}
        />
        <div className="lid" ref={lidRef}>
          <span className="lid-text">peel the sticker</span>
          <StickerPeel
            key={stickerResetKey}
            className="lid-sticker"
            imageSrc={STICKER_PLACEHOLDER}
            width={120}
            rotate={0}
            peelBackHoverPct={20}
            peelBackActivePct={55}
            shadowIntensity={0.4}
            lightingIntensity={0.08}
            peelDirection={180}
            onPeelComplete={() => setIsOpen(true)}
          />
        </div>
      </div>

      <TableSpill activeItem={activeItem} />

      <button type="button" className="finish-meal" onClick={handleFinishMeal}>
        finish your meal
      </button>
    </>
  )
}

export default App

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import StickerPeel from './components/StickerPeel/StickerPeel'
import BentoGrid from './components/BentoGrid/BentoGrid'
import ChopstickLift from './components/ChopstickLift/ChopstickLift'
import './App.css'

const PROJECTS = ['oaxaca', 'valora', 'sort it out']
const SKILLS = ['ai', 'data', 'design', 'scripting', 'tools']

const STICKER_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="100" cy="100" r="100" fill="#D4A69A"/></svg>',
)}`

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [stickerResetKey, setStickerResetKey] = useState(0)
  const [liftedItem, setLiftedItem] = useState(null)
  const [peeledExperience, setPeeledExperience] = useState(null)
  const [finishMealRight, setFinishMealRight] = useState(0)
  const lidRef = useRef(null)
  const bentoStageRef = useRef(null)
  const didMount = useRef(false)

  useLayoutEffect(() => {
    const measure = () => {
      const rect = bentoStageRef.current?.getBoundingClientRect()
      if (rect) setFinishMealRight(window.innerWidth - rect.left + 20)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

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
    const next = liftedItem?.type === 'project' && liftedItem.id === id ? null : { type: 'project', id }
    setLiftedItem(next)
    // a chopstick-lifted project brings the full-screen overlay, so any peeled
    // nigiri needs to fold back first — skills close for free since they share
    // liftedItem with projects
    if (next?.type === 'project') setPeeledExperience(null)
  }

  const toggleSkill = (id) => {
    setLiftedItem((prev) => (prev?.type === 'skill' && prev.id === id ? null : { type: 'skill', id }))
  }

  const toggleExperience = (role) => {
    setPeeledExperience((prev) => (prev === role ? null : role))
  }

  const setDown = () => setLiftedItem(null)

  const handleFinishMeal = () => {
    if (!isOpen) return

    // set the lifted item back down first, then close the lid over a clear bento
    const hadLiftedItem = liftedItem !== null
    setLiftedItem(null)
    setPeeledExperience(null)

    setTimeout(
      () => {
        setIsOpen(false)
        setStickerResetKey((key) => key + 1)
      },
      hadLiftedItem ? 320 : 0,
    )
  }

  return (
    <>
      <div className="bento-stage" ref={bentoStageRef}>
        <BentoGrid
          projects={PROJECTS}
          skills={SKILLS}
          liftedItem={liftedItem}
          onToggleProject={toggleProject}
          onToggleSkill={toggleSkill}
          peeledExperience={peeledExperience}
          onToggleExperience={toggleExperience}
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

      <ChopstickLift liftedItem={liftedItem} onSetDown={setDown} />

      {isOpen && (
        <button
          type="button"
          className="finish-meal"
          style={{ right: `${finishMealRight}px` }}
          onClick={handleFinishMeal}
        >
          finish your meal
        </button>
      )}
    </>
  )
}

export default App

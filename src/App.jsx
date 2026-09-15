import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import StickerPeel from './components/StickerPeel/StickerPeel'
import './App.css'

const STICKER_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="100" cy="100" r="100" fill="#D4A69A"/></svg>',
)}`

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const lidRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    gsap.to(lidRef.current, {
      rotationX: 85,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.inOut',
      onComplete: () => gsap.set(lidRef.current, { pointerEvents: 'none' }),
    })
  }, [isOpen])

  return (
    <div className="bento-stage">
      <div className="bento-base" />
      <div className="lid" ref={lidRef}>
        <span className="lid-text">peel the sticker</span>
        <StickerPeel
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
  )
}

export default App

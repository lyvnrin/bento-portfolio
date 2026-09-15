import { useEffect, useRef, useState } from 'react'
import './App.css'

const DRAG_THRESHOLD_PX = 6
const PEEL_TRIGGER = 0.85
const CLICK_INCREMENT = 0.34

function getStickerTransform(amount) {
  const translateX = -36 * amount
  const translateY = -64 * amount
  const rotate = -30 * amount
  const skew = -14 * amount
  const scale = 1 - 0.18 * amount
  return `translate(calc(-50% + ${translateX}px), calc(50% + ${translateY}px)) rotate(${rotate}deg) skew(${skew}deg) scale(${scale})`
}

function App() {
  const [peelAmount, setPeelAmount] = useState(0)
  const [peeled, setPeeled] = useState(false)
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)

  useEffect(() => {
    if (peeled) console.log('lid opened')
  }, [peeled])

  const startPeel = () => setPeeled(true)

  const handlePointerDown = (event) => {
    if (peeled) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      moved: false,
      baseline: peelAmount,
      lastAmount: peelAmount,
    }
    setDragging(true)
  }

  const handlePointerMove = (event) => {
    if (!drag.current || peeled) return
    const dx = event.clientX - drag.current.x
    const dy = event.clientY - drag.current.y
    const distance = Math.hypot(dx, dy)
    if (distance > DRAG_THRESHOLD_PX) drag.current.moved = true
    const amount = Math.min(drag.current.baseline + distance / 140, 1)
    drag.current.lastAmount = amount
    setPeelAmount(amount)
  }

  const handlePointerUp = () => {
    if (!drag.current) return
    const { moved, lastAmount } = drag.current
    drag.current = null
    setDragging(false)

    if (!moved) {
      setPeelAmount((prev) => {
        const next = Math.min(prev + CLICK_INCREMENT, 1)
        if (next >= 1) startPeel()
        return next
      })
      return
    }

    if (lastAmount >= PEEL_TRIGGER) {
      setPeelAmount(1)
      startPeel()
    } else {
      setPeelAmount(0)
    }
  }

  const handleKeyDown = (event) => {
    if (peeled) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    setPeelAmount((prev) => {
      const next = Math.min(prev + CLICK_INCREMENT, 1)
      if (next >= 1) startPeel()
      return next
    })
  }

  const opacity = peeled ? 0 : 1 - 0.35 * peelAmount

  return (
    <div className="lid">
      <span className="lid-text">peel the sticker</span>
      <div
        className={`sticker${peeled ? ' sticker--peeled' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Peel the sticker to open the bento box"
        aria-hidden={peeled}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{
          transform: getStickerTransform(peelAmount),
          opacity,
          pointerEvents: peeled ? 'none' : 'auto',
          transition: dragging
            ? 'none'
            : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
        }}
      />
    </div>
  )
}

export default App

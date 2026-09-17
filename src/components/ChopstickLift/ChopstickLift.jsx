import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import './ChopstickLift.css'

// smooth, single-motion deceleration both ways — no oscillation/overshoot
const LIFT_EASE = 'power2.out'
const DROP_EASE = 'power2.out'

const LIFT_IN = 0.35
const LIFT_OUT = 0.3
const PROJECT_SCALE = 1.8

const PROJECT_INFO = {
  oaxaca: {
    name: 'oaxaca',
    description:
      'a full-stack restaurant management system built with react and fastapi, featuring real-time order tracking, inventory management, and team coordination tools.',
    tech: ['React', 'FastAPI', 'SQLite'],
  },
  valora: {
    name: 'valora',
    description:
      'an ai-powered financial chatbot built with react and python, offering real-time economic insight, natural language queries, and personalised financial guidance.',
    tech: ['React', 'Python'],
  },
  'sort it out': {
    name: 'sort it out',
    description:
      'an interactive sorting algorithm visualiser built with react, rendering step-by-step animations of classic algorithms to make the underlying logic easy to follow.',
    tech: ['React', 'JavaScript'],
  },
}

// matches the data-lift-key stamped on the compartment buttons in BentoGrid
function sourceRectOf(item) {
  const el = document.querySelector(`[data-lift-key="${CSS.escape(`${item.type}:${item.id}`)}"]`)
  return el ? el.getBoundingClientRect() : null
}

function liftedWidth(rect) {
  const viewportCap = window.innerWidth * 0.8

  // sized to read like a snack packet rather than scaling 1:1 with the source card;
  // capped at 320px so the whole card (thumb through tech stack) fits on screen
  return Math.min(Math.max(rect.width * PROJECT_SCALE, 280), 320, viewportCap)
}

// where the card will actually sit once at rest, so the chopstick tips can pinch
// its real top-right corner regardless of card type/content size
function finalRectOf(card) {
  const live = {
    x: gsap.getProperty(card, 'x'),
    y: gsap.getProperty(card, 'y'),
    scale: gsap.getProperty(card, 'scale'),
    rotate: gsap.getProperty(card, 'rotation'),
  }

  gsap.set(card, { x: 0, y: 0, scale: 1, rotate: 0 })
  const rect = card.getBoundingClientRect()
  gsap.set(card, live)

  return rect
}

// the transform that drops the centred card back onto the compartment it came from
function restingToSource(card, rect) {
  const live = {
    x: gsap.getProperty(card, 'x'),
    y: gsap.getProperty(card, 'y'),
    scale: gsap.getProperty(card, 'scale'),
    rotate: gsap.getProperty(card, 'rotation'),
  }

  gsap.set(card, { x: 0, y: 0, scale: 1, rotate: 0 })
  const resting = card.getBoundingClientRect()
  gsap.set(card, live)

  return {
    x: rect.left + rect.width / 2 - (resting.left + resting.width / 2),
    y: rect.top + rect.height / 2 - (resting.top + resting.height / 2),
    scale: rect.width / resting.width,
    rotate: 0,
  }
}

function ProjectCard({ id }) {
  const info = PROJECT_INFO[id]

  return (
    <>
      <div className="lift-thumb" />
      <h3 className="lift-package-name">{info.name}</h3>
      <div className="lift-package-section">
        <p className="lift-ingredients">{info.description}</p>
      </div>
      <div className="lift-package-section">
        <p className="lift-tech-list">{info.tech.join(' · ')}</p>
      </div>
    </>
  )
}

function ChopstickLift({ liftedItem, onSetDown }) {
  const [displayed, setDisplayed] = useState(null)
  const [width, setWidth] = useState(0)
  const overlayRef = useRef(null)
  const cardRef = useRef(null)
  const shadowRef = useRef(null)
  const stickFrontRef = useRef(null)
  const stickBackRef = useRef(null)
  const anchorFrontRef = useRef(null)
  const anchorBackRef = useRef(null)
  const sourceRef = useRef(null)
  const displayedRef = useRef(null)

  useEffect(() => {
    // skill boxes unwrap in place now (see SkillBox) — the chopstick lift only
    // ever reacts to projects, and treats a skill (or nothing) as "put it down"
    if (liftedItem?.type === 'project') {
      const rect = sourceRectOf(liftedItem)
      if (!rect) return
      sourceRef.current = rect
      displayedRef.current = liftedItem
      setWidth(liftedWidth(rect))
      setDisplayed(liftedItem)
      return
    }

    const card = cardRef.current
    if (!displayedRef.current || !card) return

    // re-measure: the grid may have scrolled or resized while the item was up
    const rect = sourceRectOf(displayedRef.current) ?? sourceRef.current
    displayedRef.current = null

    gsap.to(overlayRef.current, { opacity: 0, duration: LIFT_OUT, ease: 'power2.in' })
    gsap.to(shadowRef.current, { opacity: 0, duration: LIFT_OUT, ease: 'power2.in' })
    // chopsticks let go and fade back out to the corner as the card starts its descent
    gsap.to([stickFrontRef.current, stickBackRef.current], {
      x: 60,
      y: -60,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
    })
    gsap.to(card, {
      ...restingToSource(card, rect),
      duration: LIFT_OUT,
      ease: DROP_EASE,
      onComplete: () => setDisplayed(null),
    })
  }, [liftedItem])

  useLayoutEffect(() => {
    const card = cardRef.current
    if (!displayed || !card || !sourceRef.current) return

    // centring lives in the transform, so GSAP owns it rather than fighting a CSS one
    gsap.set(card, { xPercent: -50, yPercent: -50 })

    // pin the (unanimated) anchors to the card's real top-right corner so the sticks'
    // tips land exactly there no matter the card's type or content-driven height
    const pinAnchorToCard = () => {
      const cardRect = finalRectOf(card)
      ;[anchorFrontRef.current, anchorBackRef.current].forEach((anchor) => {
        if (!anchor) return
        anchor.style.top = `${cardRect.top}px`
        anchor.style.left = `${cardRect.right}px`
      })
    }
    pinAnchorToCard()

    gsap.fromTo(card, restingToSource(card, sourceRef.current), {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      duration: LIFT_IN,
      ease: LIFT_EASE,
      // re-pin once settled: guards against the card's content-driven height
      // shifting slightly between this pre-animation measurement and landing
      // (e.g. a webfont swapping in), so the tips never drift off the corner
      onComplete: pinAnchorToCard,
    })
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: LIFT_IN, ease: 'power2.out' })
    gsap.fromTo(shadowRef.current, { opacity: 0 }, { opacity: 1, duration: LIFT_IN, ease: 'power2.out' })
    // chopsticks fade and slide in gently from the top-right corner, just after
    // the card starts rising — the fade is what keeps the arrival from reading
    // as an abrupt pop-in
    gsap.fromTo(
      [stickFrontRef.current, stickBackRef.current],
      { x: 60, y: -60, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: 'power2.out' },
    )
  }, [displayed])

  useEffect(() => {
    if (!displayed) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onSetDown()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [displayed, onSetDown])

  if (!displayed) return null

  // portalled straight to body: guarantees the overlay is a direct child of body,
  // clear of any ancestor with a transform/perspective that would break its fixed
  // positioning and starve backdrop-filter of the viewport it needs to sample
  return createPortal(
    <>
      <button
        type="button"
        className="lift-overlay"
        aria-label="set item down"
        onClick={onSetDown}
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 999,
        }}
      />
      {/* stick b goes behind the card: pinches it from underneath, above the overlay.
          each side keeps an unrotated wrapper for GSAP's slide so it doesn't clobber
          the stick's own CSS rotate transform */}
      <div className="lift-chopsticks-anchor lift-chopsticks-anchor--back" aria-hidden="true" ref={anchorBackRef}>
        <div className="lift-chopsticks" ref={stickBackRef}>
          <div className="lift-chopstick lift-chopstick--b" />
        </div>
      </div>
      <div
        className="lift-card lift-card--project"
        ref={cardRef}
        style={{ width: `${width}px`, zIndex: 1001 }}
        onClick={onSetDown}
      >
        <div className="lift-card-shadow" aria-hidden="true" ref={shadowRef} />
        <ProjectCard id={displayed.id} />
      </div>
      {/* stick a goes in front: rests on top of the card, pinching it from above */}
      <div className="lift-chopsticks-anchor lift-chopsticks-anchor--front" aria-hidden="true" ref={anchorFrontRef}>
        <div className="lift-chopsticks" ref={stickFrontRef}>
          <div className="lift-chopstick lift-chopstick--a" />
        </div>
      </div>
    </>,
    document.body,
  )
}

export default ChopstickLift

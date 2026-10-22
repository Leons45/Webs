import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import Scene from './Scene.jsx'

function Loader() {
  const { progress, active } = useProgress()
  return (
    <div className={`loader ${!active && progress >= 100 ? 'hidden' : ''}`}>
      <div className="pct">{Math.round(progress).toString().padStart(2, '0')}%</div>
      <div className="track"><div className="fill" style={{ width: `${progress}%` }} /></div>
      <div className="pct" style={{ letterSpacing: '.22em', fontSize: 10 }}>LOADING THE SCENE</div>
    </div>
  )
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const scrollRef = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionCount = 5

  const { scrollYProgress } = useScroll({ target: containerRef })
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const p = max > 0 ? window.scrollY / max : 0
      scrollRef.current = p
      setActiveIdx(Math.min(sectionCount - 1, Math.floor(p * sectionCount)))
    }
    function onPointer(e) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return (
    <div ref={containerRef}>
      <Loader />

      <nav className="topnav">
        <span className="brand">REFRACTION</span>
        <span className="idx">{String(activeIdx + 1).padStart(2, '0')} / {String(sectionCount).padStart(2, '0')}</span>
      </nav>

      <div className="canvas-fixed">
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 42 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <Scene scrollRef={scrollRef} pointer={pointer} />
          </Suspense>
        </Canvas>
      </div>

      <motion.div className="scrollcue" style={{ opacity: cueOpacity }}>
        <div className="bar" />
        <span>Scroll</span>
      </motion.div>

      <div className="scroll-content">
        <section className="section">
          <Reveal>
            <p className="kicker">An interactive study &middot; React Three Fiber</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 style={{ fontSize: 'clamp(42px,8.5vw,118px)', fontWeight: 460, lineHeight: 0.98, marginTop: 18, maxWidth: '13ch' }}>
              Light, bent<br />on purpose.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{ fontSize: 18, color: 'var(--ink-dim)', maxWidth: '46ch', marginTop: 26, lineHeight: 1.6 }}>
              A single raw-cut crystal, rendered with real transmission, chromatic aberration and
              refraction &mdash; not a texture, not a video loop. Scroll to move through it.
            </p>
          </Reveal>
        </section>

        <section className="section">
          <Reveal><p className="kicker">01 &mdash; Form</p></Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontSize: 'clamp(28px,5vw,56px)', fontWeight: 460, maxWidth: '16ch', lineHeight: 1.15 }}>
              Every facet is hand-jittered geometry, not a stock gem mesh.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{ fontSize: 16, color: 'var(--ink-dim)', maxWidth: '50ch', marginTop: 22, lineHeight: 1.7 }}>
              The icosahedron underneath is deformed vertex-by-vertex with a seeded offset, so no two
              faces sit at quite the same angle &mdash; closer to how a real cut stone catches light unevenly.
            </p>
          </Reveal>
        </section>

        <section className="section">
          <Reveal><p className="kicker">02 &mdash; Light</p></Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontSize: 'clamp(28px,5vw,56px)', fontWeight: 460, maxWidth: '16ch', lineHeight: 1.15 }}>
              Transmission, not transparency.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{ fontSize: 16, color: 'var(--ink-dim)', maxWidth: '50ch', marginTop: 22, lineHeight: 1.7 }}>
              The material traces how light actually refracts through the volume &mdash; index of
              refraction, chromatic split, roughness &mdash; composited with real-time bloom and a
              physically lit studio environment behind it.
            </p>
          </Reveal>
        </section>

        <section className="section">
          <Reveal><p className="kicker">03 &mdash; Motion</p></Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontSize: 'clamp(28px,5vw,56px)', fontWeight: 460, maxWidth: '16ch', lineHeight: 1.15 }}>
              The camera reads your scroll position, not a timeline.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{ fontSize: 16, color: 'var(--ink-dim)', maxWidth: '50ch', marginTop: 22, lineHeight: 1.7 }}>
              Scroll progress drives a damped camera dolly and the crystal&rsquo;s spin speed in real
              time, and your cursor adds a second, independent layer of parallax on top of it.
            </p>
          </Reveal>
        </section>

        <section className="section" style={{ alignItems: 'flex-start' }}>
          <Reveal><p className="kicker">04 &mdash; Built with</p></Reveal>
          <Reveal delay={0.08}>
            <h2 style={{ fontSize: 'clamp(32px,6vw,72px)', fontWeight: 460, maxWidth: '14ch', lineHeight: 1.1 }}>
              React Three Fiber, Three.js, Framer Motion.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 28 }}>
              {['React 19', 'Three.js', 'React Three Fiber', 'drei', 'postprocessing', 'Framer Motion', 'Vite'].map((t) => (
                <span key={t} style={{ fontSize: 11.5, letterSpacing: '.08em', textTransform: 'uppercase', border: '1px solid var(--line)', padding: '8px 14px', color: 'var(--ink-dim)' }}>{t}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <p style={{ fontSize: 14, color: 'var(--ink-dim)', marginTop: 40 }}>
              Built by Rohit Kumar &mdash; <a href="https://irohitk.framer.website" target="_blank" rel="noopener" style={{ borderBottom: '1px solid currentColor' }}>portfolio</a> &middot; <a href="https://github.com/Leons45" target="_blank" rel="noopener" style={{ borderBottom: '1px solid currentColor' }}>GitHub</a>
            </p>
          </Reveal>
        </section>
      </div>
    </div>
  )
}

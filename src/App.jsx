import IntroOverlay from './components/IntroOverlay'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import River from './components/river/River'
import RiverNode from './components/river/RiverNode'
import ResumeBox from './components/ResumeBox'
import Mailbox from './components/Mailbox'
import Footer from './components/Footer'
import { stops } from './data/stops'

// The four journey stops (about, activities, experience, skills) that come
// before the projects. Their index/total must match what Ship used to build
// its anchor list, so pass the same `stops` array and position by index.
const journeyStops = stops.slice(0, 4)

// Everything between the journey and the closing 'next' node is a project —
// journey.js contributes exactly 4 stops before this range and 1 after it
// (see data/stops.js), so this stays correct with no edit here when
// projects.js grows or shrinks.
const projectStops = stops.slice(4, stops.length - 1)

// The closing journey node ("Where this is heading") — the bridge from the
// projects into the estuary's Resume/Contact widgets.
const nextStop = stops[stops.length - 1]

export default function App() {
  return (
    <>
      {/* First focusable element on the page. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <IntroOverlay />
      <Navbar />

      <main id="main">
        <Hero />

        {/* The river flows behind the journey, the projects and the closing
            'next' node, then widens into the estuary — resume and contact. */}
        <River>
          {journeyStops.map((stop, i) => (
            <RiverNode key={stop.id} stop={stop} index={i} total={stops.length} />
          ))}

          <div id="projects">
            {projectStops.map((stop, i) => (
              <RiverNode key={stop.slug} stop={stop} index={4 + i} total={stops.length} />
            ))}
          </div>

          <RiverNode stop={nextStop} index={stops.length - 1} total={stops.length} />

          <div className="mx-auto flex w-full max-w-4xl flex-col items-start justify-center gap-6 md:flex-row md:items-stretch md:gap-16">
            <ResumeBox />
            <Mailbox />
          </div>
        </River>
      </main>

      <Footer />
    </>
  )
}

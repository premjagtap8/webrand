import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero/Hero.jsx'
import WhatWeDo from './components/WhatWeDo/WhatWeDo.jsx'
import OurServices from './components/OurServices/OurServices.jsx'
import Industries from './components/Industries/Industries.jsx'
import HowWeWork from './components/HowWeWork/HowWeWork.jsx'
import WhyWebrandustry from './components/WhyWebrandustry/WhyWebrandustry.jsx'
import OurWork from './components/OurWork/OurWork.jsx'
import Insights from './components/Insights/Insights.jsx'
import LetsTalk from './components/LetsTalk/LetsTalk.jsx'
import Contact from './components/Contact/Contact.jsx'
import Footer from './components/Footer/Footer.jsx'
import NotFound from './components/NotFound/NotFound.jsx'
import { sendEnquiry } from './api/enquiry.js'
import { findSection, scrollToSection } from './utils/SectionNav.jsx'

/* Scrolls to the section that matches the URL (/insights -> #insights).
   Also handles old "#section" links and sends the 404 page to the top. */
function ScrollManager() {
  const { pathname } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    const route = findSection(pathname)

    if (!route) {
      window.scrollTo(0, 0)
      return
    }

    const timer = setTimeout(() => {
      const behavior = first.current ? 'auto' : 'smooth'
      first.current = false

      const hash = window.location.hash
      if (hash) {
        try {
          document.querySelector(hash)?.scrollIntoView()
        } catch {
          /* ignore an invalid hash */
        }
      } else {
        scrollToSection(route, behavior)
      }
    }, 80)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}

/* The one-page site (every section) */
function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <OurServices />
      <Industries />
      <HowWeWork />
      <WhyWebrandustry />
      <OurWork />
      <Insights />
      <LetsTalk />

      <Contact
        onSubmit={sendEnquiry}
        phone="+91 96192 72938"
        phoneHref="https://wa.me/919619272938"
        email="hello@yourdomain.com"
      />
    </>
  )
}

/* Known paths show the site, anything else shows the 404 page */
function Page() {
  const { pathname } = useLocation()
  return findSection(pathname) ? <Home /> : <NotFound />
}

function App() {
  return (
    <>
      <ScrollManager />

      <Navbar />

      <main className="site-main">
        <Page />
      </main>

      <Footer />
    </>
  )
}

export default App
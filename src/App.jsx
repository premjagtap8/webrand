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

function App() {
  return (
    <>
      <Navbar />
      <main className="site-main">
        <Hero />
        <WhatWeDo />
        <OurServices />
        <Industries />
        <HowWeWork />
        <WhyWebrandustry />
        <OurWork />
        <Insights />
        <LetsTalk />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App

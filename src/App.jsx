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
import { sendEnquiry } from './api/enquiry.js'

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

        <Contact
          onSubmit={sendEnquiry}
          phone="+91 96192 72938"
          phoneHref="https://wa.me/919619272938"
          email="hello@yourdomain.com"
        />
      </main>

      <Footer />
    </>
  )
}

export default App
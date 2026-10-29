import { Hero } from '../components/home/Hero'
import { BrandMarquee } from '../components/home/BrandMarquee'
import { FeaturedCollection } from '../components/home/FeaturedCollection'
import { CategoryShowcase } from '../components/home/CategoryShowcase'
import { SignatureSpotlight } from '../components/home/SignatureSpotlight'
import { Manifesto } from '../components/home/Manifesto'
import { Services } from '../components/home/Services'
import { Testimonials } from '../components/home/Testimonials'
import { TestDriveCta } from '../components/home/TestDriveCta'

export default function Home() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <FeaturedCollection />
      <CategoryShowcase />
      <SignatureSpotlight />
      <Manifesto />
      <Services />
      <Testimonials />
      <TestDriveCta />
    </>
  )
}

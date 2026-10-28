import { Hero } from '../components/home/Hero'
import { BrandMarquee } from '../components/home/BrandMarquee'
import { Manifesto } from '../components/home/Manifesto'
import { FeaturedCollection } from '../components/home/FeaturedCollection'
import { SignatureSpotlight } from '../components/home/SignatureSpotlight'
import { CategoryShowcase } from '../components/home/CategoryShowcase'
import { Services } from '../components/home/Services'
import { Testimonials } from '../components/home/Testimonials'
import { TestDriveCta } from '../components/home/TestDriveCta'

export default function Home() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <Manifesto />
      <FeaturedCollection />
      <SignatureSpotlight />
      <CategoryShowcase />
      <Services />
      <Testimonials />
      <TestDriveCta />
    </>
  )
}

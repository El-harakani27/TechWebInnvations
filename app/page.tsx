import Contact from '@/components/contact/Contact';
import Footer from '@/components/footer/Footer';
import Hero from '@/components/hero/Hero';
import Locations from '@/components/locations/Locations';
import Process from '@/components/process/Process';
import Services from '@/components/services/Services';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Services />
        <Process />
        <Locations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

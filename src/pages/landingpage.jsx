
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedCompanies from '../components/TrustedCompanies';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="overflow-hidden bg-white text-slate-900">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <TrustedCompanies />
      <Footer />
    </div>
  );
}
export default LandingPage;
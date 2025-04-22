import Link from 'next/link';
import dynamic from 'next/dynamic'; // Add dynamic import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDiscord,
  faXTwitter,
  faYoutube,
  faInstagram,
  faTiktok,
  faTwitch,
} from '@fortawesome/free-brands-svg-icons';
import { Oxanium, Bebas_Neue, Rajdhani } from 'next/font/google';

// Dynamic import ContactForm with SSR disabled
// const ContactForm = dynamic(() => import('./contactForm'), { ssr: false });

// Configure the fonts
const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
});
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const Footer: React.FC = () => {
  return (
    <footer className={`bg-[#2A0A07] text-[#f4f0e6] py-12 px-4 ${oxanium.className}`}>
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center md:items-start">
        {/* Logo Section */}
        <div className="text-center mb-8 w-full">
          <h1 className={`text-3xl font-bold text-[#db3032] uppercase tracking-wider ${bebasNeue.className}`}>
            Kraken
          </h1>
          <p className="text-sm mt-2">Dive into the Depths of Gaming</p>
        </div>

        {/* Footer Content Wrapper */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12 w-full">
          {/* Links Column */}
          <div className="flex flex-wrap gap-10 w-full md:w-auto">
            {/* Explore Column */}
            <div className='text-center md:text-left w-full md:w-auto'>
              <h3 className={`text-lg font-semibold mb-6 text-[#db3032] ${bebasNeue.className}`}>Explore</h3>
              <ul className={`space-y-4 ${rajdhani.className}`}>
                <li>
                  <Link href="/games" className="hover:text-[#db3032] transition-colors">
                    Games
                  </Link>
                </li>
                <li>
                  <Link href="/consoles" className="hover:text-[#db3032] transition-colors">
                    Consoles
                  </Link>
                </li>
                <li>
                  <Link href="/pcs" className="hover:text-[#db3032] transition-colors">
                    Pcs
                  </Link>
                </li>
                <li>
                  <Link href="/accessories" className="hover:text-[#db3032] transition-colors">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="text-center md:text-left w-full md:w-auto">
              <h3 className={`text-lg font-semibold mb-6 text-[#db3032] ${bebasNeue.className}`}>Support</h3>
              <ul className={`space-y-4 ${rajdhani.className}`}>
                <li>
                  <Link href="/faq" className="hover:text-[#db3032] transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-[#db3032] transition-colors">
                    Get help
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="hover:text-[#db3032] transition-colors">
                    About us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="text-center md:text-left w-full md:w-auto">
              <h3 className={`text-lg font-semibold mb-6 text-[#db3032] ${bebasNeue.className}`}>Connect</h3>
              <ul className={`space-y-4 ${rajdhani.className}`}>
                <li>
                  <a
                    href="https://discord.gg/kraken"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start gap-3 hover:text-[#db3032] transition-colors"
                  >
                    <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
                    <span>Discord</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/krakengames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start gap-3 hover:text-[#db3032] transition-colors"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
                    <span>X (Twitter)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com/krakengames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start gap-3 hover:text-[#db3032] transition-colors"
                  >
                    <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />
                    <span>YouTube</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/krakengames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start gap-3 hover:text-[#db3032] transition-colors"
                  >
                    <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@krakengames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start gap-3 hover:text-[#db3032] transition-colors"
                  >
                    <FontAwesomeIcon icon={faTiktok} className="w-5 h-5" />
                    <span>TikTok</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitch.tv/krakengames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start gap-3 hover:text-[#db3032] transition-colors"
                  >
                    <FontAwesomeIcon icon={faTwitch} className="w-5 h-5" />
                    <span>Twitch</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Section (Align to the Right) */}
           {/* <ContactForm />  */}
        </div>

        {/* Horizontal Line */}
        <hr className="w-full border-t border-[#db3032] border-opacity-30 my-6" />

        {/* Bottom Links */}
        <div className={`flex flex-wrap justify-center md:justify-start gap-8 text-sm w-full ${rajdhani.className}`}>
          <Link href="/privacy-policy" className="hover:text-[#db3032] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-use" className="hover:text-[#db3032] transition-colors">
            Terms of Use
          </Link>
          <Link href="/cookie-policy" className="hover:text-[#db3032] transition-colors">
            Cookie Policy
          </Link>
        </div>

        {/* Copyright Section */}
        <div className="text-center md:text-left text-sm mt-6 w-full">
          <p>© {new Date().getFullYear()} Kraken Game Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
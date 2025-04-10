import { Link } from 'wouter';
import { FaTwitter, FaTelegram, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} FUT Draft Spin. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/terms">
              <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Terms
              </span>
            </Link>
            <Link href="/privacy">
              <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Privacy
              </span>
            </Link>
            <Link href="/help">
              <span className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Help
              </span>
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a 
              href="https://t.me/FutDraftSpinBot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTelegram size={20} />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

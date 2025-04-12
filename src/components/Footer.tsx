
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">YourBrand</h3>
            <p className="text-gray-300">
              Empowering professionals through expert guidance and resources.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-white hover:text-secondary transition-colors">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-secondary transition-colors inline-block">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/pdfs" className="hover:text-secondary transition-colors inline-block">
                  PDFs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-secondary transition-colors inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/downloads/code" className="hover:text-secondary transition-colors inline-block">
                  Code Downloads
                </Link>
              </li>
              <li>
                <Link to="/downloads/resources" className="hover:text-secondary transition-colors inline-block">
                  Resource Downloads
                </Link>
              </li>
              <li>
                <Link to="/publications/research" className="hover:text-secondary transition-colors inline-block">
                  Research Articles
                </Link>
              </li>
              <li>
                <Link to="/projects/academic" className="hover:text-secondary transition-colors inline-block">
                  Academic Projects
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0 text-secondary" />
                <span>contact@yourbrand.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 text-secondary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 flex-shrink-0 text-secondary mt-0.5" />
                <span>123 Business St, City, State</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p className="text-gray-300">
            © {new Date().getFullYear()} YourBrand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

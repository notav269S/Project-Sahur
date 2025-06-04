
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#00203F] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="text-2xl font-bold text-[#ADEFD1] mb-4 inline-block">Project Sahur</Link>
            <p className="text-gray-300 mb-6">
              Boost your productivity and achieve more with our powerful task management and focus tools.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-[#ADEFD1] hover:text-white hover:bg-[#ADEFD1]/20">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#ADEFD1] hover:text-white hover:bg-[#ADEFD1]/20">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#ADEFD1] hover:text-white hover:bg-[#ADEFD1]/20">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#ADEFD1] hover:text-white hover:bg-[#ADEFD1]/20">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <p className="font-semibold mb-4 text-[#ADEFD1]">Product</p>
            <ul className="space-y-2">
              <li><a href="/#features" className="text-gray-300 hover:text-[#ADEFD1] transition-colors">Features</a></li>
              <li><Link to="/subscribe" className="text-gray-300 hover:text-[#ADEFD1] transition-colors">Pricing</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-[#ADEFD1] transition-colors">Integrations</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#ADEFD1] transition-colors">Changelog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#ADEFD1] transition-colors">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <p className="font-semibold mb-4 text-[#ADEFD1]">Resources</p>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-[#ADEFD1] transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#ADEFD1] transition-colors">Help Center</a></li>
              <li><a href="/#faq" className="text-gray-300 hover:text-[#ADEFD1] transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#ADEFD1] transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-[#ADEFD1] transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <p className="font-semibold mb-4 text-[#ADEFD1]">Subscribe to Newsletter</p>
            <p className="text-gray-300 mb-4">
              Get the latest news, tips, and updates from Project Sahur.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-[#00203F] border-[#ADEFD1]/30 text-white placeholder:text-gray-400 focus:border-[#ADEFD1]"
              />
              <Button className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="bg-[#ADEFD1]/20 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Project Sahur. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-[#ADEFD1] text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-[#ADEFD1] text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-[#ADEFD1] text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
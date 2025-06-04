import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  
  const logoColor = theme === 'dark' ? "text-primary" : "text-primary";
  const sectionBg = theme === 'dark' ? 'bg-background' : 'bg-card'; 
  const textColor = theme === 'dark' ? "text-muted-foreground" : "text-card-foreground/80";
  const headingColor = theme === 'dark' ? "text-foreground" : "text-foreground"; 
  const iconColor = theme === 'dark' ? "text-primary" : "text-primary";
  const hoverIconColor = theme === 'dark' ? "hover:text-primary/80" : "hover:text-primary/80";
  const hoverBgColor = theme === 'dark' ? "hover:bg-primary/10" : "hover:bg-primary/10";
  const inputBg = theme === 'dark' ? "bg-card" : "bg-background";
  const inputBorder = theme === 'dark' ? "border-border" : "border-input";
  const inputFocusBorder = theme === 'dark' ? "focus:border-primary" : "focus:border-primary";
  const buttonClass = theme === 'dark' ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-primary text-primary-foreground hover:bg-primary/90";
  const separatorBg = theme === 'dark' ? "bg-border/50" : "bg-border/50";
  const copyrightText = theme === 'dark' ? "text-muted-foreground/60" : "text-card-foreground/60";
  const linkText = theme === 'dark' ? "text-muted-foreground" : "text-card-foreground/80";
  const linkHoverText = theme === 'dark' ? "hover:text-primary" : "hover:text-primary";


  return (
    <footer className={`${sectionBg} text-card-foreground pt-16 md:pt-20 pb-8`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className={`text-xl font-bold ${logoColor} mb-4 inline-flex items-center`}>
              <Sparkles className={`mr-2 h-5 w-5 ${logoColor}`} />
              Project Sahur
            </Link>
            <p className={`${textColor} text-sm mb-5`}>
              Elevate your focus, organize your life, and achieve your goals with Project Sahur.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className={`${iconColor} ${hoverIconColor} ${hoverBgColor} h-8 w-8`}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className={`${iconColor} ${hoverIconColor} ${hoverBgColor} h-8 w-8`}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className={`${iconColor} ${hoverIconColor} ${hoverBgColor} h-8 w-8`}>
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className={`${iconColor} ${hoverIconColor} ${hoverBgColor} h-8 w-8`}>
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <p className={`font-semibold text-base mb-4 ${headingColor}`}>Product</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/#features" className={`${textColor} ${linkHoverText} transition-colors`}>Features</a></li>
              <li><Link to="/subscribe" className={`${textColor} ${linkHoverText} transition-colors`}>Pricing</Link></li>
              <li><a href="#" className={`${textColor} ${linkHoverText} transition-colors`}>Changelog</a></li>
              <li><a href="#" className={`${textColor} ${linkHoverText} transition-colors`}>Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <p className={`font-semibold text-base mb-4 ${headingColor}`}>Resources</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className={`${textColor} ${linkHoverText} transition-colors`}>Blog</a></li>
              <li><a href="#" className={`${textColor} ${linkHoverText} transition-colors`}>Help Center</a></li>
              <li><a href="/#faq" className={`${textColor} ${linkHoverText} transition-colors`}>FAQ</a></li>
              <li><a href="#" className={`${textColor} ${linkHoverText} transition-colors`}>Community</a></li>
            </ul>
          </div>
          
          <div>
            <p className={`font-semibold text-base mb-4 ${headingColor}`}>Stay Updated</p>
            <p className={`${textColor} text-sm mb-3`}>
              Get the latest news, tips, and updates from Project Sahur.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className={`${inputBg} ${inputBorder} text-sm h-9 placeholder:text-muted-foreground ${inputFocusBorder}`}
              />
              <Button size="sm" className={`${buttonClass} h-9 text-xs`}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className={`${separatorBg} my-8`} />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-xs">
          <p className={`${copyrightText} mb-3 md:mb-0`}>
            © {new Date().getFullYear()} Project Sahur. All rights reserved.
          </p>
          <div className="flex space-x-5">
            <a href="#" className={`${linkText} ${linkHoverText} transition-colors`}>Terms</a>
            <a href="#" className={`${linkText} ${linkHoverText} transition-colors`}>Privacy</a>
            <a href="#" className={`${linkText} ${linkHoverText} transition-colors`}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
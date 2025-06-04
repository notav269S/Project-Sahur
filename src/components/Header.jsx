import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Info, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };
  
  const logoColorClass = theme === 'dark' ? 'text-primary' : 'text-primary'; 
  const navLinkColor = theme === 'dark' ? 'text-foreground hover:text-primary' : 'text-foreground hover:text-primary';
  const buttonOutlineClass = theme === 'dark' ? 'border-primary text-primary hover:bg-primary/10 hover:text-primary' : 'border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary';
  const buttonPrimaryClass = theme === 'dark' ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg' : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg';


  return (
    <header className="w-full py-3 px-4 md:px-6 bg-card/95 text-card-foreground sticky top-0 z-50 shadow-sm backdrop-blur-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center"
          >
            <Link to="/" className={`text-xl font-bold ${logoColorClass} flex items-center`}>
              <Sparkles className={`mr-2 h-5 w-5 ${logoColorClass}`} />
              Project Sahur
            </Link>
          </motion.div>

          <motion.nav
            className="hidden md:flex space-x-5 items-center"
            initial="hidden"
            animate="visible"
            variants={navVariants}
          >
            <motion.a
              href="/#features"
              className={`${navLinkColor} transition-colors text-sm font-medium`}
              variants={itemVariants}
            >
              Features
            </motion.a>
            <motion.a
              href="/#testimonials"
              className={`${navLinkColor} transition-colors text-sm font-medium`}
              variants={itemVariants}
            >
              Testimonials
            </motion.a>
            <motion.a
              href="/#pricing"
              className={`${navLinkColor} transition-colors text-sm font-medium`}
              variants={itemVariants}
            >
              Pricing
            </motion.a>
             <motion.div variants={itemVariants}>
              <Link to="/about" className={`${navLinkColor} transition-colors flex items-center text-sm font-medium`}>
                <Info className="mr-1 h-3.5 w-3.5" /> About
              </Link>
            </motion.div>
            <motion.a
              href="/#faq"
              className={`${navLinkColor} transition-colors text-sm font-medium`}
              variants={itemVariants}
            >
              FAQ
            </motion.a>
             <motion.div variants={itemVariants}>
              <Link to="/subscribe">
                <Button variant="outline" size="sm" className={`${buttonOutlineClass} text-xs`}>
                  <Zap className="mr-1.5 h-3.5 w-3.5" /> Subscribe
                </Button>
              </Link>
            </motion.div>
          </motion.nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="hidden md:block"
            >
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button size="sm" className={`${buttonPrimaryClass} transition-all duration-200 ease-out text-xs`}>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Button>
              </Link>
            </motion.div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                className={`${navLinkColor}`}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden mt-3 bg-card rounded-lg shadow-xl overflow-hidden"
          >
            <div className="flex flex-col space-y-1 py-3">
              <a
                href="/#features"
                className={`${navLinkColor} transition-colors px-4 py-2.5 text-sm block`}
                onClick={toggleMenu}
              >
                Features
              </a>
              <a
                href="/#testimonials"
                className={`${navLinkColor} transition-colors px-4 py-2.5 text-sm block`}
                onClick={toggleMenu}
              >
                Testimonials
              </a>
              <a
                href="/#pricing"
                className={`${navLinkColor} transition-colors px-4 py-2.5 text-sm block`}
                onClick={toggleMenu}
              >
                Pricing
              </a>
              <Link to="/about" className={`${navLinkColor} transition-colors px-4 py-2.5 text-sm flex items-center`} onClick={toggleMenu}>
                <Info className="mr-2 h-4 w-4" /> About
              </Link>
              <a
                href="/#faq"
                className={`${navLinkColor} transition-colors px-4 py-2.5 text-sm block`}
                onClick={toggleMenu}
              >
                FAQ
              </a>
              <div className="px-4 pt-2">
                <Link to="/subscribe" className="w-full block" onClick={toggleMenu}>
                  <Button variant="outline" size="sm" className={`w-full ${buttonOutlineClass} mb-2 text-xs`}>
                    <Zap className="mr-1.5 h-3.5 w-3.5" /> Subscribe
                  </Button>
                </Link>
              </div>
              <div className="px-4">
                 <Link to={isAuthenticated ? "/dashboard" : "/auth"} className="w-full block" onClick={toggleMenu}>
                    <Button size="sm" className={`w-full ${buttonPrimaryClass} transition-colors text-xs`}>
                      {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                    </Button>
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
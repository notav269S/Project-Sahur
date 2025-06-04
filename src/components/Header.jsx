
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header className="w-full py-4 px-4 md:px-6 bg-card text-card-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="text-2xl font-bold text-primary dark:text-secondary">Project Sahur</Link>
          </motion.div>

          <motion.nav
            className="hidden md:flex space-x-6 items-center"
            initial="hidden"
            animate="visible"
            variants={navVariants}
          >
            <motion.a
              href="/#features"
              className="text-foreground hover:text-primary dark:hover:text-secondary transition-colors"
              variants={itemVariants}
            >
              Features
            </motion.a>
            <motion.a
              href="/#testimonials"
              className="text-foreground hover:text-primary dark:hover:text-secondary transition-colors"
              variants={itemVariants}
            >
              Testimonials
            </motion.a>
            <motion.a
              href="/#pricing"
              className="text-foreground hover:text-primary dark:hover:text-secondary transition-colors"
              variants={itemVariants}
            >
              Pricing
            </motion.a>
             <motion.div variants={itemVariants}>
              <Link to="/about" className="text-foreground hover:text-primary dark:hover:text-secondary transition-colors flex items-center">
                <Info className="mr-1 h-4 w-4" /> About
              </Link>
            </motion.div>
            <motion.a
              href="/#faq"
              className="text-foreground hover:text-primary dark:hover:text-secondary transition-colors"
              variants={itemVariants}
            >
              FAQ
            </motion.a>
             <motion.div variants={itemVariants}>
              <Link to="/subscribe">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary dark:border-secondary dark:text-secondary dark:hover:bg-secondary/10 dark:hover:text-secondary">
                  <Zap className="mr-2 h-4 w-4" /> Subscribe
                </Button>
              </Link>
            </motion.div>
          </motion.nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block"
            >
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90 transition-colors">
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
                className="text-foreground hover:text-primary dark:hover:text-secondary"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
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
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 bg-card rounded-md shadow-lg"
          >
            <div className="flex flex-col space-y-2 py-4">
              <a
                href="/#features"
                className="text-foreground hover:text-primary dark:hover:text-secondary transition-colors px-4 py-2"
                onClick={toggleMenu}
              >
                Features
              </a>
              <a
                href="/#testimonials"
                className="text-foreground hover:text-primary dark:hover:text-secondary transition-colors px-4 py-2"
                onClick={toggleMenu}
              >
                Testimonials
              </a>
              <a
                href="/#pricing"
                className="text-foreground hover:text-primary dark:hover:text-secondary transition-colors px-4 py-2"
                onClick={toggleMenu}
              >
                Pricing
              </a>
              <Link to="/about" className="text-foreground hover:text-primary dark:hover:text-secondary transition-colors px-4 py-2 flex items-center" onClick={toggleMenu}>
                <Info className="mr-2 h-4 w-4" /> About
              </Link>
              <a
                href="/#faq"
                className="text-foreground hover:text-primary dark:hover:text-secondary transition-colors px-4 py-2"
                onClick={toggleMenu}
              >
                FAQ
              </a>
              <div className="px-4 pt-2">
                <Link to="/subscribe" className="w-full" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary dark:border-secondary dark:text-secondary dark:hover:bg-secondary/10 dark:hover:text-secondary mb-2">
                    <Zap className="mr-2 h-4 w-4" /> Subscribe
                  </Button>
                </Link>
              </div>
              <div className="px-4">
                 <Link to={isAuthenticated ? "/dashboard" : "/auth"} className="w-full" onClick={toggleMenu}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90 transition-colors">
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

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  const heroBgClass = theme === 'dark' ? 'hero-pattern-dark' : 'hero-pattern-light';
  const titleColor = theme === 'dark' ? 'text-foreground' : 'text-foreground'; 
  const highlightClass = "gradient-text"; 
  const textColor = theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground';
  const badgeBg = theme === 'dark' ? 'bg-primary/10' : 'bg-secondary/10';
  const badgeText = theme === 'dark' ? 'text-primary' : 'text-secondary';
  const inputClass = theme === 'dark' ? 'bg-card/70 border-border text-foreground placeholder:text-muted-foreground' : 'bg-background/70 border-input text-foreground placeholder:text-muted-foreground';
  const buttonClass = theme === 'dark' ? 'cta-button-dark shadow-lg hover:shadow-xl' : 'cta-button-light shadow-lg hover:shadow-xl';
  const checkColor = theme === 'dark' ? 'text-primary' : 'text-secondary';
  const imageContainerBg = theme === 'dark' ? 'bg-card/50' : 'bg-primary/5';
  const imageBorder = theme === 'dark' ? 'border-primary/20' : 'border-secondary/20';


  return (
    <section className={`relative ${heroBgClass} py-24 md:py-36 overflow-hidden`}>
      <div className={`absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full ${theme === 'dark' ? 'bg-primary/5' : 'bg-secondary/5'} opacity-50 blur-3xl animate-pulse-slow`}></div>
      <div className={`absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full ${theme === 'dark' ? 'bg-secondary/5' : 'bg-accent/5'} opacity-50 blur-3xl animate-pulse-slow animation-delay-2000`}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "circOut" }}
            className="lg:w-[55%] text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y:10 }}
              animate={{ opacity: 1, y:0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${badgeBg} ${badgeText} text-xs font-medium mb-5 shadow-sm`}>
                <Sparkles className="h-3.5 w-3.5"/> Boost your productivity today
              </span>
            </motion.div>
            
            <motion.h1 
              className={`text-4xl sm:text-5xl md:text-6xl font-extrabold ${titleColor} mb-6 leading-tight tracking-tight`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Stay <span className={highlightClass}>Focused</span>, Get More <span className={highlightClass}>Done</span> with Project Sahur
            </motion.h1>
            
            <motion.p 
              className={`text-base sm:text-lg ${textColor} mb-8 max-w-lg mx-auto lg:mx-0`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Project Sahur helps you organize tasks, manage time, and eliminate distractions so you can achieve your goals faster than ever before.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="relative flex-1 max-w-sm sm:max-w-xs">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={`pr-10 ${inputClass} h-11 text-sm shadow-sm`}
                />
              </div>
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button className={`${buttonClass} h-11 px-6 font-medium text-sm w-full sm:w-auto transition-all duration-200 ease-out`}>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className={`mt-5 flex items-center justify-center lg:justify-start gap-4 text-xs ${textColor}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center">
                <CheckCircle className={`h-3.5 w-3.5 ${checkColor} mr-1.5`} />
                <span>Free 14-day trial on Plus</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className={`h-3.5 w-3.5 ${checkColor} mr-1.5`} />
                <span>No credit card for Free plan</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:w-[45%]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "circOut" }}
          >
            <div className={`relative ${imageContainerBg} ${imageBorder} rounded-xl p-1.5 shadow-2xl`}>
              <img 
                alt="Project Sahur app dashboard showing task management interface on a sleek device" 
                className="rounded-lg w-full h-auto shadow-lg" 
               src="https://images.unsplash.com/photo-1601342630314-8427c38bf5e6" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const CTA = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  const bgColor = theme === 'dark' ? 'bg-gradient-to-br from-card to-background' : 'bg-gradient-to-br from-primary/5 to-secondary/5';
  const textColor = theme === 'dark' ? 'text-foreground' : 'text-foreground';
  const highlightClass = "gradient-text"; 

  const buttonPrimaryClass = theme === 'dark' ? 'cta-button-dark shadow-lg hover:shadow-xl' : 'cta-button-light shadow-lg hover:shadow-xl';
  const buttonOutlineClass = theme === 'dark' ? 'border-primary text-primary hover:bg-primary/10' : 'border-secondary text-secondary hover:bg-secondary/10';


  return (
    <section className={`py-20 md:py-28 ${bgColor} relative overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-1/3 -left-1/4 w-2/3 h-2/3 rounded-full ${theme === 'dark' ? 'bg-primary/5' : 'bg-secondary/5'} opacity-60 blur-3xl animate-pulse-slow`}></div>
        <div className={`absolute -bottom-1/3 -right-1/4 w-2/3 h-2/3 rounded-full ${theme === 'dark' ? 'bg-secondary/5' : 'bg-accent/5'} opacity-60 blur-3xl animate-pulse-slow animation-delay-3000`}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "circOut" }}
          >
            <div className="flex justify-center mb-5">
                <Sparkles className={`h-10 w-10 ${theme === 'dark' ? 'text-primary' : 'text-secondary'}`} />
            </div>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold ${textColor} mb-6 tracking-tight`}>
              Ready to <span className={highlightClass}>Elevate</span> Your Productivity?
            </h2>
            
            <p className={`text-base md:text-lg ${theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground'} mb-10 max-w-xl mx-auto`}>
              Join thousands of students and professionals mastering their tasks and goals with Project Sahur. Start your journey to peak productivity today.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button className={`${buttonPrimaryClass} h-12 px-8 text-base w-full sm:w-auto transition-all duration-200 ease-out`}>
                  {isAuthenticated ? "Open Dashboard" : "Get Started Free"} <Zap className="ml-2 h-4.5 w-4.5" />
                </Button>
              </Link>
              <Link to="/subscribe">
                <Button variant="outline" size="lg" className={`${buttonOutlineClass} h-12 px-8 text-base border-2 hover:shadow-md w-full sm:w-auto`}>
                  View Plans <ArrowRight className="ml-2 h-4.5 w-4.5" />
                </Button>
              </Link>
            </motion.div>
            
            <p className={`mt-8 text-xs ${theme === 'dark' ? 'text-muted-foreground/70' : 'text-muted-foreground/70'}`}>
              Free plan available to get you started. Upgrade anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
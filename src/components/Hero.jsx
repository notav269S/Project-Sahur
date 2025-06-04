import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className="relative hero-pattern py-20 md:py-32 overflow-hidden">
      <div className="blob w-64 h-64 rounded-full bg-[#ADEFD1]/20 top-20 left-10"></div>
      <div className="blob w-96 h-96 rounded-full bg-[#ADEFD1]/10 bottom-10 right-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-[#ADEFD1]/20 text-[#ADEFD1] text-sm font-medium mb-6">
                Boost your productivity today
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Stay <span className="text-[#ADEFD1]">Focused</span>, Get More <span className="text-[#ADEFD1]">Done</span> with Project Sahur
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Project Sahur helps you organize tasks, manage time, and eliminate distractions so you can achieve your goals faster than ever before.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="relative flex-1 max-w-md">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="pr-12 bg-white/10 border-[#ADEFD1]/30 text-white placeholder:text-gray-400 h-12"
                />
              </div>
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button className="cta-button h-12 px-8 text-white hover:text-[#00203F] font-medium w-full sm:w-auto">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-6 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-[#ADEFD1] mr-2" />
                <span>Free 14-day trial on Plus</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-[#ADEFD1] mr-2" />
                <span>No credit card for Free plan</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative bg-[#00203F] border border-[#ADEFD1]/20 rounded-xl p-2 shadow-2xl">
              <div className="absolute -top-3 left-4 right-4 h-2 bg-[#ADEFD1]/80 rounded-t-lg blur-sm"></div>
              <div className="absolute -bottom-3 left-4 right-4 h-2 bg-[#ADEFD1]/80 rounded-b-lg blur-sm"></div>
              <div className="absolute -left-3 top-4 bottom-4 w-2 bg-[#ADEFD1]/80 rounded-l-lg blur-sm"></div>
              <div className="absolute -right-3 top-4 bottom-4 w-2 bg-[#ADEFD1]/80 rounded-r-lg blur-sm"></div>
              <img  
                alt="Project Sahur app dashboard showing task management interface" 
                className="rounded-lg w-full h-auto shadow-lg"
               src="https://images.unsplash.com/photo-1681164316399-e29d73f1b4fa" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
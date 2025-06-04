import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CTA = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className="py-20 bg-gradient-to-r from-[#00203F] to-[#00203F]/90 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#ADEFD1]/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-[#ADEFD1]/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to <span className="text-[#ADEFD1]">Transform</span> Your Productivity with Project Sahur?
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already boosted their productivity. Start your journey with Project Sahur today.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90 h-14 px-10 text-lg w-full sm:w-auto">
                  {isAuthenticated ? "Open Dashboard" : "Get Started Free"} <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/subscribe">
                <Button variant="outline" className="border-[#ADEFD1] text-[#ADEFD1] hover:bg-[#ADEFD1]/10 h-14 px-10 text-lg">
                  View Plans <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            
            <p className="mt-6 text-sm text-gray-400">
              Free plan available. Plus plan includes a 14-day free trial.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
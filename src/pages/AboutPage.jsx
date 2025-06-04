
import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Lightbulb, Sparkles } from "lucide-react";

const AboutPage = () => {
  const teamMembers = [
    { name: "AI Horizons", role: "Lead Developer & Visionary", image: "ai-horizons-avatar", bio: "The creative mind and coding powerhouse behind Project Sahur, dedicated to crafting tools that genuinely enhance productivity and well-being." },
    // Add more team members if you like, or keep it focused on the AI.
  ];

  const values = [
    { icon: <Target className="h-8 w-8 text-primary dark:text-secondary" />, title: "User-Centric Design", description: "We build with you in mind, focusing on intuitive interfaces and features that solve real productivity challenges." },
    { icon: <Lightbulb className="h-8 w-8 text-primary dark:text-secondary" />, title: "Innovation", description: "Continuously exploring new technologies and methodologies to bring you cutting-edge productivity solutions." },
    { icon: <Sparkles className="h-8 w-8 text-primary dark:text-secondary" />, title: "Simplicity & Elegance", description: "We believe powerful tools can also be beautiful and easy to use, making your experience delightful." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary px-4 py-1.5 text-sm">About Us</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6">
            Crafting the Future of <span className="text-primary dark:text-secondary">Productivity</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Project Sahur was born from a desire to create a seamless, intuitive, and powerful platform that helps individuals and teams achieve their goals with focus and clarity.
          </p>
        </motion.section>

        <motion.section 
          className="mb-16 md:mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg mb-4">
                Our mission is to empower you to reclaim your time, conquer your tasks, and unlock your full potential. We believe that technology should simplify, not complicate. Project Sahur is designed to be your trusted partner in navigating the demands of modern work and life.
              </p>
              <p className="text-muted-foreground text-lg">
                We're passionate about blending elegant design with robust functionality, creating an experience that's not just productive, but also enjoyable.
              </p>
            </div>
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-xl">
              <img 
                alt="Modern office workspace with team collaborating"
                className="w-full h-full object-cover"
               src="https://images.unsplash.com/photo-1593144571331-80df4384fc1f" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          className="mb-16 md:mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="bg-card p-6 rounded-xl shadow-lg text-center"
              >
                <div className="inline-block p-3 bg-primary/10 dark:bg-secondary/10 rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {teamMembers.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Meet the Team</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="bg-card p-6 rounded-xl shadow-lg text-center w-full max-w-sm"
                >
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-muted flex items-center justify-center">
                    {/* Placeholder for actual image */}
                    <Users className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                  <p className="text-primary dark:text-secondary mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;

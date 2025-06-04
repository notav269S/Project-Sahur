import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const testimonials = [
  {
    name: "Aisha K.",
    role: "Founder, Bloom Creatives",
    content: "Project Sahur completely reshaped my workday. The focus timer and task prioritization features are incredibly effective—I've seen a 40% boost in my productivity!",
    rating: 5,
    image: "aisha-khan"
  },
  {
    name: "Ben C.",
    role: "Lead Developer",
    content: "As a developer, deep focus is crucial. Project Sahur's distraction blocker and customizable Pomodoro timer have become essential tools in my daily workflow.",
    rating: 5,
    image: "ben-carter"
  },
  {
    name: "Chloe D.",
    role: "Freelance Writer",
    content: "Juggling multiple client projects was chaotic before Project Sahur. Now, I effortlessly track time, organize tasks, and consistently meet deadlines. It's a lifesaver!",
    rating: 4,
    image: "chloe-davis"
  },
  {
    name: "Daniel L.",
    role: "PhD Candidate",
    content: "Project Sahur has been instrumental in balancing my research, coursework, and teaching. The analytics provide valuable insights into my most productive periods.",
    rating: 5,
    image: "daniel-lee"
  }
];

const Testimonials = () => {
  const { theme } = useTheme();
  const sectionBg = theme === 'dark' ? 'bg-card' : 'bg-primary/5'; 
  const titleColor = theme === 'dark' ? 'text-foreground' : 'text-foreground';
  const highlightClass = "gradient-text-alt"; 
  const textColor = theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground';
  const cardBg = theme === 'dark' ? 'bg-background' : 'bg-card'; 
  const cardBorder = theme === 'dark' ? 'border-border' : 'border-border';
  const starColor = theme === 'dark' ? 'text-accent' : 'text-accent'; 
  const nameColor = theme === 'dark' ? 'text-foreground' : 'text-foreground';
  const roleColor = theme === 'dark' ? 'text-primary' : 'text-primary'; 
  const badgeBg = theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground';


  return (
    <section id="testimonials" className={`${sectionBg} py-20 md:py-28`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "circOut" }}
        >
          <Badge variant="secondary" className={`mb-4 ${badgeBg} text-xs px-3 py-1 shadow-sm`}>User Stories</Badge>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 ${titleColor}`}>
            Loved by <span className={highlightClass}>Productive People</span>
          </h2>
          <p className={`text-base md:text-lg ${textColor} max-w-2xl mx-auto`}>
            Hear from individuals who have transformed their productivity and achieved their goals with Project Sahur.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20, scale:0.95 }}
              whileInView={{ opacity: 1, y: 0, scale:1 }}
              viewport={{ once: true, amount:0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              <Card className={`testimonial-card h-full ${cardBg} ${cardBorder} shadow-xl hover:shadow-2xl`}>
                <CardContent className="p-5 md:p-6 flex flex-col h-full">
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? `fill-current ${starColor}` : `${starColor}/30`}`} />
                    ))}
                  </div>
                  <p className={`${textColor} text-sm leading-relaxed mb-5 flex-grow`}>"{testimonial.content}"</p>
                  <div className="flex items-center mt-auto pt-4 border-t border-border/50">
                    <div className="mr-3">
                      <div className={`h-10 w-10 rounded-full ${theme === 'dark' ? 'bg-primary/20' : 'bg-secondary/20'} overflow-hidden flex items-center justify-center`}>
                        <img 
                          alt={`${testimonial.name} profile picture`} 
                          className="h-full w-full object-cover"
                         src="https://images.unsplash.com/photo-1604703021135-92b25e6415e4" />
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${nameColor} text-sm`}>{testimonial.name}</h4>
                      <p className={`text-xs ${roleColor}`}>{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
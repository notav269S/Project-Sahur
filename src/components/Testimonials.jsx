
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aisha Khan",
    role: "Founder, Bloom Creatives",
    content: "Project Sahur transformed how I manage my workday. The focus timer and task prioritization features helped me increase my productivity by 40%.",
    rating: 5,
    image: "aisha-khan"
  },
  {
    name: "Ben Carter",
    role: "Lead Developer, Tech Solutions Inc.",
    content: "As a developer, I need to stay focused for long periods. Project Sahur's distraction blocker and Pomodoro timer have been game-changers for my workflow.",
    rating: 5,
    image: "ben-carter"
  },
  {
    name: "Chloe Davis",
    role: "Freelance Writer & Editor",
    content: "Managing multiple client projects used to be overwhelming until I found Project Sahur. Now I can track time, organize tasks, and meet deadlines effortlessly.",
    rating: 4,
    image: "chloe-davis"
  },
  {
    name: "Daniel Lee",
    role: "PhD Candidate, University of Science",
    content: "Project Sahur helped me balance my research, coursework, and teaching responsibilities. The analytics feature shows me when I'm most productive.",
    rating: 5,
    image: "daniel-lee"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-[#00203F]">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-[#ADEFD1] text-[#00203F]">Testimonials</Badge>
          <h2 className="text-4xl font-bold mb-6 text-white">
            What Our <span className="text-[#ADEFD1]">Users Say</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their productivity with Project Sahur.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="testimonial-card h-full bg-[#00203F] border border-[#ADEFD1]/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#ADEFD1] text-[#ADEFD1]" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={`empty-${i}`} className="h-4 w-4 text-[#ADEFD1]/50" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 text-base">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="h-12 w-12 rounded-full bg-[#ADEFD1]/20 overflow-hidden">
                        <img  
                          alt={`${testimonial.name} profile picture`} 
                          className="h-full w-full object-cover"
                          src="https://images.unsplash.com/photo-1575383596664-30f4489f9786" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-[#ADEFD1]">{testimonial.role}</p>
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
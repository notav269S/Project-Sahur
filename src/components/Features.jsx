
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Bell, BarChart, CheckSquare, Zap, Target, Layers, Brain, Edit } from "lucide-react";

const featureItems = [
  {
    icon: <CheckSquare className="h-10 w-10 text-[#ADEFD1]" />,
    title: "Task Management",
    description: "Create, organize, and prioritize tasks with intuitive drag-and-drop functionality.",
    badge: "Core Feature"
  },
  {
    icon: <Clock className="h-10 w-10 text-[#ADEFD1]" />,
    title: "Focus Timer",
    description: "Boost productivity with customizable Pomodoro timers and focus sessions.",
    badge: "Popular"
  },
  {
    icon: <Calendar className="h-10 w-10 text-[#ADEFD1]" />,
    title: "Smart Scheduling",
    description: "Plan your day efficiently with AI-powered scheduling suggestions.",
    badge: "Plus Plan"
  },
  {
    icon: <Edit className="h-10 w-10 text-[#ADEFD1]" />,
    title: "Journaling Space",
    description: "Reflect, write, and organize your thoughts with our rich text editor.",
    badge: "Core Feature"
  },
  {
    icon: <BarChart className="h-10 w-10 text-[#ADEFD1]" />,
    title: "Progress Analytics",
    description: "Track your productivity patterns and identify areas for improvement.",
    badge: "Pro Plan"
  },
  {
    icon: <Zap className="h-10 w-10 text-[#ADEFD1]" />,
    title: "Distraction Blocker",
    description: "Eliminate digital distractions during focus sessions for maximum productivity.",
    badge: "Popular"
  },
  {
    icon: <Target className="h-10 w-10 text-[#ADEFD1]" />,
    title: "Goal Setting & Tracking",
    description: "Set and track long-term goals with measurable milestones and deadlines.",
    badge: "Plus Plan"
  },
  {
    icon: <Brain className="h-10 w-10 text-[#ADEFD1]" />,
    title: "AI-Powered Insights",
    description: "Get personalized tips and suggestions to optimize your workflow.",
    badge: "Pro Plan"
  }
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-4xl font-bold mb-6 text-[#00203F]">
            Everything You Need to <span className="gradient-text">Boost Productivity</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Project Sahur combines powerful features to help you manage tasks, stay focused, and achieve your goals faster than ever before.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featureItems.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="feature-card border-[#00203F]/10 h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-[#00203F]/5">
                      {feature.icon}
                    </div>
                    <Badge variant={feature.badge.includes("Plan") ? "default" : "secondary"} className={feature.badge.includes("Plan") ? "bg-[#00203F] text-white" : "bg-[#ADEFD1] text-[#00203F]"}>
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-[#00203F]">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
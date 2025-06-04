import React from "react";
import { motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckSquare, Zap, Target, Brain, Edit, BookCopy, PenLine as SchoolIcon, Palette, Users, MessageSquare, BarChart } from 'lucide-react';
import { useTheme } from "@/contexts/ThemeContext";

const Features = () => {
  const { theme } = useTheme();

  const iconContainerBg = theme === 'dark' ? "bg-primary/10" : "bg-secondary/10";
  const iconColor = theme === 'dark' ? "text-primary" : "text-secondary"; 
  const titleColor = theme === 'dark' ? "text-foreground" : "text-foreground";
  const descriptionColor = theme === 'dark' ? "text-muted-foreground" : "text-muted-foreground";
  const badgeMainBg = theme === 'dark' ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground";
  const badgePopularBg = theme === 'dark' ? "bg-accent text-accent-foreground" : "bg-accent text-accent-foreground";
  const sectionBg = theme === 'dark' ? 'bg-card' : 'bg-background';

  const featureItems = [
    {
      icon: <CheckSquare className={`h-8 w-8 ${iconColor}`} />,
      title: "Intuitive Task Management",
      description: "Effortlessly create, organize, and prioritize tasks with a clean, user-friendly interface.",
      badge: "Core"
    },
    {
      icon: <Clock className={`h-8 w-8 ${iconColor}`} />,
      title: "Smart Focus Timer",
      description: "Boost productivity with customizable Pomodoro timers and adaptive focus sessions.",
      badge: "Popular"
    },
    {
      icon: <SchoolIcon className={`h-8 w-8 ${iconColor}`} />,
      title: "School Hub",
      description: "Organize assignments, track deadlines, and manage your academic workload effectively.",
      badge: "Students Love It!"
    },
    {
      icon: <Edit className={`h-8 w-8 ${iconColor}`} />,
      title: "Reflective Journaling",
      description: "Capture thoughts, reflections, and ideas with a rich text editor and inspiring prompts.",
      badge: "Core"
    },
    {
      icon: <BookCopy className={`h-8 w-8 ${iconColor}`} />,
      title: "Flashcards with SRS",
      description: "Create digital flashcards and learn efficiently using a Spaced Repetition System.",
      badge: "New!"
    },
    {
      icon: <MessageSquare className={`h-8 w-8 ${iconColor}`} />,
      title: "AI Assistant",
      description: "Get smart suggestions, summarize notes, and brainstorm ideas with your AI partner.",
      badge: "Pro Plan"
    },
    {
      icon: <Target className={`h-8 w-8 ${iconColor}`} />,
      title: "Goal Setting",
      description: "Define, track, and achieve your long-term goals with clear milestones.",
      badge: "Plus Plan"
    },
    {
      icon: <Palette className={`h-8 w-8 ${iconColor}`} />,
      title: "Customizable Themes",
      description: "Personalize your workspace with light and dark modes, and accent colors.",
      badge: "Essential"
    }
  ];
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <section id="features" className={`py-20 md:py-28 ${sectionBg}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "circOut" }}
        >
          <Badge variant="secondary" className={`mb-4 ${badgeMainBg} text-xs px-3 py-1 shadow-sm`}>Powerful Features</Badge>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 ${titleColor}`}>
            Everything You Need to <span className="gradient-text">Excel</span>
          </h2>
          <p className={`text-base md:text-lg ${descriptionColor} max-w-2xl mx-auto`}>
            Project Sahur is packed with features designed to streamline your workflow, boost focus, and help you achieve your academic and personal goals.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featureItems.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="feature-card h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2.5 rounded-lg ${iconContainerBg}`}>
                      {feature.icon}
                    </div>
                    {feature.badge && 
                      <Badge 
                        variant={feature.badge.includes("Plan") ? "outline" : "default"} 
                        className={`text-[10px] px-2 py-0.5 ${
                          feature.badge === "Popular" || feature.badge === "New!" || feature.badge === "Students Love It!"
                            ? badgePopularBg 
                            : (feature.badge.includes("Plan") ? "border-accent text-accent" : badgeMainBg)
                        }`}
                      >
                        {feature.badge}
                      </Badge>
                    }
                  </div>
                  <CardTitle className={`text-lg font-semibold ${titleColor}`}>{feature.title}</CardTitle>
                </CardHeader>
                <CardDescription className={`px-6 pb-5 text-sm flex-grow ${descriptionColor}`}>
                  {feature.description}
                </CardDescription>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Pricing = () => {
  const { theme } = useTheme();

  const sectionBg = theme === 'dark' ? 'bg-background' : 'bg-muted/40';
  const cardBg = theme === 'dark' ? 'bg-card' : 'bg-card';
  const cardBorder = theme === 'dark' ? 'border-border' : 'border-border';
  const popularCardBorder = theme === 'dark' ? 'border-primary shadow-primary/20' : 'border-primary shadow-primary/20';
  const titleColor = theme === 'dark' ? 'text-foreground' : 'text-foreground';
  const priceColor = theme === 'dark' ? 'text-primary' : 'text-primary'; 
  const descriptionColor = theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground';
  const featureTextColor = theme === 'dark' ? 'text-muted-foreground' : 'text-foreground';
  const checkIconColor = theme === 'dark' ? 'text-primary' : 'text-primary'; 
  const buttonPopularClass = theme === 'dark' ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg' : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg';
  const buttonDefaultClass = theme === 'dark' ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground';
  const popularBadgeBg = theme === 'dark' ? 'bg-accent text-accent-foreground' : 'bg-accent text-accent-foreground';
  const mainBadgeBg = theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground';


  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "For individuals getting started with enhanced productivity.",
      features: [
        "Core Task Management",
        "Standard Focus Timer",
        "School Work (Basic)",
        "Notes (Up to 10)",
        "Flashcards (Up to 2 Decks)",
        "Community Support"
      ],
      buttonText: "Get Started Free",
      popular: false,
      ctaLink: "/auth"
    },
    {
      name: "Plus",
      price: "$7",
      period: "per month",
      description: "For power users & students needing more features.",
      features: [
        "Everything in Free, plus:",
        "Advanced Task Management",
        "Customizable Focus Sessions",
        "School Work (Advanced, with tracking)",
        "Notes (Unlimited, Markdown)",
        "Flashcards (Unlimited Decks, SRS)",
        "Goal Setting & Tracking",
        "Priority Email Support"
      ],
      buttonText: "Start 14-Day Trial",
      popular: true,
      ctaLink: "/subscribe?plan=plus"
    },
    {
      name: "Pro",
      price: "$15",
      period: "per month",
      description: "For professionals & teams demanding the best.",
      features: [
        "Everything in Plus, plus:",
        "Progress Analytics & Reports",
        "AI-Powered Insights & Chat",
        "Advanced Distraction Blocker",
        "Team Collaboration (Up to 5 users)",
        "API Access (Coming Soon)",
        "Dedicated Support Manager"
      ],
      buttonText: "Choose Pro Plan",
      popular: false,
      ctaLink: "/subscribe?plan=pro"
    }
  ];


  return (
    <section id="pricing" className={`py-20 md:py-28 ${sectionBg}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "circOut" }}
        >
          <Badge variant="secondary" className={`mb-4 ${mainBadgeBg} text-xs px-3 py-1 shadow-sm`}>Pricing Plans</Badge>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 ${titleColor}`}>
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className={`text-base md:text-lg ${descriptionColor} max-w-2xl mx-auto`}>
            Choose the plan that fits your needs. Unlock your potential with Project Sahur's flexible options.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20, scale:0.95 }}
              whileInView={{ opacity: 1, y: 0, scale:1 }}
              viewport={{ once: true, amount:0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className={`relative flex flex-col ${plan.popular ? 'lg:-translate-y-3' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <Badge className={`${popularBadgeBg} px-3 py-1 text-xs shadow-md`}>Most Popular</Badge>
                </div>
              )}
              <Card className={`h-full flex flex-col ${cardBg} border ${plan.popular ? popularCardBorder : cardBorder} shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl`}>
                <CardHeader className="pb-5 pt-8 text-center">
                  <CardTitle className={`text-2xl font-semibold ${titleColor}`}>{plan.name}</CardTitle>
                  <div className="mt-3">
                    <span className={`text-4xl font-extrabold ${priceColor}`}>{plan.price}</span>
                    {plan.period && <span className={`ml-1 text-sm ${descriptionColor}`}>{plan.period}</span>}
                  </div>
                  <CardDescription className={`mt-3 ${descriptionColor} text-sm min-h-[3em]`}>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pt-4 pb-6 px-6">
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <Check className={`h-4 w-4 ${checkIconColor} mr-2.5 shrink-0 mt-1`} />
                        <span className={`${featureTextColor}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-5 pb-8 px-6">
                  <Link to={plan.ctaLink} className="w-full">
                    <Button 
                      size="lg"
                      className={`w-full text-base py-3 ${plan.popular 
                        ? buttonPopularClass 
                        : buttonDefaultClass} transition-all duration-200 ease-out`}
                    >
                      {plan.buttonText} <Zap className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
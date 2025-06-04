import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals getting started",
    features: [
      "Basic Task Management",
      "Standard Focus Timer",
      "Journaling (Plain Text)",
      "Notes (Up to 10)",
      "1 Project Limit",
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
    description: "For power users & small teams",
    features: [
      "Everything in Free, plus:",
      "Advanced Task Management",
      "Customizable Focus Sessions",
      "Journaling (Rich Text)",
      "Notes (Unlimited)",
      "Smart Scheduling Assistant",
      "Goal Setting & Tracking",
      "5 Project Limits",
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
    description: "For professionals & growing teams",
    features: [
      "Everything in Plus, plus:",
      "Progress Analytics & Reports",
      "AI-Powered Insights",
      "Distraction Blocker Suite",
      "Unlimited Projects",
      "Team Collaboration (Up to 5 users)",
      "API Access",
      "Dedicated Support Manager"
    ],
    buttonText: "Choose Pro Plan",
    popular: false,
    ctaLink: "/subscribe?plan=pro"
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-[#ADEFD1] text-[#00203F]">Pricing</Badge>
          <h2 className="text-4xl font-bold mb-6 text-[#00203F]">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Unlock your potential with Project Sahur.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <Badge className="bg-[#00203F] text-white px-4 py-1.5 text-sm shadow-lg">Most Popular</Badge>
                </div>
              )}
              <Card className={`h-full flex flex-col border-2 ${plan.popular ? 'border-[#00203F] shadow-2xl' : 'border-gray-200'}`}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-3xl font-bold text-[#00203F]">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-5xl font-extrabold text-[#00203F]">{plan.price}</span>
                    {plan.period && <span className="text-gray-500 ml-1 text-lg">{plan.period}</span>}
                  </div>
                  <CardDescription className="mt-3 text-gray-600 min-h-[40px]">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pt-2 pb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-[#ADEFD1] mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Link to={plan.ctaLink} className="w-full">
                    <Button 
                      className={`w-full text-lg py-6 ${plan.popular 
                        ? 'bg-[#00203F] hover:bg-[#00203F]/90 text-white shadow-md' 
                        : 'bg-[#ADEFD1] hover:bg-[#ADEFD1]/90 text-[#00203F]'}`}
                    >
                      {plan.buttonText} <Zap className="ml-2 h-5 w-5" />
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

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, ShieldCheck, MessageSquare, Infinity as InfinityIcon } from 'lucide-react';
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

const subscriptionPlansData = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Essential tools to kickstart your productivity journey.",
    features: [
      "Basic Task Management",
      "Standard Focus Timer",
      "Unlimited Journaling (Plain Text)",
      "Unlimited Notes (Plain Text)",
      "Unlimited Calendar Events",
      "1 Project Limit",
      "Community Support",
      "Limited AI Chat (5 messages/day)"
    ],
    buttonText: "Continue with Free",
    popular: false,
    highlightColor: "border-gray-300",
    buttonClass: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    priceId: null 
  },
  {
    id: "plus",
    name: "Plus",
    price: "$7",
    period: "per month",
    description: "Unlock more power with advanced features and AI assistance.",
    features: [
      "Everything in Free, plus:",
      "Advanced Task Management",
      "Customizable Focus Sessions",
      "Journaling (Rich Text Editor)",
      "Notes (Rich Text Editor)",
      "Smart Scheduling Assistant",
      "Goal Setting & Tracking",
      "5 Project Limits",
      "Priority Email Support",
      "AI Chat (100 messages/day)"
    ],
    buttonText: "Start 14-Day Plus Trial",
    popular: true,
    highlightColor: "border-[#00203F]",
    buttonClass: "bg-[#00203F] text-white hover:bg-[#00203F]/90",
    priceId: "YOUR_PLUS_PRICE_ID" // Replace with actual Stripe Price ID
  },
  {
    id: "pro",
    name: "Pro",
    price: "$15",
    period: "per month",
    description: "The ultimate suite for professionals and teams aiming for peak productivity.",
    features: [
      "Everything in Plus, plus:",
      "Progress Analytics & Reports",
      "AI-Powered Insights & Suggestions",
      "Advanced Distraction Blocker Suite",
      "Unlimited Projects",
      "Team Collaboration (Up to 5 users)",
      "API Access (Coming Soon)",
      "Dedicated Support Manager",
      "Unlimited AI Chat"
    ],
    buttonText: "Choose Pro Plan",
    popular: false,
    highlightColor: "border-gray-500",
    buttonClass: "bg-gray-700 text-white hover:bg-gray-600",
    priceId: "YOUR_PRO_PRICE_ID" // Replace with actual Stripe Price ID
  }
];

const SubscriptionPage = () => {
  const [searchParams] = useSearchParams();
  const selectedPlanId = searchParams.get('plan');
  const { toast } = useToast();

  const handleSubscription = (plan) => {
    if (!plan.priceId || plan.priceId.startsWith("YOUR_")) { // Check if placeholder ID is still there
      toast({
        title: `Switched to ${plan.name} Plan!`,
        description: "You are now on the Free plan.",
      });
      localStorage.setItem('userSubscriptionPlan', plan.id);
      // Simulate AI message limits for localStorage
      if (plan.id === 'free') localStorage.setItem('aiMessageLimit', '5');
      else if (plan.id === 'plus') localStorage.setItem('aiMessageLimit', '100');
      else localStorage.removeItem('aiMessageLimit'); // Pro is unlimited
      localStorage.setItem('aiMessageCount', '0');
      localStorage.setItem('aiMessageLastReset', new Date().toISOString().split('T')[0]);
      return;
    }
    
    // This part will be for actual Stripe integration.
    // For now, it reminds the user to provide keys.
    toast({
      title: "Stripe Integration Required",
      description: "Please provide your Stripe Publishable Key and Price IDs to the AI assistant to enable paid subscriptions.",
      variant: "destructive",
      duration: 10000,
    });
    console.log(`Attempting to subscribe to ${plan.name} with Price ID: ${plan.priceId}. Waiting for Stripe keys.`);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <section className="py-16 md:py-24 hero-pattern">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4 bg-[#ADEFD1] text-[#00203F] px-4 py-1.5 text-sm">Choose Your Plan</Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                Unlock Your <span className="text-[#ADEFD1]">Full Potential</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Select the Project Sahur plan that best suits your productivity needs. Simple, transparent pricing with no hidden fees.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
              {subscriptionPlansData.map((plan, index) => (
                <motion.div 
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col ${plan.popular ? 'md:-mt-6 md:mb-6 z-10' : ''} ${selectedPlanId === plan.id ? 'ring-4 ring-offset-2 ring-[#ADEFD1]' : ''} rounded-xl`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#ADEFD1] text-[#00203F] px-4 py-1.5 text-sm shadow-lg flex items-center">
                        <Star className="h-4 w-4 mr-1.5 fill-current" /> Most Popular
                      </Badge>
                    </div>
                  )}
                  <Card className={`h-full flex flex-col border-2 ${plan.popular ? plan.highlightColor + ' shadow-2xl' : plan.highlightColor} rounded-xl`}>
                    <CardHeader className="pb-4 text-center bg-gray-50 rounded-t-xl">
                      <CardTitle className="text-3xl font-bold text-[#00203F]">{plan.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-5xl font-extrabold text-[#00203F]">{plan.price}</span>
                        {plan.period && <span className="text-gray-500 ml-1 text-lg">{plan.period}</span>}
                      </div>
                      <CardDescription className="mt-3 text-gray-600 min-h-[60px] px-2">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pt-6 pb-6 bg-white">
                      <ul className="space-y-3.5">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            {feature.toLowerCase().includes("unlimited ai chat") ? 
                              <InfinityIcon className="h-5 w-5 text-green-500 mr-2.5 shrink-0 mt-0.5" /> :
                            feature.toLowerCase().includes("ai chat") ?
                              <MessageSquare className="h-5 w-5 text-green-500 mr-2.5 shrink-0 mt-0.5" /> :
                              <Check className="h-5 w-5 text-green-500 mr-2.5 shrink-0 mt-0.5" />
                            }
                            <span className="text-gray-700 text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-6 pb-6 bg-gray-50 rounded-b-xl mt-auto">
                      <Button 
                        onClick={() => handleSubscription(plan)}
                        className={`w-full text-lg py-6 shadow-md transition-transform duration-150 ease-in-out hover:scale-105 ${plan.buttonClass}`}
                      >
                        {plan.buttonText} <Zap className="ml-2 h-5 w-5" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y:20 }}
              animate={{ opacity: 1, y:0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-600 text-lg mb-2">All paid plans come with a 14-day money-back guarantee.</p>
              <p className="text-gray-500">
                <ShieldCheck className="inline h-5 w-5 mr-1 text-green-600" /> Secure payments processed by Stripe (when integrated).
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
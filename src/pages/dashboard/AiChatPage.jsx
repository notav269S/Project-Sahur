
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, User, Bot, AlertTriangle, Zap, MessageSquare } from 'lucide-react'; // Added MessageSquare here
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const AiChatPage = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [messageCount, setMessageCount] = useState(0);
  const [messageLimit, setMessageLimit] = useState(Infinity); // Default to Pro (unlimited)
  const [lastResetDate, setLastResetDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPlan, setCurrentPlan] = useState('free');


  useEffect(() => {
    const plan = localStorage.getItem('userSubscriptionPlan') || 'free';
    setCurrentPlan(plan);
    const storedLimit = localStorage.getItem('aiMessageLimit');
    const storedCount = localStorage.getItem('aiMessageCount');
    const storedResetDate = localStorage.getItem('aiMessageLastReset');

    const today = new Date().toISOString().split('T')[0];

    if (storedResetDate !== today) {
      // Reset daily count
      localStorage.setItem('aiMessageCount', '0');
      localStorage.setItem('aiMessageLastReset', today);
      setMessageCount(0);
      setLastResetDate(today);
    } else {
      setMessageCount(storedCount ? parseInt(storedCount, 10) : 0);
      setLastResetDate(storedResetDate);
    }
    
    if (plan === 'free') setMessageLimit(5);
    else if (plan === 'plus') setMessageLimit(100);
    else setMessageLimit(Infinity); // Pro or if not set

  }, []);

  useEffect(() => {
    localStorage.setItem('aiMessageCount', messageCount.toString());
  }, [messageCount]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    if (messageCount >= messageLimit && messageLimit !== Infinity) {
      toast({
        title: "Daily AI Message Limit Reached",
        description: (
          <div>
            You've used all your AI messages for today on the {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} plan.
            <Link to="/subscribe" className="ml-2 underline text-[#ADEFD1]">Upgrade for more.</Link>
          </div>
        ),
        variant: "destructive",
        duration: 7000,
      });
      return;
    }

    const newUserMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: `This is a simulated AI response to: "${newUserMessage.text}". Real AI integration would go here. You have ${messageLimit === Infinity ? 'unlimited' : messageLimit - (messageCount +1)} messages left today.`,
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      if (messageLimit !== Infinity) {
        setMessageCount(prev => prev + 1);
      }
    }, 1000 + Math.random() * 1000);
  };

  const remainingMessages = messageLimit === Infinity ? 'Unlimited' : Math.max(0, messageLimit - messageCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 h-full flex flex-col text-[#ADEFD1]"
    >
      <Card className="widget-card flex-grow flex flex-col overflow-hidden">
        <CardHeader className="border-b border-[#ADEFD1]/20 p-4">
          <CardTitle className="text-xl text-white flex items-center">
            <Bot className="mr-2 h-6 w-6" /> AI Assistant
          </CardTitle>
          <p className="text-xs text-gray-400">
            Messages remaining today: {remainingMessages}
            {currentPlan !== 'pro' && messageLimit !== Infinity && (
              <Link to="/subscribe" className="ml-2 underline hover:text-[#ADEFD1]">Upgrade <Zap className="inline h-3 w-3"/></Link>
            )}
          </p>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Ask me anything!</p>
              <p className="text-sm">I can help with productivity tips, brainstorming, and more.</p>
            </div>
          )}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-xl ${
                  msg.sender === 'user'
                    ? 'bg-[#ADEFD1] text-[#00203F]'
                    : 'bg-[#00203F]/70 border border-[#ADEFD1]/30 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t border-[#ADEFD1]/20">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
              className="bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || input.trim() === ''} className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Bot className="h-5 w-5" />
                </motion.div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AiChatPage;

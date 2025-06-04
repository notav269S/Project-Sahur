import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "How does Project Sahur help improve productivity?",
    answer: "Project Sahur offers a suite of integrated tools including smart task management, Pomodoro-based focus timers, comprehensive schoolwork planning, and reflective journaling, all designed to create an optimal environment for productivity. Our app helps you organize tasks efficiently, maintain deep focus during work sessions, and track your progress effectively over time."
  },
  {
    question: "Can I use Project Sahur on multiple devices?",
    answer: "Yes! With backend integration (like Supabase), Project Sahur is designed to sync seamlessly across all your devices. You can start a task on your desktop and continue on your mobile device without missing a beat. Your data remains consistently up-to-date, ensuring a fluid experience no matter which device you're using."
  },
  {
    question: "Is there a limit to how many tasks or notes I can create?",
    answer: "Our Free plan provides generous limits suitable for most personal use cases. For users needing more capacity, our Plus and Pro plans offer significantly higher or unlimited allowances for tasks, notes, projects, flashcard decks, and other advanced features, catering to even the most demanding workflows."
  },
  {
    question: "How does the focus timer work?",
    answer: "The focus timer in Project Sahur is inspired by the Pomodoro Technique, which alternates focused work sessions with short, refreshing breaks. You have full control to customize the duration of work sessions and breaks, allowing you to tailor the timer to your personal productivity rhythm and work style for maximum effectiveness."
  },
  {
    question: "How does the Flashcards feature with Spaced Repetition (SRS) work?",
    answer: "Create digital flashcards for any subject you're studying. Project Sahur's integrated Spaced Repetition System (SRS) then intelligently schedules cards for review at optimal intervals. This scientific approach helps reinforce learning and improves memory retention, making your study sessions far more efficient."
  },
  {
    question: "How secure is my data with Project Sahur?",
    answer: "Data security is a top priority at Project Sahur. When connected to a robust backend service like Supabase, all your data is encrypted both in transit (using TLS/SSL) and at rest (using AES-256 or similar). We adhere to industry-standard security best practices to ensure your information remains private, protected, and confidential."
  }
];

const FAQItem = ({ item, index }) => {
  const [isOpen, setIsOpen] = React.useState(index === 0); // Open first item by default
  const { theme } = useTheme();
  const questionColor = theme === 'dark' ? 'text-foreground' : 'text-foreground';
  const answerColor = theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-5 flex justify-between items-center focus:outline-none"
      >
        <h3 className={`text-base md:text-lg font-medium ${questionColor}`}>{item.question}</h3>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className={`${answerColor} pb-5 text-sm md:text-base leading-relaxed`}>{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {index < faqItems.length - 1 && <Separator className={theme === 'dark' ? 'border-border/50' : 'border-border/50'}/>}
    </motion.div>
  );
};


const FAQ = () => {
  const { theme } = useTheme();
  const sectionBg = theme === 'dark' ? 'bg-card' : 'bg-background';
  const titleColor = theme === 'dark' ? 'text-foreground' : 'text-foreground';
  const textColor = theme === 'dark' ? 'text-muted-foreground' : 'text-muted-foreground';
  const badgeBg = theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground';


  return (
    <section id="faq" className={`py-20 md:py-28 ${sectionBg}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "circOut" }}
        >
          <Badge variant="secondary" className={`mb-4 ${badgeBg} text-xs px-3 py-1 shadow-sm`}>Help & Support</Badge>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 ${titleColor}`}>
            Frequently Asked <span className="gradient-text-alt">Questions</span>
          </h2>
          <p className={`text-base md:text-lg ${textColor} max-w-2xl mx-auto`}>
            Find answers to common questions about Project Sahur, its features, and how it can enhance your productivity.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto bg-card shadow-xl rounded-xl p-2 md:p-4">
          {faqItems.map((item, index) => (
            <FAQItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
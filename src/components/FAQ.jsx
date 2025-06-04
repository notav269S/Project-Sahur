
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const faqItems = [
  {
    question: "How does Focusify help improve productivity?",
    answer: "Focusify combines task management, focus timers, and distraction blocking to create an optimal productivity environment. Our app helps you organize tasks, maintain focus during work sessions, and track your progress over time."
  },
  {
    question: "Can I use Focusify on multiple devices?",
    answer: "Yes! Focusify syncs across all your devices. You can start a task on your desktop and continue on your mobile device seamlessly. Your data is always up-to-date no matter which device you're using."
  },
  {
    question: "Is there a limit to how many tasks I can create?",
    answer: "Free accounts can create up to 50 active tasks and 3 projects. Pro and Team accounts have unlimited tasks and projects, allowing you to organize your work without restrictions."
  },
  {
    question: "How does the focus timer work?",
    answer: "Our focus timer is based on the Pomodoro Technique, alternating between focused work sessions and short breaks. You can customize the duration of work sessions and breaks to match your personal productivity rhythm."
  },
  {
    question: "Can I share my tasks with team members?",
    answer: "Task sharing is available on Team plans. You can assign tasks to team members, set deadlines, and track progress collaboratively. This feature is not available on Free or Pro plans."
  },
  {
    question: "How secure is my data with Focusify?",
    answer: "We take data security seriously. All your data is encrypted both in transit and at rest. We use industry-standard security practices and regular security audits to ensure your information remains private and protected."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-[#ADEFD1] text-[#00203F]">FAQ</Badge>
          <h2 className="text-4xl font-bold mb-6 text-[#00203F]">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Focusify and how it can help boost your productivity.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="py-6">
                <h3 className="text-xl font-semibold text-[#00203F] mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
              {index < faqItems.length - 1 && <Separator />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

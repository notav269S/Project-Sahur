
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle, Smile, Meh, Frown, AlertTriangle, BarChart2, CalendarDays, Edit3, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const moodQuestions = [
  "How would you rate your overall mood today?",
  "How focused did you feel today?",
  "How energetic were you today?",
  "How would you rate your sleep quality last night?",
  "How connected did you feel to others today?"
];

const moodOptions = [
  { label: "Very Poor", value: 1, icon: <Frown className="h-6 w-6 text-red-500" /> },
  { label: "Poor", value: 2, icon: <Frown className="h-6 w-6 text-orange-500" /> },
  { label: "Average", value: 3, icon: <Meh className="h-6 w-6 text-yellow-500" /> },
  { label: "Good", value: 4, icon: <Smile className="h-6 w-6 text-lime-500" /> },
  { label: "Excellent", value: 5, icon: <Smile className="h-6 w-6 text-green-500" /> }
];

const MindfulnessPage = () => {
  const { toast } = useToast();
  const [moodLog, setMoodLog] = useState([]);
  const [currentAnswers, setCurrentAnswers] = useState(Array(moodQuestions.length).fill(null));
  const [currentStep, setCurrentStep] = useState(0);
  const [showLogForm, setShowLogForm] = useState(true);
  const [editingLogId, setEditingLogId] = useState(null);
  const [view, setView] = useState('log'); // 'log', 'calendar', 'stats'
  const [selectedDateForCalendar, setSelectedDateForCalendar] = useState(new Date());

  useEffect(() => {
    const storedLog = localStorage.getItem("projectSahurMindfulnessLog");
    if (storedLog) {
      setMoodLog(JSON.parse(storedLog));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projectSahurMindfulnessLog", JSON.stringify(moodLog));
  }, [moodLog]);

  const handleAnswerSelect = (answerValue) => {
    const newAnswers = [...currentAnswers];
    newAnswers[currentStep] = answerValue;
    setCurrentAnswers(newAnswers);
    if (currentStep < moodQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmitLog = () => {
    if (currentAnswers.some(answer => answer === null)) {
      toast({ title: "Incomplete Log", description: "Please answer all questions.", variant: "destructive" });
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const existingEntryForToday = moodLog.find(entry => entry.date === today && entry.id !== editingLogId);

    if (existingEntryForToday && !editingLogId) {
        toast({ title: "Log Exists", description: "You've already logged your mood for today. You can edit it from the log history.", variant: "destructive" });
        return;
    }
    
    if (editingLogId) {
        setMoodLog(moodLog.map(entry => entry.id === editingLogId ? {...entry, answers: currentAnswers} : entry));
        toast({ title: "Log Updated!", description: "Your mood log has been updated." });
    } else {
        const newLogEntry = {
          id: uuidv4(),
          date: today,
          answers: currentAnswers,
          averageMood: currentAnswers.reduce((sum, val) => sum + val, 0) / currentAnswers.length
        };
        setMoodLog([newLogEntry, ...moodLog]);
        toast({ title: "Mood Logged!", description: "Thanks for checking in with yourself." });
    }
    
    setCurrentAnswers(Array(moodQuestions.length).fill(null));
    setCurrentStep(0);
    setShowLogForm(false);
    setEditingLogId(null);
  };

  const handleEditLog = (logEntry) => {
    setCurrentAnswers(logEntry.answers);
    setEditingLogId(logEntry.id);
    setCurrentStep(0);
    setShowLogForm(true);
    setView('log');
  };
  
  const handleDeleteLog = (id) => {
    setMoodLog(moodLog.filter(entry => entry.id !== id));
    toast({ title: "Log Deleted", description: "The mood log entry has been removed." });
  };

  const startNewLog = () => {
    setCurrentAnswers(Array(moodQuestions.length).fill(null));
    setCurrentStep(0);
    setShowLogForm(true);
    setEditingLogId(null);
    setView('log');
  };
  
  const getAverageMoodForDate = (date) => {
    const entry = moodLog.find(e => isSameDay(parseISO(e.date), date));
    return entry ? entry.averageMood : null;
  };

  const renderCalendarView = () => {
    const monthStart = startOfMonth(selectedDateForCalendar);
    const monthEnd = endOfMonth(selectedDateForCalendar);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const firstDayOfMonth = monthStart.getDay();

    const moodColor = (avgMood) => {
      if (!avgMood) return 'bg-card-foreground/10';
      if (avgMood < 2) return 'bg-red-500/70';
      if (avgMood < 3) return 'bg-orange-500/70';
      if (avgMood < 4) return 'bg-yellow-500/70';
      if (avgMood < 4.5) return 'bg-lime-500/70';
      return 'bg-green-500/70';
    };
    
    return (
      <Card className="widget-card mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <Button variant="ghost" onClick={() => setSelectedDateForCalendar(prev => new Date(prev.setMonth(prev.getMonth() - 1)))}>Prev</Button>
          <CardTitle className="text-xl text-center">{format(selectedDateForCalendar, 'MMMM yyyy')}</CardTitle>
          <Button variant="ghost" onClick={() => setSelectedDateForCalendar(prev => new Date(prev.setMonth(prev.getMonth() + 1)))}>Next</Button>
        </CardHeader>
        <CardContent className="grid grid-cols-7 gap-1 p-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="font-semibold text-center text-xs p-1">{day}</div>)}
          {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`} className="border border-border/20 rounded-sm h-12"></div>)}
          {daysInMonth.map(day => {
            const avgMood = getAverageMoodForDate(day);
            return (
              <div key={day.toString()} className={`border border-border/20 rounded-sm h-12 flex items-center justify-center ${moodColor(avgMood)}`}>
                <span className="text-sm">{format(day, 'd')}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };
  
  const renderStatsView = () => {
    if (moodLog.length === 0) return <p className="text-center text-muted-foreground mt-4">No data for statistics yet.</p>;
    const overallAverage = moodLog.reduce((sum, entry) => sum + entry.averageMood, 0) / moodLog.length;
    // More complex stats can be added here
    return (
      <Card className="widget-card mt-6">
        <CardHeader><CardTitle>Mood Statistics</CardTitle></CardHeader>
        <CardContent>
          <p>Overall Average Mood: {overallAverage.toFixed(2)} / 5</p>
          <p>Total Logs: {moodLog.length}</p>
          {/* Placeholder for charts */}
          <div className="h-40 bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground mt-4">Chart Placeholder</div>
        </CardContent>
      </Card>
    );
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 text-foreground"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">Mindfulness Log</h1>
        <div className="flex gap-2">
            <Button onClick={startNewLog} className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90">
                {editingLogId ? "Edit Current Log" : "Log Today's Mood"}
            </Button>
            <Button variant="outline" onClick={() => setView('calendar')} className={view === 'calendar' ? 'bg-accent' : ''}><CalendarDays className="mr-2 h-4 w-4"/>Calendar</Button>
            <Button variant="outline" onClick={() => setView('stats')} className={view === 'stats' ? 'bg-accent' : ''}><BarChart2 className="mr-2 h-4 w-4"/>Stats</Button>
        </div>
      </div>

      {showLogForm && view === 'log' && (
        <Card className="widget-card mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-center">{editingLogId ? "Edit Your Mood Log" : moodQuestions[currentStep]}</CardTitle>
            <p className="text-sm text-muted-foreground text-center">Question {currentStep + 1} of {moodQuestions.length}</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 py-8">
            <div className="flex justify-center space-x-2 sm:space-x-4">
              {moodOptions.map(option => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAnswerSelect(option.value)}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${currentAnswers[currentStep] === option.value ? 'border-primary dark:border-secondary ring-2 ring-primary dark:ring-secondary shadow-lg' : 'border-border hover:border-primary/50 dark:hover:border-secondary/50'}`}
                  title={option.label}
                >
                  {option.icon}
                </motion.button>
              ))}
            </div>
          </CardContent>
          {currentStep === moodQuestions.length - 1 && currentAnswers.every(a => a !== null) && (
            <CardFooter className="flex justify-center">
              <Button onClick={handleSubmitLog} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90">
                <CheckCircle className="mr-2 h-5 w-5" /> {editingLogId ? "Update Log" : "Complete Log"}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
      
      {view === 'calendar' && renderCalendarView()}
      {view === 'stats' && renderStatsView()}

      {!showLogForm && view === 'log' && moodLog.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Log History</h2>
          <div className="space-y-4">
            {moodLog.sort((a,b) => new Date(b.date) - new Date(a.date)).map(entry => (
              <Card key={entry.id} className="widget-card">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{format(parseISO(entry.date), 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">Average Mood: {entry.averageMood.toFixed(1)}/5</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditLog(entry)} className="text-primary dark:text-secondary hover:bg-primary/10 dark:hover:bg-secondary/10"><Edit3 className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLog(entry.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-5 w-5"/></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {!showLogForm && view === 'log' && moodLog.length === 0 && (
         <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground mt-12 p-8 border-2 border-dashed border-border rounded-xl"
        >
          <AlertTriangle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">No mood logs yet.</p>
          <p className="text-base">Start logging your mood daily to track your well-being!</p>
        </motion.div>
      )}

    </motion.div>
  );
};

export default MindfulnessPage;

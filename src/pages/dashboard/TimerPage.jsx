import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings, SkipForward, Coffee, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";

const TimerPage = () => {
  const { toast } = useToast();
  
  const loadSettings = () => {
    const saved = localStorage.getItem("projectSahurTimerSettings");
    return saved ? JSON.parse(saved) : { work: 25, shortBreak: 5, longBreak: 15, autoStartBreaks: false, autoStartPomodoros: false, longBreakInterval: 4 };
  };

  const [settings, setSettings] = useState(loadSettings);
  const [mode, setMode] = useState("work"); // 'work', 'shortBreak', 'longBreak'
  const [minutes, setMinutes] = useState(settings.work);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("projectSahurTimerSettings", JSON.stringify(settings));
    // Reset timer if settings change and timer is not active
    if (!isActive) {
      if (mode === 'work') setMinutes(settings.work);
      else if (mode === 'shortBreak') setMinutes(settings.shortBreak);
      else if (mode === 'longBreak') setMinutes(settings.longBreak);
      setSeconds(0);
    }
  }, [settings, isActive, mode]);

  const handleTimerEnd = useCallback(() => {
    setIsActive(false);
    toast({ title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} session ended!`, variant: "default" });

    if (mode === 'work') {
      const newPomodorosCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newPomodorosCompleted);
      if (newPomodorosCompleted % settings.longBreakInterval === 0) {
        setMode('longBreak');
        setMinutes(settings.longBreak);
        if (settings.autoStartBreaks) setIsActive(true);
      } else {
        setMode('shortBreak');
        setMinutes(settings.shortBreak);
        if (settings.autoStartBreaks) setIsActive(true);
      }
    } else { // break ended
      setMode('work');
      setMinutes(settings.work);
      if (settings.autoStartPomodoros) setIsActive(true);
    }
    setSeconds(0);
  }, [mode, pomodorosCompleted, settings, toast]);


  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerEnd();
          } else {
            setMinutes(m => m - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, handleTimerEnd]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') setMinutes(settings.work);
    else if (mode === 'shortBreak') setMinutes(settings.shortBreak);
    else setMinutes(settings.longBreak);
    setSeconds(0);
  };

  const skipSession = () => {
    handleTimerEnd();
  };

  const selectMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'work') setMinutes(settings.work);
    else if (newMode === 'shortBreak') setMinutes(settings.shortBreak);
    else setMinutes(settings.longBreak);
    setSeconds(0);
  };
  
  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const modeConfig = {
    work: { title: "Focus Session", icon: <Brain className="mr-2 h-5 w-5" /> },
    shortBreak: { title: "Short Break", icon: <Coffee className="mr-2 h-5 w-5" /> },
    longBreak: { title: "Long Break", icon: <Coffee className="mr-2 h-5 w-5" /> },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 text-[#ADEFD1] flex flex-col items-center justify-center h-full"
    >
      <div className="flex justify-between items-center w-full max-w-md mb-4">
        <h1 className="text-3xl md:text-4xl font-bold">Focus Timer</h1>
        <Button variant="ghost" size="icon" onClick={() => setShowSettingsModal(true)} className="text-[#ADEFD1] hover:bg-[#ADEFD1]/10">
          <Settings className="h-6 w-6" />
        </Button>
      </div>

      {showSettingsModal && (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettingsModal(false)}
        >
          <Card className="widget-card w-full max-w-lg text-white" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-2xl">Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'work', label: 'Work Duration (min)', min: 5, max: 90 },
                { key: 'shortBreak', label: 'Short Break (min)', min: 1, max: 30 },
                { key: 'longBreak', label: 'Long Break (min)', min: 5, max: 60 },
                { key: 'longBreakInterval', label: 'Long Break Interval (sessions)', min: 2, max: 10 },
              ].map(item => (
                <div key={item.key}>
                  <label className="block text-sm font-medium mb-1">{item.label}: {settings[item.key]}</label>
                  <Slider defaultValue={[settings[item.key]]} min={item.min} max={item.max} step={1} onValueChange={(val) => handleSettingsChange(item.key, val[0])} 
                    className="[&>span:first-child]:h-3 [&>span:first-child]:w-3 [&>span:first-child]:bg-[#ADEFD1] [&>span:first-child]:shadow-none [&>span:first-child]:border-0"
                  />
                </div>
              ))}
              <div className="flex items-center justify-between">
                <label htmlFor="autoStartBreaks" className="text-sm">Auto-start breaks</label>
                <input type="checkbox" id="autoStartBreaks" checked={settings.autoStartBreaks} onChange={(e) => handleSettingsChange('autoStartBreaks', e.target.checked)} className="h-4 w-4 text-[#ADEFD1] bg-transparent border-[#ADEFD1]/50 rounded focus:ring-[#ADEFD1]" />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="autoStartPomodoros" className="text-sm">Auto-start work sessions</label>
                <input type="checkbox" id="autoStartPomodoros" checked={settings.autoStartPomodoros} onChange={(e) => handleSettingsChange('autoStartPomodoros', e.target.checked)} className="h-4 w-4 text-[#ADEFD1] bg-transparent border-[#ADEFD1]/50 rounded focus:ring-[#ADEFD1]" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setShowSettingsModal(false)} className="w-full bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">Close Settings</Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      <Card className="widget-card w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center gap-2 mb-4">
            <Button variant={mode === 'work' ? 'default': 'ghost'} onClick={() => selectMode('work')} className={`flex-1 ${mode === 'work' ? 'bg-[#ADEFD1] text-[#00203F]' : 'text-[#ADEFD1] hover:text-white'}`}>Work</Button>
            <Button variant={mode === 'shortBreak' ? 'default': 'ghost'} onClick={() => selectMode('shortBreak')} className={`flex-1 ${mode === 'shortBreak' ? 'bg-[#ADEFD1] text-[#00203F]' : 'text-[#ADEFD1] hover:text-white'}`}>Short Break</Button>
            <Button variant={mode === 'longBreak' ? 'default': 'ghost'} onClick={() => selectMode('longBreak')} className={`flex-1 ${mode === 'longBreak' ? 'bg-[#ADEFD1] text-[#00203F]' : 'text-[#ADEFD1] hover:text-white'}`}>Long Break</Button>
          </div>
          <CardTitle className="text-2xl text-white flex items-center justify-center">
            {modeConfig[mode].icon} {modeConfig[mode].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            key={`${minutes}-${seconds}-${mode}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-7xl md:text-8xl font-bold text-[#ADEFD1] my-8"
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </motion.div>
          <div className="flex justify-center gap-4 mb-6">
            <Button onClick={toggleTimer} className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90 w-32 text-lg py-6">
              {isActive ? <Pause className="mr-2 h-6 w-6" /> : <Play className="mr-2 h-6 w-6" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetTimer} variant="outline" className="border-[#ADEFD1] text-[#ADEFD1] hover:bg-[#ADEFD1]/10 w-32 text-lg py-6">
              <RotateCcw className="mr-2 h-6 w-6" /> Reset
            </Button>
          </div>
           <Button onClick={skipSession} variant="link" className="text-[#ADEFD1]/70 hover:text-[#ADEFD1]">
              <SkipForward className="mr-1 h-4 w-4" /> Skip Session
            </Button>
        </CardContent>
      </Card>
       <p className="text-sm text-gray-400 mt-6">Pomodoros completed: {pomodorosCompleted}</p>
       <p className="text-xs text-gray-500 mt-1">Sessions until long break: {settings.longBreakInterval - (pomodorosCompleted % settings.longBreakInterval)}</p>
    </motion.div>
  );
};

export default TimerPage;
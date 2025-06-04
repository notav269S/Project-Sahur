import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, PlusCircle, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

const CalendarPage = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem("projectSahurCalendarEvents");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projectSahurCalendarEvents", JSON.stringify(events));
  }, [events]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDayClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    setShowEventForm(true);
    setEditingEvent(null);
    setEventTitle("");
  };

  const handleAddOrUpdateEvent = () => {
    if (eventTitle.trim() === "") {
      toast({ title: "Oops!", description: "Event title cannot be empty.", variant: "destructive" });
      return;
    }
    if (editingEvent) {
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, title: eventTitle } : ev));
      toast({ title: "Event Updated!", description: `Event "${eventTitle}" was updated.`});
    } else {
      const newEvent = { id: uuidv4(), date: selectedDate.toISOString().split('T')[0], title: eventTitle };
      setEvents([...events, newEvent]);
      toast({ title: "Event Added!", description: `Event "${eventTitle}" was added.`});
    }
    setShowEventForm(false);
    setEventTitle("");
    setEditingEvent(null);
  };

  const handleEditEvent = (event) => {
    setSelectedDate(new Date(event.date));
    setEventTitle(event.title);
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId) => {
    const eventToDelete = events.find(ev => ev.id === eventId);
    setEvents(events.filter(ev => ev.id !== eventId));
    toast({ title: "Event Deleted", description: `Event "${eventToDelete.title}" was removed.`});
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    let dayCells = [];

    for (let i = 0; i < firstDay; i++) {
      dayCells.push(<div key={`empty-${i}`} className="p-1 text-center h-24 md:h-32 border border-[#ADEFD1]/10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toISOString().split('T')[0];
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      
      dayCells.push(
        <motion.div
          key={day}
          whileHover={{ backgroundColor: "rgba(173, 239, 209, 0.1)" }}
          onClick={() => handleDayClick(day)}
          className={`p-2 text-left border border-[#ADEFD1]/20 rounded cursor-pointer h-24 md:h-32 flex flex-col overflow-hidden ${isToday ? "bg-[#ADEFD1]/20" : "hover:bg-[#ADEFD1]/10"}`}
        >
          <span className={`font-semibold ${isToday ? 'text-[#ADEFD1]' : 'text-white'}`}>{day}</span>
          <div className="mt-1 space-y-0.5 text-xs overflow-y-auto flex-grow">
            {dayEvents.map(event => (
              <div key={event.id} className="bg-[#ADEFD1]/20 text-[#ADEFD1] p-1 rounded truncate text-[10px] md:text-xs" title={event.title}>
                {event.title}
              </div>
            ))}
          </div>
        </motion.div>
      );
    }
    return dayCells;
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 text-[#ADEFD1]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">Calendar</h1>
        <Button onClick={() => { setSelectedDate(new Date()); setShowEventForm(true); setEditingEvent(null); setEventTitle(""); }} className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      {showEventForm && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="mb-8">
        <Card className="widget-card">
          <CardHeader>
            <CardTitle className="text-xl text-white">{editingEvent ? "Edit Event" : "Add New Event"} for {selectedDate?.toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Event title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400"
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEventForm(false)} className="border-[#ADEFD1] text-[#ADEFD1] hover:bg-[#ADEFD1]/10">Cancel</Button>
            <Button onClick={handleAddOrUpdateEvent} className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">{editingEvent ? "Update" : "Save"} Event</Button>
          </CardFooter>
        </Card>
        </motion.div>
      )}

      <Card className="widget-card">
        <CardHeader className="p-4 border-b border-[#ADEFD1]/20">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)} className="text-[#ADEFD1] hover:bg-[#ADEFD1]/10">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <CardTitle className="text-2xl text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => changeMonth(1)} className="text-[#ADEFD1] hover:bg-[#ADEFD1]/10">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center font-semibold text-[#ADEFD1] text-sm md:text-base">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </CardContent>
      </Card>

      {events.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {events.sort((a,b) => new Date(a.date) - new Date(b.date)).filter(e => new Date(e.date) >= new Date(new Date().toDateString())).slice(0,5).map(event => (
              <Card key={event.id} className="widget-card">
                <CardContent className="p-3 flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{event.title}</p>
                    <p className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)} className="text-[#ADEFD1] hover:text-white hover:bg-[#ADEFD1]/10"><Edit2 className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default CalendarPage;
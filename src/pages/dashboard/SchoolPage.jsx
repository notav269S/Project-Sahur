import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit3, Trash2, GraduationCap, CalendarClock, BookOpenCheck, AlertTriangle, Percent, TrendingUp, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isValid, differenceInDays, isPast } from 'date-fns';
import { Progress } from "@/components/ui/progress";


const assignmentTypes = ["Homework", "Essay", "Project", "Quiz", "Exam Prep", "Reading", "Presentation", "Lab Report", "Group Work"];
const statusTypes = ["Not Started", "In Progress", "Submitted", "Graded", "Blocked"];
const priorityTypes = ["Low", "Medium", "High", "Critical"];

const SchoolPage = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignmentType, setAssignmentType] = useState(assignmentTypes[0]);
  const [status, setStatus] = useState(statusTypes[0]);
  const [priority, setPriority] = useState(priorityTypes[1]);
  const [grade, setGrade] = useState(''); // Percentage
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const storedAssignments = localStorage.getItem('projectSahurSchoolWorkV2');
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projectSahurSchoolWorkV2', JSON.stringify(assignments));
  }, [assignments]);

  const resetForm = () => {
    setTitle(''); setSubject(''); setDueDate(''); setAssignmentType(assignmentTypes[0]);
    setStatus(statusTypes[0]); setPriority(priorityTypes[1]); setGrade(''); setNotes('');
    setCurrentAssignment(null); setShowForm(false);
  };

  const handleOpenForm = (assignment = null) => {
    if (assignment) {
      setCurrentAssignment(assignment);
      setTitle(assignment.title); setSubject(assignment.subject);
      setDueDate(assignment.dueDate ? format(parseISO(assignment.dueDate), 'yyyy-MM-dd') : '');
      setAssignmentType(assignment.assignmentType); setStatus(assignment.status);
      setPriority(assignment.priority || priorityTypes[1]); setGrade(assignment.grade || '');
      setNotes(assignment.notes);
    } else {
      setCurrentAssignment(null); setTitle(''); setSubject(''); setDueDate('');
      setAssignmentType(assignmentTypes[0]); setStatus(statusTypes[0]);
      setPriority(priorityTypes[1]); setGrade(''); setNotes('');
    }
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !subject || !dueDate) {
      toast({ title: "Missing Fields", description: "Please fill in title, subject, and due date.", variant: "destructive" });
      return;
    }
    const parsedDueDate = parseISO(dueDate);
    if (!isValid(parsedDueDate)) {
        toast({ title: "Invalid Date", description: "Please enter a valid due date.", variant: "destructive" });
        return;
    }

    const assignmentData = { 
        id: currentAssignment ? currentAssignment.id : uuidv4(),
        title, subject, dueDate: parsedDueDate.toISOString(), assignmentType, 
        status, priority, grade, notes,
        lastUpdated: new Date().toISOString()
    };

    if (currentAssignment) {
      setAssignments(assignments.map(a => a.id === currentAssignment.id ? assignmentData : a));
      toast({ title: "Assignment Updated!", description: `"${title}" has been updated.` });
    } else {
      setAssignments([assignmentData, ...assignments]);
      toast({ title: "Assignment Added!", description: `"${title}" has been added to your planner.` });
    }
    resetForm();
  };

  const handleDelete = (id) => {
    const assignmentToDelete = assignments.find(a => a.id === id);
    setAssignments(assignments.filter(a => a.id !== id));
    toast({ title: "Assignment Deleted", description: `"${assignmentToDelete.title}" removed.` });
  };
  
  const filteredAssignments = assignments.filter(item => {
    const statusMatch = filterStatus === "All" || item.status === filterStatus;
    const priorityMatch = filterPriority === "All" || item.priority === filterPriority;
    return statusMatch && priorityMatch;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const getDaysLeft = (dueDateStr) => {
    const due = parseISO(dueDateStr);
    if (!isValid(due)) return { text: "Invalid Date", color: "text-red-500" };
    if (isPast(due) && !['Graded', 'Submitted'].includes(status)) return { text: "Past Due!", color: "text-red-500 font-semibold" };
    const days = differenceInDays(due, new Date());
    if (days < 0) return { text: "Past Due", color: "text-muted-foreground" };
    if (days === 0) return { text: "Due Today!", color: "text-orange-500 font-semibold" };
    if (days === 1) return { text: "Due Tomorrow", color: "text-yellow-500" };
    return { text: `${days} days left`, color: "text-green-500" };
  };
  
  const getStatusColor = (status) => {
    if (status === "Graded" || status === "Submitted") return "bg-green-500";
    if (status === "In Progress") return "bg-yellow-500";
    if (status === "Blocked") return "bg-red-500";
    return "bg-gray-500";
  };

  const getPriorityColor = (priority) => {
    if (priority === "Critical") return "border-red-500 text-red-500";
    if (priority === "High") return "border-orange-500 text-orange-500";
    if (priority === "Medium") return "border-yellow-500 text-yellow-500";
    return "border-green-500 text-green-500";
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 text-foreground"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <GraduationCap className="mr-3 h-7 w-7 text-primary dark:text-primary"/>School Work
        </h1>
        <div className="flex flex-wrap gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[140px] h-9 text-xs"><Filter className="mr-1 h-3 w-3"/>Status</SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    {statusTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full md:w-[140px] h-9 text-xs"><Filter className="mr-1 h-3 w-3"/>Priority</SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Priorities</SelectItem>
                    {priorityTypes.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button onClick={() => handleOpenForm()} size="sm" className="h-9 text-xs">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Assignment
            </Button>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={(isOpen) => { if(!isOpen) resetForm(); else setShowForm(true);}}>
        <DialogContent className="sm:max-w-[525px] bg-card border-border text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">{currentAssignment ? "Edit Assignment" : "Add New Assignment"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <Input placeholder="Assignment Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <Input placeholder="Subject/Course" value={subject} onChange={e => setSubject(e.target.value)} required />
            <div>
                <label htmlFor="dueDate" className="text-sm text-muted-foreground mb-1 block">Due Date</label>
                <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
            </div>
            <Select value={assignmentType} onValueChange={setAssignmentType}>
              <SelectTrigger><SelectValue placeholder="Assignment Type" /></SelectTrigger>
              <SelectContent>{assignmentTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>{statusTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>{priorityTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="number" placeholder="Grade (%) (Optional)" value={grade} onChange={e => setGrade(e.target.value)} min="0" max="100" />
            <Textarea placeholder="Notes (e.g., specific instructions, resources)" value={notes} onChange={e => setNotes(e.target.value)} rows={3}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{currentAssignment ? "Update" : "Add"} Assignment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map(item => {
            const daysLeftInfo = getDaysLeft(item.dueDate);
            const progressValue = item.status === "Graded" || item.status === "Submitted" ? 100 : item.status === "In Progress" ? 50 : 0;
            return (
            <Card key={item.id} className={`widget-card flex flex-col ${item.status === "Graded" ? "opacity-80" : ""}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-foreground truncate">{item.title}</CardTitle>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getPriorityColor(item.priority)}`}>{item.priority}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.subject} - {item.assignmentType}</p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm flex-grow">
                <div className="flex items-center justify-between">
                    <span className="flex items-center"><CalendarClock className="mr-2 h-4 w-4 text-primary dark:text-primary"/> Due: {format(parseISO(item.dueDate), 'MMM dd, yyyy')}</span>
                    <span className={`text-xs font-medium ${daysLeftInfo.color}`}>{daysLeftInfo.text}</span>
                </div>
                <div className="flex items-center">
                    <span className={`mr-2 h-3 w-3 rounded-full inline-block ${getStatusColor(item.status)}`}></span> Status: {item.status}
                </div>
                {item.status !== "Graded" && item.status !== "Submitted" && <Progress value={progressValue} className="h-2 mt-1" />}
                {item.grade && <div className="flex items-center"><Percent className="mr-2 h-4 w-4 text-primary dark:text-primary"/> Grade: {item.grade}%</div>}
                {item.notes && <p className="text-xs text-muted-foreground pt-2 border-t border-border mt-2 line-clamp-2">Notes: {item.notes}</p>}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-border pt-3 mt-auto">
                <Button variant="ghost" size="icon" onClick={() => handleOpenForm(item)} className="text-muted-foreground hover:text-primary dark:hover:text-primary h-7 w-7"><Edit3 className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive/70 hover:text-destructive h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
              </CardFooter>
            </Card>
          )})}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground mt-10 p-6 border-2 border-dashed border-border rounded-xl"
        >
          <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-lg font-semibold mb-1">
            {filterStatus !== "All" || filterPriority !== "All" ? "No assignments match your filters." : "No assignments yet!"}
          </p>
          <p className="text-sm">
            {filterStatus !== "All" || filterPriority !== "All" ? "Try adjusting your filters." : "Add your homework, projects, and exams to get started."}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SchoolPage;
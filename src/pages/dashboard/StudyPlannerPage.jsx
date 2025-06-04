
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit3, Trash2, ClipboardList, CalendarClock, BookOpenCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isValid } from 'date-fns';

const assignmentTypes = ["Homework", "Essay", "Project", "Quiz", "Exam Prep", "Reading", "Presentation"];
const statusTypes = ["Not Started", "In Progress", "Completed", "Blocked"];

const StudyPlannerPage = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignmentType, setAssignmentType] = useState(assignmentTypes[0]);
  const [status, setStatus] = useState(statusTypes[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const storedAssignments = localStorage.getItem('projectSahurStudyPlanner');
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projectSahurStudyPlanner', JSON.stringify(assignments));
  }, [assignments]);

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setDueDate('');
    setAssignmentType(assignmentTypes[0]);
    setStatus(statusTypes[0]);
    setNotes('');
    setCurrentAssignment(null);
    setShowForm(false);
  };

  const handleOpenForm = (assignment = null) => {
    if (assignment) {
      setCurrentAssignment(assignment);
      setTitle(assignment.title);
      setSubject(assignment.subject);
      setDueDate(assignment.dueDate ? format(parseISO(assignment.dueDate), 'yyyy-MM-dd') : '');
      setAssignmentType(assignment.assignmentType);
      setStatus(assignment.status);
      setNotes(assignment.notes);
    } else {
      setCurrentAssignment(null);
      setTitle('');
      setSubject('');
      setDueDate('');
      setAssignmentType(assignmentTypes[0]);
      setStatus(statusTypes[0]);
      setNotes('');
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
        title, 
        subject, 
        dueDate: parsedDueDate.toISOString(), 
        assignmentType, 
        status, 
        notes,
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
  
  const sortedAssignments = [...assignments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

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
          <ClipboardList className="mr-3 h-7 w-7 text-primary dark:text-secondary"/>Study Planner
        </h1>
        <Button onClick={() => handleOpenForm()} size="sm" className="h-9 text-xs">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Assignment
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(isOpen) => { if(!isOpen) resetForm(); else setShowForm(true);}}>
        <DialogContent className="sm:max-w-[525px] bg-card border-border text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">{currentAssignment ? "Edit Assignment" : "Add New Assignment"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <Input placeholder="Assignment Title (e.g., Math Homework Ch. 5)" value={title} onChange={e => setTitle(e.target.value)} required />
            <Input placeholder="Subject (e.g., Mathematics)" value={subject} onChange={e => setSubject(e.target.value)} required />
            <div>
                <label htmlFor="dueDate" className="text-sm text-muted-foreground mb-1 block">Due Date</label>
                <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
            </div>
            <Select value={assignmentType} onValueChange={setAssignmentType}>
              <SelectTrigger><SelectValue placeholder="Assignment Type" /></SelectTrigger>
              <SelectContent>
                {assignmentTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {statusTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
            <Textarea placeholder="Notes (e.g., specific instructions, resources)" value={notes} onChange={e => setNotes(e.target.value)} rows={3}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{currentAssignment ? "Update" : "Add"} Assignment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {sortedAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAssignments.map(item => (
            <Card key={item.id} className={`widget-card ${item.status === "Completed" ? "opacity-70" : ""}`}>
              <CardHeader>
                <CardTitle className="text-lg text-foreground truncate">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.subject}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center"><CalendarClock className="mr-2 h-4 w-4 text-primary dark:text-secondary"/> Due: {format(parseISO(item.dueDate), 'MMM dd, yyyy')}</div>
                <div className="flex items-center"><BookOpenCheck className="mr-2 h-4 w-4 text-primary dark:text-secondary"/> Type: {item.assignmentType}</div>
                <div className="flex items-center">
                    <span className={`mr-2 h-3 w-3 rounded-full inline-block ${
                        item.status === "Completed" ? "bg-green-500" :
                        item.status === "In Progress" ? "bg-yellow-500" :
                        item.status === "Blocked" ? "bg-red-500" : "bg-gray-500"
                    }`}></span> Status: {item.status}
                </div>
                {item.notes && <p className="text-xs text-muted-foreground pt-1 border-t border-border mt-2">Notes: {item.notes.substring(0,50)}{item.notes.length > 50 ? "..." : ""}</p>}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpenForm(item)} className="text-muted-foreground hover:text-primary dark:hover:text-secondary h-7 w-7"><Edit3 className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive/70 hover:text-destructive h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground mt-10 p-6 border-2 border-dashed border-border rounded-xl"
        >
          <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-lg font-semibold mb-1">No assignments yet!</p>
          <p className="text-sm">Add your homework, projects, and exams to get started.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudyPlannerPage;

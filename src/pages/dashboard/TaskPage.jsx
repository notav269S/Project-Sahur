import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, CheckCircle, Edit2, Trash2, AlertTriangle, ListChecks, GripVertical, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

const priorityMap = { High: 3, Medium: 2, Low: 1 };
const priorityColors = {
  High: "bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-300 border-red-500/30",
  Medium: "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-300 border-yellow-500/30",
  Low: "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300 border-green-500/30",
};

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleSaveEdit = () => {
    if (editText.trim() === "") {
      toast({ title: "Oops!", description: "Task description cannot be empty.", variant: "destructive" });
      return;
    }
    onEdit(task.id, editText, editPriority);
    setIsEditing(false);
  };

  return (
    <Card className={`widget-card mb-3 transition-all duration-300 ease-in-out hover:shadow-xl ${task.completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-3 flex items-center justify-between">
        {isEditing ? (
          <div className="flex-grow flex items-center gap-2">
            <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="h-8 text-sm" />
            <Select value={editPriority} onValueChange={setEditPriority}>
              <SelectTrigger className="h-8 text-xs w-[100px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleSaveEdit} className="h-8">Save</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="h-8">Cancel</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center flex-grow overflow-hidden mr-2">
              <Button variant="ghost" size="icon" onClick={() => onToggle(task.id)} className="mr-2 text-foreground hover:text-primary dark:hover:text-secondary shrink-0">
                <CheckCircle className={`h-5 w-5 ${task.completed ? 'fill-current text-primary dark:text-secondary' : 'text-muted-foreground'}`} />
              </Button>
              <span className={`text-sm truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.text}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-primary dark:hover:text-secondary h-7 w-7">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="text-destructive/70 hover:text-destructive h-7 w-7">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};


const EisenhowerMatrix = ({ tasks, onToggle, onEdit, onDelete }) => {
  const quadrants = {
    urgentImportant: tasks.filter(t => t.priority === "High" && !t.completed), // Do
    notUrgentImportant: tasks.filter(t => t.priority === "Medium" && !t.completed), // Schedule
    urgentNotImportant: tasks.filter(t => t.priority === "High" && t.completed), // Delegate (misusing completed for demo)
    notUrgentNotImportant: tasks.filter(t => t.priority === "Low" && !t.completed), // Eliminate
  };

  const quadrantTitles = {
    urgentImportant: "Urgent & Important (Do)",
    notUrgentImportant: "Not Urgent & Important (Schedule)",
    urgentNotImportant: "Urgent & Not Important (Delegate)",
    notUrgentNotImportant: "Not Urgent & Not Important (Eliminate)",
  };
  
  const quadrantColors = {
    urgentImportant: "border-red-500/50",
    notUrgentImportant: "border-blue-500/50",
    urgentNotImportant: "border-yellow-500/50",
    notUrgentNotImportant: "border-gray-500/50",
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {Object.keys(quadrants).map(key => (
        <Card key={key} className={`widget-card border-2 ${quadrantColors[key]}`}>
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-md font-semibold text-foreground">{quadrantTitles[key]}</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[150px] max-h-[300px] overflow-y-auto p-3 space-y-2">
            {quadrants[key].length > 0 ? quadrants[key].map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            )) : <p className="text-xs text-muted-foreground text-center py-4">No tasks in this quadrant.</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


const TaskPage = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Default");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'matrix'

  useEffect(() => {
    const storedTasks = localStorage.getItem("projectSahurTasksV2"); // Use new key for new structure
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projectSahurTasksV2", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTaskText.trim() === "") {
      toast({ title: "Oops!", description: "Task description cannot be empty.", variant: "destructive" });
      return;
    }
    const taskToAdd = { 
      id: uuidv4(), 
      text: newTaskText, 
      completed: false, 
      priority: newTaskPriority, 
      createdAt: new Date().toISOString(),
      quadrant: null // For future drag-and-drop to matrix
    };
    setTasks([taskToAdd, ...tasks]);
    setNewTaskText("");
    setNewTaskPriority("Medium");
    toast({ title: "Task Added!", description: `"${taskToAdd.text}" was added.`});
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleDeleteTask = (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    toast({ title: "Task Deleted", description: `"${taskToDelete.text}" was removed.`});
  };
  
  const handleEditTask = (id, newText, newPriority) => {
     setTasks(tasks.map(task => task.id === id ? { ...task, text: newText, priority: newPriority } : task));
     toast({ title: "Task Updated!", description: "Task has been updated."});
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filter === "All") return true;
      if (filter === "Completed") return task.completed;
      if (filter === "Pending") return !task.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "PriorityHighToLow") return priorityMap[b.priority] - priorityMap[a.priority];
      if (sortOrder === "PriorityLowToHigh") return priorityMap[a.priority] - priorityMap[b.priority];
      if (sortOrder === "NewestFirst") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === "OldestFirst") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0; 
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 text-foreground"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center"><ListChecks className="mr-3 h-7 w-7 text-primary dark:text-secondary"/>My Tasks</h1>
        <div className="flex flex-wrap gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[130px] h-9 text-xs">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Tasks</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full md:w-[150px] h-9 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Default">Default</SelectItem>
              <SelectItem value="PriorityHighToLow">Priority: High-Low</SelectItem>
              <SelectItem value="PriorityLowToHigh">Priority: Low-High</SelectItem>
              <SelectItem value="NewestFirst">Date: Newest</SelectItem>
              <SelectItem value="OldestFirst">Date: Oldest</SelectItem>
            </SelectContent>
          </Select>
           <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} size="sm" className="h-9 text-xs">List</Button>
           <Button variant={viewMode === 'matrix' ? 'default' : 'outline'} onClick={() => setViewMode('matrix')} size="sm" className="h-9 text-xs">Matrix</Button>
        </div>
      </div>

      <Card className="widget-card mb-6">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-lg text-foreground">Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Enter task description..."
              className="h-10 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
              <SelectTrigger className="w-full sm:w-[140px] h-10 text-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddTask} className="h-10 text-sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'list' && (
        filteredAndSortedTasks.length > 0 ? (
          <div className="space-y-2">
            {filteredAndSortedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={handleToggleTask} onEdit={handleEditTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground mt-10 p-6 border-2 border-dashed border-border rounded-xl"
          >
            <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-lg font-semibold mb-1">No tasks here!</p>
            <p className="text-sm">
              {filter !== "All" || sortOrder !== "Default" ? "No tasks match your current filters/sort order." : "Add a new task to get started!"}
            </p>
          </motion.div>
        )
      )}
      
      {viewMode === 'matrix' && (
        <EisenhowerMatrix tasks={tasks} onToggle={handleToggleTask} onEdit={handleEditTask} onDelete={handleDeleteTask} />
      )}

    </motion.div>
  );
};

export default TaskPage;
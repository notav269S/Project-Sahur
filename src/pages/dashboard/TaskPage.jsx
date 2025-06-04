import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, CheckCircle, Edit2, Trash2, Filter, SortAsc, Star, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

const TaskPage = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Default");

  useEffect(() => {
    const storedTasks = localStorage.getItem("projectSahurTasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projectSahurTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === "") {
      toast({ title: "Oops!", description: "Task description cannot be empty.", variant: "destructive" });
      return;
    }
    const taskToAdd = { id: uuidv4(), text: newTask, completed: false, priority: newTaskPriority, createdAt: new Date().toISOString() };
    setTasks([taskToAdd, ...tasks]);
    setNewTask("");
    setNewTaskPriority("Medium");
    toast({ title: "Task Added!", description: `"${taskToAdd.text}" was added to your list.`, variant: "default" });
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    toast({ title: "Task Deleted", description: `"${taskToDelete.text}" was removed.`, variant: "default" });
  };
  
  const editTask = (id, newText, newPriority) => {
     setTasks(tasks.map(task => task.id === id ? { ...task, text: newText, priority: newPriority } : task));
     toast({ title: "Task Updated!", description: "Your task has been successfully updated.", variant: "default" });
  };


  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filter === "All") return true;
      if (filter === "Completed") return task.completed;
      if (filter === "Pending") return !task.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "PriorityHighToLow") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortOrder === "PriorityLowToHigh") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortOrder === "NewestFirst") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortOrder === "OldestFirst") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0; // Default (order of addition, effectively newest first due to unshift)
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 text-[#ADEFD1]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">My Tasks</h1>
        <div className="flex flex-wrap gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-transparent border border-[#ADEFD1]/50 text-white p-2 rounded-md focus:ring-[#ADEFD1] focus:border-[#ADEFD1]">
            <option value="All" className="bg-[#00203F]">All Tasks</option>
            <option value="Completed" className="bg-[#00203F]">Completed</option>
            <option value="Pending" className="bg-[#00203F]">Pending</option>
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-transparent border border-[#ADEFD1]/50 text-white p-2 rounded-md focus:ring-[#ADEFD1] focus:border-[#ADEFD1]">
            <option value="Default" className="bg-[#00203F]">Sort by Default</option>
            <option value="PriorityHighToLow" className="bg-[#00203F]">Priority: High to Low</option>
            <option value="PriorityLowToHigh" className="bg-[#00203F]">Priority: Low to High</option>
            <option value="NewestFirst" className="bg-[#00203F]">Date: Newest First</option>
            <option value="OldestFirst" className="bg-[#00203F]">Date: Oldest First</option>
          </select>
        </div>
      </div>

      <Card className="widget-card mb-8 p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-xl text-white mb-2">Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task description..."
              className="bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400 flex-grow"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)} className="bg-transparent border border-[#ADEFD1]/50 text-white p-2 rounded-md focus:ring-[#ADEFD1] focus:border-[#ADEFD1] sm:w-auto w-full">
              <option value="High" className="bg-[#00203F]">High Priority</option>
              <option value="Medium" className="bg-[#00203F]">Medium Priority</option>
              <option value="Low" className="bg-[#00203F]">Low Priority</option>
            </select>
            <Button onClick={handleAddTask} className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90 sm:w-auto w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredAndSortedTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Card className="widget-card">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center flex-grow overflow-hidden mr-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleTask(task.id)} className="mr-3 text-[#ADEFD1] hover:text-white shrink-0">
                      <CheckCircle className={`h-6 w-6 ${task.completed ? 'fill-current text-[#ADEFD1]' : 'text-gray-500'}`} />
                    </Button>
                    <span className={`text-lg truncate ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>{task.text}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${task.priority === "High" ? "bg-red-400/80 text-red-900" : task.priority === "Medium" ? "bg-yellow-400/80 text-yellow-900" : "bg-green-400/80 text-green-900"}`}>
                      {task.priority}
                    </span>
                    <Button variant="ghost" size="icon" className="text-[#ADEFD1] hover:text-white hover:bg-[#ADEFD1]/10" onClick={() => {
                        const newText = prompt("Edit task description:", task.text);
                        const newPriority = prompt("Edit task priority (High, Medium, Low):", task.priority);
                        if (newText !== null && newPriority !== null && ["High", "Medium", "Low"].includes(newPriority)) {
                            editTask(task.id, newText, newPriority);
                        } else if (newText !== null || newPriority !== null) {
                            toast({ title: "Invalid Input", description: "Please provide valid text and priority.", variant: "destructive"});
                        }
                    }}>
                      <Edit2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 mt-12 p-8 border-2 border-dashed border-[#ADEFD1]/30 rounded-xl"
        >
          <AlertTriangle className="h-16 w-16 text-[#ADEFD1]/50 mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">No tasks here!</p>
          <p className="text-base">
            {filter !== "All" || sortOrder !== "Default" ? "No tasks match your current filters/sort order." : "Add a new task to get started on your productive journey!"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskPage;
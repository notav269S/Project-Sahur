import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, Edit3, Trash2, BookOpen, Search, FileText, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

const journalPrompts = [
  "What are you grateful for today?",
  "Describe a challenge you overcame recently.",
  "What's one thing you learned today?",
  "How are you feeling right now, and why?",
  "What are your top 3 goals for this week?",
  "Reflect on a recent success, big or small.",
  "What's something that made you smile today?",
  "If you could give your younger self one piece of advice, what would it be?",
  "What are you looking forward to?",
  "Describe a place where you feel most at peace."
];

const JournalPage = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ id: null, title: "", content: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [activePrompt, setActivePrompt] = useState("");

  useEffect(() => {
    const storedEntries = localStorage.getItem("projectSahurJournalEntriesV2");
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projectSahurJournalEntriesV2", JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = () => {
    if (currentEntry.title.trim() === "" || currentEntry.content.trim() === "") {
      toast({ title: "Oops!", description: "Title and content cannot be empty.", variant: "destructive" });
      return;
    }
    if (currentEntry.id) { 
      setEntries(entries.map(entry => entry.id === currentEntry.id ? { ...currentEntry, date: entry.date, updatedAt: new Date().toISOString() } : entry));
      toast({ title: "Entry Updated!", description: `"${currentEntry.title}" was updated.`});
    } else { 
      const newEntry = { ...currentEntry, id: uuidv4(), date: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setEntries([newEntry, ...entries]);
      toast({ title: "Entry Added!", description: `"${newEntry.title}" was added.`});
    }
    setCurrentEntry({ id: null, title: "", content: "" });
    setShowForm(false);
    setActivePrompt("");
  };

  const handleEditEntry = (entry) => {
    setCurrentEntry(entry);
    setShowForm(true);
    setActivePrompt("");
  };

  const handleDeleteEntry = (id) => {
    const entryToDelete = entries.find(entry => entry.id === id);
    setEntries(entries.filter(entry => entry.id !== id));
    toast({ title: "Entry Deleted", description: `"${entryToDelete.title}" was removed.`});
  };
  
  const handleNewEntryClick = (prompt = "") => {
    setCurrentEntry({ id: null, title: prompt ? prompt : "", content: "" });
    setActivePrompt(prompt);
    setShowForm(true);
  };

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    const prompt = journalPrompts[randomIndex];
    handleNewEntryClick(prompt);
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 text-foreground"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center"><BookOpen className="mr-3 h-7 w-7 text-primary dark:text-secondary"/>My Journal</h1>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-52">
                <Input 
                    type="text"
                    placeholder="Search journal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={() => handleNewEntryClick()} size="sm" className="h-9 text-xs">
                <PlusCircle className="mr-2 h-4 w-4" /> New Entry
            </Button>
        </div>
      </div>

      {!showForm && (
        <Card className="widget-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Journal Prompts</CardTitle>
            <CardContent className="p-0 pt-2">
              <p className="text-xs text-muted-foreground mb-3">Need inspiration? Try one of these prompts.</p>
              <div className="flex flex-wrap gap-2">
                {journalPrompts.slice(0, 5).map(prompt => (
                  <Button key={prompt} variant="outline" size="sm" className="text-xs" onClick={() => handleNewEntryClick(prompt)}>{prompt}</Button>
                ))}
                <Button variant="ghost" size="sm" className="text-xs text-primary dark:text-secondary" onClick={getRandomPrompt}><Lightbulb className="mr-1 h-3 w-3"/>Random Prompt</Button>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      )}

      {showForm && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="mb-6">
        <Card className="widget-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">{currentEntry.id ? "Edit Journal Entry" : "Create New Journal Entry"}</CardTitle>
            {activePrompt && <p className="text-sm text-muted-foreground pt-1">Prompt: {activePrompt}</p>}
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="text"
              placeholder="Entry Title"
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
              className="w-full text-sm"
            />
            <Textarea
              placeholder="Write your thoughts..."
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
              rows="10"
              className="w-full text-sm"
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => {setShowForm(false); setActivePrompt("");}}>Cancel</Button>
            <Button onClick={handleSaveEntry} size="sm">{currentEntry.id ? "Update" : "Save"} Entry</Button>
          </CardFooter>
        </Card>
        </motion.div>
      )}

      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration:0.2 }}
              layout
            >
              <Card className="widget-card h-full flex flex-col hover:shadow-xl transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md text-foreground truncate">{entry.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{new Date(entry.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </CardHeader>
                <CardContent className="flex-grow pt-1">
                  <p className="text-sm text-muted-foreground line-clamp-5 whitespace-pre-line">{entry.content}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-1 pt-2 border-t border-border">
                  <Button variant="ghost" size="icon" onClick={() => handleEditEntry(entry)} className="text-muted-foreground hover:text-primary dark:hover:text-secondary h-7 w-7"><Edit3 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entry.id)} className="text-destructive/70 hover:text-destructive h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
         <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground mt-10 p-6 border-2 border-dashed border-border rounded-xl"
        >
          <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-lg font-semibold mb-1">
            {searchTerm ? "No entries match your search." : "Your journal is empty."}
          </p>
          <p className="text-sm">
            {searchTerm ? "Try a different search term." : "Start writing your first entry!"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JournalPage;
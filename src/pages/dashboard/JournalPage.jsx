import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, Edit3, Trash2, BookOpen, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

const JournalPage = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ id: null, title: "", content: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedEntries = localStorage.getItem("projectSahurJournalEntries");
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projectSahurJournalEntries", JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = () => {
    if (currentEntry.title.trim() === "" || currentEntry.content.trim() === "") {
      toast({ title: "Oops!", description: "Title and content cannot be empty.", variant: "destructive" });
      return;
    }
    if (currentEntry.id) { // Editing existing entry
      setEntries(entries.map(entry => entry.id === currentEntry.id ? { ...currentEntry, date: entry.date } : entry));
      toast({ title: "Entry Updated!", description: `"${currentEntry.title}" was updated.`});
    } else { // Adding new entry
      const newEntry = { ...currentEntry, id: uuidv4(), date: new Date().toISOString() };
      setEntries([newEntry, ...entries]);
      toast({ title: "Entry Added!", description: `"${newEntry.title}" was added.`});
    }
    setCurrentEntry({ id: null, title: "", content: "" });
    setShowForm(false);
  };

  const handleEditEntry = (entry) => {
    setCurrentEntry(entry);
    setShowForm(true);
  };

  const handleDeleteEntry = (id) => {
    const entryToDelete = entries.find(entry => entry.id === id);
    setEntries(entries.filter(entry => entry.id !== id));
    toast({ title: "Entry Deleted", description: `"${entryToDelete.title}" was removed.`});
  };
  
  const handleNewEntryClick = () => {
    setCurrentEntry({ id: null, title: "", content: "" });
    setShowForm(true);
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => new Date(b.date) - new Date(a.date));


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 text-[#ADEFD1]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">My Journal</h1>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Input 
                    type="text"
                    placeholder="Search journal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button onClick={handleNewEntryClick} className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">
                <PlusCircle className="mr-2 h-4 w-4" /> New Entry
            </Button>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="mb-8">
        <Card className="widget-card">
          <CardHeader>
            <CardTitle className="text-xl text-white">{currentEntry.id ? "Edit Journal Entry" : "Create New Journal Entry"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Entry Title"
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
              className="w-full p-2 rounded bg-transparent border border-[#ADEFD1]/50 text-white placeholder:text-gray-400"
            />
            <textarea
              placeholder="Write your thoughts..."
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
              rows="8"
              className="w-full p-2 rounded bg-transparent border border-[#ADEFD1]/50 text-white placeholder:text-gray-400"
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-[#ADEFD1] text-[#ADEFD1] hover:bg-[#ADEFD1]/10">Cancel</Button>
            <Button onClick={handleSaveEntry} className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">{currentEntry.id ? "Update" : "Save"} Entry</Button>
          </CardFooter>
        </Card>
        </motion.div>
      )}

      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Card className="widget-card h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl text-white truncate">{entry.title}</CardTitle>
                  <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-300 line-clamp-4 whitespace-pre-line">{entry.content}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-4 border-t border-[#ADEFD1]/20">
                  <Button variant="ghost" size="icon" onClick={() => handleEditEntry(entry)} className="text-[#ADEFD1] hover:text-white hover:bg-[#ADEFD1]/10"><Edit3 className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entry.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="h-5 w-5" /></Button>
                </CardFooter>
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
          <FileText className="h-16 w-16 text-[#ADEFD1]/50 mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">
            {searchTerm ? "No entries match your search." : "Your journal is empty."}
          </p>
          <p className="text-base">
            {searchTerm ? "Try a different search term." : "Start writing your first entry to capture your thoughts and ideas!"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JournalPage;
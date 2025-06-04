import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, Edit3, Trash2, Pin, Search, Palette, StickyNote as StickyNoteIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

const noteColors = [
  { name: "Default", class: "bg-purple-500/20 border-purple-500/30" },
  { name: "Mint", class: "bg-green-500/20 border-green-500/30" },
  { name: "Sky", class: "bg-blue-500/20 border-blue-500/30" },
  { name: "Rose", class: "bg-pink-500/20 border-pink-500/30" },
  { name: "Sun", class: "bg-yellow-500/20 border-yellow-500/30" },
];

const NotesPage = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: null, title: "", content: "", pinned: false, color: noteColors[0].class });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedNotes = localStorage.getItem("projectSahurNotes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projectSahurNotes", JSON.stringify(notes));
  }, [notes]);

  const handleSaveNote = () => {
    if (currentNote.title.trim() === "" && currentNote.content.trim() === "") {
      toast({ title: "Oops!", description: "Note content cannot be empty.", variant: "destructive" });
      return;
    }
    if (currentNote.id) { // Editing
      setNotes(notes.map(note => note.id === currentNote.id ? currentNote : note));
      toast({ title: "Note Updated!", description: `Note "${currentNote.title || 'Untitled'}" was updated.`});
    } else { // Adding
      const newNote = { ...currentNote, id: uuidv4(), createdAt: new Date().toISOString() };
      setNotes([newNote, ...notes]);
      toast({ title: "Note Added!", description: `Note "${newNote.title || 'Untitled'}" was added.`});
    }
    setCurrentNote({ id: null, title: "", content: "", pinned: false, color: noteColors[0].class });
    setShowForm(false);
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
    setShowForm(true);
  };

  const handleDeleteNote = (id) => {
    const noteToDelete = notes.find(note => note.id === id);
    setNotes(notes.filter(note => note.id !== id));
    toast({ title: "Note Deleted", description: `Note "${noteToDelete.title || 'Untitled'}" was removed.`});
  };
  
  const handleNewNoteClick = () => {
    setCurrentNote({ id: null, title: "", content: "", pinned: false, color: noteColors[0].class });
    setShowForm(true);
  };

  const togglePin = (id) => {
    setNotes(notes.map(note => note.id === id ? { ...note, pinned: !note.pinned } : note));
  };
  
  const filteredNotes = notes
    .filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.pinned - a.pinned || new Date(b.createdAt) - new Date(a.createdAt));


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 text-[#ADEFD1]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">My Notes</h1>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Input 
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-[#ADEFD1]/50 text-white placeholder:text-gray-400 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button onClick={handleNewNoteClick} className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">
                <PlusCircle className="mr-2 h-4 w-4" /> New Note
            </Button>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="mb-8">
        <Card className={`widget-card ${currentNote.color}`}>
          <CardHeader>
            <CardTitle className="text-xl text-white">{currentNote.id ? "Edit Note" : "Create New Note"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Note Title (optional)"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              className="w-full p-2 rounded bg-transparent border-white/30 text-white placeholder:text-gray-300"
            />
            <textarea
              placeholder="Write your note..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              rows="5"
              className="w-full p-2 rounded bg-transparent border-white/30 text-white placeholder:text-gray-300"
            />
            <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-white/70" />
                {noteColors.map(color => (
                    <button key={color.name} title={color.name} onClick={() => setCurrentNote({...currentNote, color: color.class})} className={`h-6 w-6 rounded-full ${color.class.split(' ')[0]} border-2 ${currentNote.color === color.class ? 'border-white ring-2 ring-offset-1 ring-offset-[#00203F] ring-white' : 'border-transparent'}`}></button>
                ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-[#ADEFD1] text-[#ADEFD1] hover:bg-[#ADEFD1]/10">Cancel</Button>
            <Button onClick={handleSaveNote} className="bg-[#ADEFD1] text-[#00203F] hover:bg-[#ADEFD1]/90">{currentNote.id ? "Update" : "Save"} Note</Button>
          </CardFooter>
        </Card>
        </motion.div>
      )}
      
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Card className={`widget-card h-full flex flex-col ${note.color}`}>
                <CardHeader>
                  {note.title && <CardTitle className="text-lg text-white truncate">{note.title}</CardTitle>}
                  <p className="text-xs text-white/60">{new Date(note.createdAt).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-white/90 whitespace-pre-wrap line-clamp-6">{note.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4 border-t border-white/20">
                  <Button variant="ghost" size="icon" onClick={() => togglePin(note.id)} className={`text-[#ADEFD1] hover:text-white hover:bg-[#ADEFD1]/10 ${note.pinned ? 'text-yellow-400' : ''}`}>
                    <Pin className={`h-5 w-5 ${note.pinned ? 'fill-current' : ''}`} />
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditNote(note)} className="text-[#ADEFD1] hover:text-white hover:bg-[#ADEFD1]/10"><Edit3 className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="h-5 w-5" /></Button>
                  </div>
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
          <StickyNoteIcon className="h-16 w-16 text-[#ADEFD1]/50 mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">
            {searchTerm ? "No notes match your search." : "Your notebook is empty."}
          </p>
          <p className="text-base">
            {searchTerm ? "Try a different search term." : "Create your first note to capture ideas, thoughts, or reminders!"}
          </p>
        </motion.div>
      )}

    </motion.div>
  );
};

export default NotesPage;
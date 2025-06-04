import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, Edit3, Trash2, Pin, Search, Palette, StickyNote as StickyNoteIcon, Check, Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const noteColors = [
  { name: "Default", class: "bg-card", borderClass: "border-border" },
  { name: "Mint", class: "bg-green-600/10 dark:bg-green-500/10", borderClass: "border-green-500/30" },
  { name: "Sky", class: "bg-blue-600/10 dark:bg-blue-500/10", borderClass: "border-blue-500/30" },
  { name: "Rose", class: "bg-pink-600/10 dark:bg-pink-500/10", borderClass: "border-pink-500/30" },
  { name: "Sun", class: "bg-yellow-600/10 dark:bg-yellow-500/10", borderClass: "border-yellow-500/30" },
  { name: "Lavender", class: "bg-purple-600/10 dark:bg-purple-500/10", borderClass: "border-purple-500/30" },
];

const NotesPage = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: null, title: "", content: "", pinned: false, color: noteColors[0].class, borderClass: noteColors[0].borderClass, tags: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem("projectSahurNotesV3");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projectSahurNotesV3", JSON.stringify(notes));
  }, [notes]);

  const applyMarkdown = (syntax, placeholder = "text") => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd, value } = textareaRef.current;
    const selectedText = value.substring(selectionStart, selectionEnd);
    let newText;
    if (syntax === "link") {
      newText = `${value.substring(0, selectionStart)}[${selectedText || placeholder}](url)${value.substring(selectionEnd)}`;
    } else if (syntax === "ul" || syntax === "ol") {
      const prefix = syntax === "ul" ? "- " : "1. ";
      newText = `${value.substring(0, selectionStart)}${prefix}${selectedText || placeholder}${value.substring(selectionEnd)}`;
    } else {
      const marker = syntax === "bold" ? "**" : syntax === "italic" ? "*" : syntax === "underline" ? "<u>" : "";
      const endMarker = syntax === "underline" ? "</u>" : marker;
      newText = `${value.substring(0, selectionStart)}${marker}${selectedText || placeholder}${endMarker}${value.substring(selectionEnd)}`;
    }
    setCurrentNote(prev => ({ ...prev, content: newText }));
    textareaRef.current.focus();
  };

  const handleSaveNote = () => {
    if (currentNote.content.trim() === "") {
      toast({ title: "Oops!", description: "Note content cannot be empty.", variant: "destructive" });
      return;
    }
    if (currentNote.id) { 
      setNotes(notes.map(note => note.id === currentNote.id ? {...currentNote, updatedAt: new Date().toISOString()} : note));
      toast({ title: "Note Updated!", description: `Note "${currentNote.title || 'Untitled'}" was updated.`});
    } else { 
      const newNote = { ...currentNote, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setNotes([newNote, ...notes]);
      toast({ title: "Note Added!", description: `Note "${newNote.title || 'Untitled'}" was added.`});
    }
    setCurrentNote({ id: null, title: "", content: "", pinned: false, color: noteColors[0].class, borderClass: noteColors[0].borderClass, tags: [] });
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
    setCurrentNote({ id: null, title: "", content: "", pinned: false, color: noteColors[0].class, borderClass: noteColors[0].borderClass, tags: [] });
    setShowForm(true);
  };

  const togglePin = (id) => {
    setNotes(notes.map(note => note.id === id ? { ...note, pinned: !note.pinned } : note));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !currentNote.tags.includes(currentTag.trim())) {
      setCurrentNote(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }));
    }
    setCurrentTag("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setCurrentNote(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };
  
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => b.pinned - a.pinned || new Date(b.updatedAt) - new Date(a.updatedAt));


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 text-foreground"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center"><StickyNoteIcon className="mr-3 h-7 w-7 text-primary dark:text-primary"/>My Notes</h1>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-52">
                <Input 
                    type="text"
                    placeholder="Search notes or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={handleNewNoteClick} size="sm" className="h-9 text-xs">
                <PlusCircle className="mr-2 h-4 w-4" /> New Note
            </Button>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="mb-6">
        <Card className={`widget-card ${currentNote.color} ${currentNote.borderClass} border-2`}>
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-lg text-foreground">{currentNote.id ? "Edit Note" : "Create New Note"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="text"
              placeholder="Note Title (optional)"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              className="w-full text-sm"
            />
            <div className="flex gap-1 border border-border p-1 rounded-md">
                <Button variant="ghost" size="icon" onClick={() => applyMarkdown("bold")} title="Bold" className="h-7 w-7"><Bold className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => applyMarkdown("italic")} title="Italic" className="h-7 w-7"><Italic className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => applyMarkdown("underline")} title="Underline" className="h-7 w-7"><Underline className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => applyMarkdown("ul")} title="Unordered List" className="h-7 w-7"><List className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => applyMarkdown("ol")} title="Ordered List" className="h-7 w-7"><ListOrdered className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => applyMarkdown("link")} title="Link" className="h-7 w-7"><LinkIcon className="h-4 w-4"/></Button>
            </div>
            <Textarea
              ref={textareaRef}
              placeholder="Write your note (Markdown supported)..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              rows="8"
              className="w-full text-sm min-h-[150px]"
            />
            <div className="flex items-center gap-2">
                <Input 
                    type="text" 
                    placeholder="Add tag..." 
                    value={currentTag} 
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="h-8 text-xs flex-grow"
                />
                <Button onClick={handleAddTag} size="sm" variant="outline" className="h-8 text-xs">Add Tag</Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {currentNote.tags.map(tag => (
                    <span key={tag} className="bg-primary/20 dark:bg-primary/20 text-primary dark:text-primary text-xs px-2 py-0.5 rounded-full flex items-center">
                        {tag}
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveTag(tag)} className="ml-1 h-4 w-4 text-primary/70 dark:text-primary/70 hover:text-primary dark:hover:text-primary"><Trash2 className="h-3 w-3"/></Button>
                    </span>
                ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-3">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs"><Palette className="mr-2 h-4 w-4"/>Color</Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-popover border-border">
                    <div className="flex gap-1.5">
                    {noteColors.map(color => (
                        <Button key={color.name} title={color.name} variant="outline" size="icon" onClick={() => setCurrentNote({...currentNote, color: color.class, borderClass: color.borderClass})} className={`h-7 w-7 rounded-full ${color.class.split(' ')[0]} ${color.borderClass} border-2 ${currentNote.color === color.class ? 'ring-2 ring-offset-1 ring-ring ring-offset-background' : ''}`}>
                           {currentNote.color === color.class && <Check className="h-4 w-4"/>}
                        </Button>
                    ))}
                    </div>
                </PopoverContent>
            </Popover>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowForm(false)} className="h-8 text-xs">Cancel</Button>
                <Button onClick={handleSaveNote} size="sm" className="h-8 text-xs">{currentNote.id ? "Update" : "Save"} Note</Button>
            </div>
          </CardFooter>
        </Card>
        </motion.div>
      )}
      
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration:0.2 }}
              layout
            >
              <Card className={`widget-card h-full flex flex-col ${note.color} ${note.borderClass} border-2 hover:shadow-xl transition-shadow`}>
                <CardHeader className="pb-2 pt-3">
                  {note.title && <CardTitle className="text-md text-foreground truncate">{note.title}</CardTitle>}
                  <p className="text-xs text-muted-foreground">{new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </CardHeader>
                <CardContent className="flex-grow pt-1 min-h-[80px]">
                  <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-1 text-sm text-muted-foreground line-clamp-6 markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-2 border-t border-border/50">
                  <Button variant="ghost" size="icon" onClick={() => togglePin(note.id)} className={`text-muted-foreground hover:text-yellow-500 dark:hover:text-yellow-400 h-7 w-7 ${note.pinned ? 'text-yellow-500 dark:text-yellow-400' : ''}`}>
                    <Pin className={`h-4 w-4 ${note.pinned ? 'fill-current' : ''}`} />
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditNote(note)} className="text-muted-foreground hover:text-primary dark:hover:text-primary h-7 w-7"><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)} className="text-destructive/70 hover:text-destructive h-7 w-7"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardFooter>
                {note.tags.length > 0 && (
                    <div className="px-3 pb-2 pt-1 flex flex-wrap gap-1 border-t border-border/50">
                        {note.tags.slice(0,3).map(tag => <span key={tag} className="text-xs bg-primary/10 dark:bg-primary/10 text-primary dark:text-primary px-1.5 py-0.5 rounded-md">{tag}</span>)}
                        {note.tags.length > 3 && <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-md">+{note.tags.length - 3} more</span>}
                    </div>
                )}
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
          <StickyNoteIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-lg font-semibold mb-1">
            {searchTerm ? "No notes match your search." : "Your notebook is empty."}
          </p>
          <p className="text-sm">
            {searchTerm ? "Try a different search term." : "Create your first note!"}
          </p>
        </motion.div>
      )}

    </motion.div>
  );
};

export default NotesPage;
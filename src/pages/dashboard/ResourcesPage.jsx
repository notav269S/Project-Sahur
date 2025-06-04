import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit3, Trash2, BookHeart, ExternalLink, AlertTriangle, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const ResourcesPage = () => {
  const { toast } = useToast();
  const [links, setLinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(''); 

  useEffect(() => {
    const storedLinks = localStorage.getItem('projectSahurResources');
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projectSahurResources', JSON.stringify(links));
  }, [links]);

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setCategory('');
    setCurrentLink(null);
    setShowForm(false);
  };

  const handleOpenForm = (link = null) => {
    if (link) {
      setCurrentLink(link);
      setTitle(link.title);
      setUrl(link.url);
      setCategory(link.category || '');
    } else {
      setCurrentLink(null);
      setTitle('');
      setUrl('');
      setCategory('');
    }
    setShowForm(true);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;  
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !url) {
      toast({ title: "Missing Fields", description: "Please fill in title and URL.", variant: "destructive" });
      return;
    }
    if (!isValidUrl(url.startsWith('http') ? url : `https://${url}`)) {
        toast({ title: "Invalid URL", description: "Please enter a valid URL (e.g., https://example.com).", variant: "destructive" });
        return;
    }

    const finalUrl = url.startsWith('http') ? url : `https://${url}`;

    const linkData = { 
        id: currentLink ? currentLink.id : uuidv4(),
        title, 
        url: finalUrl, 
        category,
        createdAt: currentLink ? currentLink.createdAt : new Date().toISOString()
    };

    if (currentLink) {
      setLinks(links.map(l => l.id === currentLink.id ? linkData : l));
      toast({ title: "Resource Updated!", description: `"${title}" has been updated.` });
    } else {
      setLinks([linkData, ...links]);
      toast({ title: "Resource Added!", description: `"${title}" has been added.` });
    }
    resetForm();
  };

  const handleDelete = (id) => {
    const linkToDelete = links.find(l => l.id === id);
    setLinks(links.filter(l => l.id !== id));
    toast({ title: "Resource Deleted", description: `"${linkToDelete.title}" removed.` });
  };
  
  const filteredLinks = links.filter(link => 
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (link.category && link.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
          <BookHeart className="mr-3 h-7 w-7 text-primary dark:text-primary"/>Resources
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-52">
                <Input 
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={() => handleOpenForm()} size="sm" className="h-9 text-xs">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Resource
            </Button>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={(isOpen) => { if(!isOpen) resetForm(); else setShowForm(true);}}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">{currentLink ? "Edit Resource" : "Add New Resource"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <Input placeholder="Resource Title (e.g., Course Portal)" value={title} onChange={e => setTitle(e.target.value)} required />
            <Input placeholder="URL (e.g., university.edu/portal)" value={url} onChange={e => setUrl(e.target.value)} required />
            <Input placeholder="Category (Optional, e.g., Research, Math)" value={category} onChange={e => setCategory(e.target.value)} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{currentLink ? "Update" : "Add"} Resource</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {filteredLinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map(link => (
            <Card key={link.id} className="widget-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-foreground truncate flex items-center">
                  {link.title}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-primary dark:text-primary hover:opacity-80">
                    <ExternalLink className="h-4 w-4"/>
                  </a>
                </CardTitle>
                {link.category && <p className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full inline-block mt-1">{link.category}</p>}
              </CardHeader>
              <CardContent className="pt-0">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary dark:text-primary hover:underline truncate block">
                  {link.url}
                </a>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="ghost" size="icon" onClick={() => handleOpenForm(link)} className="text-muted-foreground hover:text-primary dark:hover:text-primary h-7 w-7"><Edit3 className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)} className="text-destructive/70 hover:text-destructive h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
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
          <p className="text-lg font-semibold mb-1">
            {searchTerm ? "No resources match your search." : "No resources saved yet."}
          </p>
          <p className="text-sm">
            {searchTerm ? "Try a different search term." : "Add your frequently used websites for quick access."}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResourcesPage;
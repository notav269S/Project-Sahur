import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit3, Trash2, BookCopy, Layers, RotateCcw, AlertTriangle, CheckCircle, XCircle, HelpCircle as MehCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNow, addDays, parseISO } from 'date-fns';

const FlashcardsPage = () => {
  const { toast } = useToast();
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [showDeckForm, setShowDeckForm] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [editingDeck, setEditingDeck] = useState(null);

  const [showCardForm, setShowCardForm] = useState(false);
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    const storedDecks = localStorage.getItem('projectSahurFlashcardDecksV1');
    if (storedDecks) {
      setDecks(JSON.parse(storedDecks).map(deck => ({
        ...deck,
        cards: deck.cards.map(card => ({
          ...card,
          nextReview: card.nextReview ? parseISO(card.nextReview) : new Date(),
          interval: card.interval || 1,
          easeFactor: card.easeFactor || 2.5,
        }))
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projectSahurFlashcardDecksV1', JSON.stringify(decks));
  }, [decks]);

  const handleDeckSubmit = () => {
    if (!deckName.trim()) {
      toast({ title: "Deck Name Required", description: "Please enter a name for your deck.", variant: "destructive" });
      return;
    }
    if (editingDeck) {
      setDecks(decks.map(d => d.id === editingDeck.id ? { ...d, name: deckName, updatedAt: new Date().toISOString() } : d));
      toast({ title: "Deck Updated!", description: `Deck "${deckName}" updated.` });
    } else {
      const newDeck = { id: uuidv4(), name: deckName, cards: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setDecks([newDeck, ...decks]);
      toast({ title: "Deck Created!", description: `Deck "${deckName}" created.` });
    }
    setDeckName('');
    setShowDeckForm(false);
    setEditingDeck(null);
  };

  const handleDeleteDeck = (deckId) => {
    setDecks(decks.filter(d => d.id !== deckId));
    setSelectedDeck(null);
    toast({ title: "Deck Deleted", description: "The deck and its cards have been removed." });
  };

  const handleCardSubmit = () => {
    if (!cardFront.trim() || !cardBack.trim()) {
      toast({ title: "Card Content Required", description: "Both front and back of the card must have content.", variant: "destructive" });
      return;
    }
    const newCard = { 
      id: editingCard ? editingCard.id : uuidv4(), 
      front: cardFront, 
      back: cardBack, 
      nextReview: new Date(), 
      interval: 1, 
      easeFactor: 2.5 
    };

    const updatedDecks = decks.map(deck => {
      if (deck.id === selectedDeck.id) {
        const updatedCards = editingCard 
          ? deck.cards.map(c => c.id === editingCard.id ? newCard : c)
          : [...deck.cards, newCard];
        return { ...deck, cards: updatedCards, updatedAt: new Date().toISOString() };
      }
      return deck;
    });
    setDecks(updatedDecks);
    setSelectedDeck(updatedDecks.find(d => d.id === selectedDeck.id));
    setCardFront(''); setCardBack(''); setShowCardForm(false); setEditingCard(null);
    toast({ title: editingCard ? "Card Updated!" : "Card Added!", description: "Your flashcard has been saved." });
  };

  const handleDeleteCard = (cardId) => {
     const updatedDecks = decks.map(deck => {
      if (deck.id === selectedDeck.id) {
        return { ...deck, cards: deck.cards.filter(c => c.id !== cardId), updatedAt: new Date().toISOString() };
      }
      return deck;
    });
    setDecks(updatedDecks);
    setSelectedDeck(updatedDecks.find(d => d.id === selectedDeck.id));
    toast({ title: "Card Deleted", description: "The flashcard has been removed." });
  };

  const startReview = (deck) => {
    const cardsToReview = deck.cards.filter(card => new Date(card.nextReview) <= new Date())
                                   .sort((a,b) => new Date(a.nextReview) - new Date(b.nextReview));
    if (cardsToReview.length === 0) {
      toast({ title: "All Caught Up!", description: "No cards due for review in this deck." });
      return;
    }
    setSelectedDeck({ ...deck, cardsToReview });
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleReviewResponse = (quality) => { // quality: 0 (Wrong), 3 (Hard), 4 (Good), 5 (Easy)
    if (!selectedDeck || !selectedDeck.cardsToReview || selectedDeck.cardsToReview.length === 0) return;
    
    const card = selectedDeck.cardsToReview[currentCardIndex];
    let newInterval;
    let newEaseFactor = card.easeFactor;

    if (quality < 3) { // Wrong
      newInterval = 1; // Reset interval
      newEaseFactor = Math.max(1.3, card.easeFactor - 0.2);
    } else { // Correct
      if (card.interval === 1 && quality >=3) { // First correct review
        newInterval = quality === 3 ? 1 : 4; // 1 day for hard, 4 for good/easy
      } else {
        newInterval = Math.round(card.interval * card.easeFactor);
      }
      newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      newEaseFactor = Math.max(1.3, newEaseFactor);
    }
    
    const updatedCard = {
      ...card,
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReview: addDays(new Date(), newInterval),
    };

    const updatedOriginalDecks = decks.map(d => {
      if (d.id === selectedDeck.id) {
        return { ...d, cards: d.cards.map(c => c.id === card.id ? updatedCard : c) };
      }
      return d;
    });
    setDecks(updatedOriginalDecks);

    if (currentCardIndex < selectedDeck.cardsToReview.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      toast({ title: "Review Session Complete!", description: "Great job reviewing this deck." });
      setSelectedDeck(null); // End session
    }
  };
  
  const currentReviewCard = selectedDeck?.cardsToReview?.[currentCardIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 text-foreground"
    >
      {!selectedDeck && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <BookCopy className="mr-3 h-7 w-7 text-primary dark:text-primary"/>Flashcard Decks
            </h1>
            <Button onClick={() => { setEditingDeck(null); setDeckName(''); setShowDeckForm(true); }} size="sm" className="h-9 text-xs">
              <PlusCircle className="mr-2 h-4 w-4" /> New Deck
            </Button>
          </div>
          {decks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map(deck => (
                <Card key={deck.id} className="widget-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground truncate">{deck.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{deck.cards.length} card{deck.cards.length !== 1 && 's'}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {formatDistanceToNow(parseISO(deck.updatedAt), { addSuffix: true })}
                    </p>
                     <p className="text-sm text-muted-foreground">
                      Cards due: {deck.cards.filter(c => new Date(c.nextReview) <= new Date()).length}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button onClick={() => startReview(deck)} size="sm" className="text-xs">Review</Button>
                    <div>
                      <Button variant="ghost" size="icon" onClick={() => { setEditingDeck(deck); setDeckName(deck.name); setShowDeckForm(true);}} className="text-muted-foreground hover:text-primary dark:hover:text-primary h-7 w-7"><Edit3 className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteDeck(deck.id)} className="text-destructive/70 hover:text-destructive h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground mt-10 p-6 border-2 border-dashed border-border rounded-xl">
              <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-lg font-semibold mb-1">No flashcard decks yet.</p>
              <p className="text-sm">Create a new deck to start learning!</p>
            </motion.div>
          )}
        </>
      )}

      {selectedDeck && currentReviewCard && (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-foreground">{selectedDeck.name} - Reviewing Card {currentCardIndex + 1} of {selectedDeck.cardsToReview.length}</h2>
          <motion.div
            className="w-full max-w-md h-64 perspective cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="relative w-full h-full preserve-3d"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="absolute w-full h-full backface-hidden bg-card border-border p-6 flex items-center justify-center">
                <p className="text-xl text-center text-card-foreground">{currentReviewCard.front}</p>
              </Card>
              <Card className="absolute w-full h-full backface-hidden bg-card border-border p-6 flex items-center justify-center rotate-y-180">
                <p className="text-xl text-center text-card-foreground">{currentReviewCard.back}</p>
              </Card>
            </motion.div>
          </motion.div>
          {isFlipped && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-6 flex flex-wrap justify-center gap-2">
              <Button onClick={() => handleReviewResponse(0)} variant="destructive" size="sm" className="text-xs"><XCircle className="mr-1 h-4 w-4"/>Again (Forgot)</Button>
              <Button onClick={() => handleReviewResponse(3)} variant="outline" size="sm" className="text-xs border-orange-500 text-orange-500 hover:bg-orange-500/10"><MehCircle className="mr-1 h-4 w-4"/>Hard</Button>
              <Button onClick={() => handleReviewResponse(4)} variant="outline" size="sm" className="text-xs border-green-500 text-green-500 hover:bg-green-500/10"><CheckCircle className="mr-1 h-4 w-4"/>Good</Button>
              <Button onClick={() => handleReviewResponse(5)} variant="default" size="sm" className="text-xs bg-blue-500 hover:bg-blue-600"><CheckCircle className="mr-1 h-4 w-4"/>Easy</Button>
            </motion.div>
          )}
           <Button onClick={() => setSelectedDeck(null)} variant="link" className="mt-4 text-sm">Back to Decks</Button>
        </div>
      )}
      
      {selectedDeck && !currentReviewCard && decks.find(d => d.id === selectedDeck.id) && ( // Manage cards view
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">Manage Cards in "{selectedDeck.name}"</h2>
                <div>
                    <Button onClick={() => { setEditingCard(null); setCardFront(''); setCardBack(''); setShowCardForm(true); }} size="sm" className="mr-2 text-xs"><PlusCircle className="mr-1 h-4 w-4"/>Add Card</Button>
                    <Button onClick={() => setSelectedDeck(null)} variant="outline" size="sm" className="text-xs">Back to Decks</Button>
                </div>
            </div>
            {decks.find(d => d.id === selectedDeck.id).cards.length > 0 ? (
                <div className="space-y-2">
                    {decks.find(d => d.id === selectedDeck.id).cards.map(card => (
                        <Card key={card.id} className="widget-card p-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Front: {card.front.substring(0,50)}{card.front.length > 50 && "..."}</p>
                                    <p className="text-xs text-muted-foreground">Back: {card.back.substring(0,50)}{card.back.length > 50 && "..."}</p>
                                    <p className="text-xs text-muted-foreground">Next review: {formatDistanceToNow(new Date(card.nextReview), { addSuffix: true })}</p>
                                </div>
                                <div>
                                    <Button variant="ghost" size="icon" onClick={() => {setEditingCard(card); setCardFront(card.front); setCardBack(card.back); setShowCardForm(true);}} className="h-7 w-7"><Edit3 className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCard(card.id)} className="h-7 w-7 text-destructive/70"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : <p className="text-muted-foreground text-center">No cards in this deck yet. Add some!</p>}
        </div>
      )}


      <Dialog open={showDeckForm} onOpenChange={setShowDeckForm}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border text-card-foreground">
          <DialogHeader><DialogTitle className="text-xl text-foreground">{editingDeck ? "Edit Deck" : "Create New Deck"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <Input placeholder="Deck Name" value={deckName} onChange={e => setDeckName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {setShowDeckForm(false); setEditingDeck(null);}}>Cancel</Button>
            <Button onClick={handleDeckSubmit}>{editingDeck ? "Update Deck" : "Create Deck"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCardForm} onOpenChange={setShowCardForm}>
        <DialogContent className="sm:max-w-[525px] bg-card border-border text-card-foreground">
          <DialogHeader><DialogTitle className="text-xl text-foreground">{editingCard ? "Edit Card" : "Add New Card"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea placeholder="Card Front (Question/Term)" value={cardFront} onChange={e => setCardFront(e.target.value)} rows={3}/>
            <Textarea placeholder="Card Back (Answer/Definition)" value={cardBack} onChange={e => setCardBack(e.target.value)} rows={3}/>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {setShowCardForm(false); setEditingCard(null);}}>Cancel</Button>
            <Button onClick={handleCardSubmit}>{editingCard ? "Update Card" : "Add Card"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .perspective { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </motion.div>
  );
};

export default FlashcardsPage;
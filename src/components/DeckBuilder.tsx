
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card as MTGCard, Deck } from "@/utils/mtgTypes";
import { getCardImageUrl } from "@/utils/logParserUtils";
import { Book, Plus, Search, X } from "lucide-react";

const DeckBuilder = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<MTGCard[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [userDecks, setUserDecks] = useState<Deck[]>([]);
  const [cardCounts, setCardCounts] = useState<{[cardId: string]: number}>({});
  const [newDeckName, setNewDeckName] = useState<string>("");

  useEffect(() => {
    // Load saved decks from localStorage
    const savedDecks = localStorage.getItem('mtgDecks');
    if (savedDecks) {
      try {
        const parsed = JSON.parse(savedDecks);
        setUserDecks(parsed);
      } catch (e) {
        console.error("Error parsing saved decks:", e);
      }
    }
  }, []);

  const searchCards = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    try {
      // In a real implementation, this would call the Scryfall API
      // For now, we'll simulate a response
      setTimeout(() => {
        const mockResults: MTGCard[] = [
          { 
            id: 'c1', 
            name: 'Lightning Bolt', 
            manaCost: '{R}', 
            cmc: 1, 
            colors: ['R'], 
            type: 'Instant', 
            rarity: 'Common',
            text: 'Lightning Bolt deals 3 damage to any target.',
            set: 'M10' 
          },
          { 
            id: 'c2', 
            name: 'Counterspell', 
            manaCost: '{U}{U}', 
            cmc: 2, 
            colors: ['U'], 
            type: 'Instant', 
            rarity: 'Common',
            text: 'Counter target spell.',
            set: 'DMR' 
          },
          { 
            id: 'c3', 
            name: 'Birds of Paradise', 
            manaCost: '{G}', 
            cmc: 1, 
            colors: ['G'], 
            type: 'Creature — Bird', 
            rarity: 'Rare',
            text: 'Flying\n{T}: Add one mana of any color.',
            power: '0',
            toughness: '1',
            set: 'M12' 
          },
        ];
        
        setSearchResults(mockResults.filter(card => 
          card.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        setIsSearching(false);
      }, 500);
      
    } catch (error) {
      console.error("Error searching cards:", error);
      setIsSearching(false);
    }
  };

  const addCardToDeck = (card: MTGCard) => {
    if (!currentDeck) {
      // Create a new deck if none exists
      const newDeck: Deck = {
        id: Date.now().toString(),
        name: newDeckName || 'New Deck',
        format: 'Standard',
        cards: { [card.id]: 1 },
        colors: card.colors || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setCurrentDeck(newDeck);
      setUserDecks([...userDecks, newDeck]);
      setCardCounts({ [card.id]: 1 });
      
      // Save to localStorage
      localStorage.setItem('mtgDecks', JSON.stringify([...userDecks, newDeck]));
    } else {
      // Update existing deck
      const updatedDeck = { ...currentDeck };
      const updatedCounts = { ...cardCounts };
      
      // Add card or increment count
      if (updatedDeck.cards[card.id]) {
        updatedDeck.cards[card.id] += 1;
        updatedCounts[card.id] = updatedCounts[card.id] ? updatedCounts[card.id] + 1 : 1;
      } else {
        updatedDeck.cards[card.id] = 1;
        updatedCounts[card.id] = 1;
        
        // Update deck colors if needed
        if (card.colors && card.colors.length > 0) {
          card.colors.forEach(color => {
            if (!updatedDeck.colors.includes(color)) {
              updatedDeck.colors.push(color);
            }
          });
        }
      }
      
      updatedDeck.updatedAt = new Date();
      setCurrentDeck(updatedDeck);
      setCardCounts(updatedCounts);
      
      // Update in userDecks array
      const updatedDecks = userDecks.map(deck => 
        deck.id === currentDeck.id ? updatedDeck : deck
      );
      
      setUserDecks(updatedDecks);
      
      // Save to localStorage
      localStorage.setItem('mtgDecks', JSON.stringify(updatedDecks));
    }
  };

  const removeCardFromDeck = (cardId: string) => {
    if (!currentDeck) return;
    
    const updatedDeck = { ...currentDeck };
    const updatedCounts = { ...cardCounts };
    
    // Decrement count or remove card
    if (updatedDeck.cards[cardId] > 1) {
      updatedDeck.cards[cardId] -= 1;
      updatedCounts[cardId] -= 1;
    } else {
      delete updatedDeck.cards[cardId];
      delete updatedCounts[cardId];
    }
    
    updatedDeck.updatedAt = new Date();
    setCurrentDeck(updatedDeck);
    setCardCounts(updatedCounts);
    
    // Update in userDecks array
    const updatedDecks = userDecks.map(deck => 
      deck.id === currentDeck.id ? updatedDeck : deck
    );
    
    setUserDecks(updatedDecks);
    
    // Save to localStorage
    localStorage.setItem('mtgDecks', JSON.stringify(updatedDecks));
  };

  const createNewDeck = () => {
    if (!newDeckName.trim()) return;
    
    const newDeck: Deck = {
      id: Date.now().toString(),
      name: newDeckName,
      format: 'Standard',
      cards: {},
      colors: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCurrentDeck(newDeck);
    setUserDecks([...userDecks, newDeck]);
    setCardCounts({});
    setNewDeckName("");
    
    // Save to localStorage
    localStorage.setItem('mtgDecks', JSON.stringify([...userDecks, newDeck]));
  };

  const selectDeck = (deck: Deck) => {
    setCurrentDeck(deck);
    
    // Regenerate card counts
    const counts: {[cardId: string]: number} = {};
    Object.entries(deck.cards).forEach(([cardId, quantity]) => {
      counts[cardId] = quantity;
    });
    
    setCardCounts(counts);
  };

  const getCurrentDeckCardCount = () => {
    if (!currentDeck) return 0;
    
    let count = 0;
    Object.values(currentDeck.cards).forEach(quantity => {
      count += quantity;
    });
    
    return count;
  };

  // Mock card data for the current deck display
  const getCurrentDeckCards = (): MTGCard[] => {
    if (!currentDeck) return [];
    
    const mockCardDB: {[id: string]: MTGCard} = {
      'c1': { 
        id: 'c1', 
        name: 'Lightning Bolt', 
        manaCost: '{R}', 
        type: 'Instant', 
        set: 'M10' 
      },
      'c2': { 
        id: 'c2', 
        name: 'Counterspell', 
        manaCost: '{U}{U}', 
        type: 'Instant', 
        set: 'DMR' 
      },
      'c3': { 
        id: 'c3', 
        name: 'Birds of Paradise', 
        manaCost: '{G}', 
        type: 'Creature', 
        set: 'M12' 
      },
    };
    
    return Object.keys(currentDeck.cards).map(cardId => mockCardDB[cardId] || { id: cardId, name: 'Unknown Card' });
  };

  return (
    <Card className="magic-card h-full overflow-hidden">
      <CardHeader className="bg-magic-gradient pb-2">
        <CardTitle className="flex items-center text-white">
          <Book className="mr-2 h-5 w-5 text-magic-accent" />
          <span>Deck Builder</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-full">
        <Tabs defaultValue="builder" className="h-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="collection">My Decks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                className="magic-input"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchCards()}
              />
              <Button className="magic-button" onClick={searchCards} disabled={isSearching}>
                <Search className="h-4 w-4 mr-1" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Search Results</h3>
                <div className="bg-magic-dark/5 rounded-md p-2 max-h-40 overflow-y-auto">
                  {searchResults.map((card) => (
                    <div key={card.id} className="flex justify-between items-center p-1 hover:bg-magic-primary/10 rounded cursor-pointer">
                      <div>
                        <span className="font-medium">{card.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{card.manaCost}</span>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => addCardToDeck(card)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Current Deck */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">
                  {currentDeck ? `${currentDeck.name} (${getCurrentDeckCardCount()})` : "No Deck Selected"}
                </h3>
                
                {!currentDeck && (
                  <div className="flex space-x-2">
                    <Input
                      className="magic-input text-sm h-8"
                      placeholder="New deck name..."
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                    />
                    <Button 
                      size="sm"
                      className="magic-button h-8" 
                      onClick={createNewDeck} 
                      disabled={!newDeckName.trim()}
                    >
                      Create
                    </Button>
                  </div>
                )}
              </div>
              
              {currentDeck && (
                <div className="bg-card rounded-md border max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">Qty</TableHead>
                        <TableHead>Card</TableHead>
                        <TableHead className="w-[100px]">Mana</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentDeckCards().map((card) => (
                        <TableRow key={card.id}>
                          <TableCell className="font-medium">
                            {currentDeck.cards[card.id] || 0}
                          </TableCell>
                          <TableCell>{card.name}</TableCell>
                          <TableCell className="text-xs">{card.manaCost || "-"}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0" 
                              onClick={() => removeCardFromDeck(card.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {getCurrentDeckCards().length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-sm text-muted-foreground">
                            No cards in deck. Search and add cards.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="collection">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Your Decks</h3>
              
              {userDecks.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {userDecks.map((deck) => {
                    // Count total cards in deck
                    let cardCount = 0;
                    Object.values(deck.cards).forEach(qty => cardCount += qty);
                    
                    return (
                      <Card 
                        key={deck.id} 
                        className="cursor-pointer hover:bg-magic-primary/5 transition-colors"
                        onClick={() => selectDeck(deck)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{deck.name}</h4>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <span>{deck.format}</span>
                                <span className="mx-1">•</span>
                                <span>{cardCount} cards</span>
                              </div>
                            </div>
                            
                            <div className="flex">
                              {deck.colors.map((color, i) => (
                                <div 
                                  key={i} 
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold mr-1"
                                  style={{ 
                                    backgroundColor: 
                                      color === 'W' ? '#F0F2C0' : 
                                      color === 'U' ? '#C1D7E9' : 
                                      color === 'B' ? '#424242' : 
                                      color === 'R' ? '#E49977' : 
                                      color === 'G' ? '#A3C095' : '#BFBFBF',
                                    color: color === 'B' ? 'white' : 'black'
                                  }}
                                >
                                  {color}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>You haven't created any decks yet.</p>
                  <p className="text-sm">Switch to the Builder tab to create your first deck.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeckBuilder;

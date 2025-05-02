
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import LogParser from "@/components/LogParser";
import DeckBuilder from "@/components/DeckBuilder";
import GameAdvisor from "@/components/GameAdvisor";
import StatsTracker from "@/components/StatsTracker";
import Overlay from "@/components/Overlay";
import { GameState } from "@/utils/mtgTypes";
import { extractGameState } from "@/utils/logParserUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("parser");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  // Simulate initial game state for demonstration
  useEffect(() => {
    const mockLogEntries = [
      {
        timestamp: new Date().toISOString(),
        type: 'GAME_START',
        data: { gameId: '123456', playerGoesFirst: true },
        raw: '[UnityCrossThreadLogger]<== Seatings.MatchGameRoomStateChangedEvent {...}'
      }
    ];
    
    const initialState = extractGameState(mockLogEntries);
    setGameState(initialState);
  }, []);

  const handleGameStateUpdate = (newState: GameState) => {
    setGameState(newState);
  };

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeDismissed', 'true');
  };

  // Check if welcome screen was previously dismissed
  useEffect(() => {
    const welcomed = localStorage.getItem('welcomeDismissed');
    if (welcomed === 'true') {
      setShowWelcome(false);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "parser":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <LogParser onGameStateUpdate={handleGameStateUpdate} />
            </div>
            <div className="md:col-span-2">
              <GameAdvisor gameState={gameState} />
            </div>
          </div>
        );
      case "deck":
        return <DeckBuilder />;
      case "stats":
        return <StatsTracker />;
      default:
        return <div>Unknown tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <NavBar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onToggleOverlay={toggleOverlay}
        />

        {/* Welcome Card */}
        {showWelcome && (
          <Card className="mb-6 p-6 bg-magic-gradient text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-magic-accent via-magic-primary to-magic-accent animate-pulse-slow"></div>
            
            <div className="flex items-start">
              <Sparkles className="h-8 w-8 mr-4 text-magic-accent animate-glow" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome to SpellScribe Oracle</h2>
                <p className="mb-4 text-white/80">
                  Your magical assistant for MTG Arena that provides AI-powered advice, deck building, and game stats tracking.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 p-3 rounded-md">
                    <h3 className="font-semibold text-magic-accent mb-1">Parse Game Logs</h3>
                    <p className="text-sm text-white/70">Monitor MTG Arena logs in real-time to track your game state.</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-md">
                    <h3 className="font-semibold text-magic-accent mb-1">AI Play Advice</h3>
                    <p className="text-sm text-white/70">Get strategic play recommendations from our AI oracle.</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-md">
                    <h3 className="font-semibold text-magic-accent mb-1">In-Game Overlay</h3>
                    <p className="text-sm text-white/70">Access advice while playing with our customizable overlay.</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="bg-white text-magic-primary hover:bg-white/90"
                    onClick={dismissWelcome}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        <div className="mb-6">
          {renderContent()}
        </div>
      </div>
      
      <Overlay 
        gameState={gameState}
        isVisible={isOverlayVisible}
        onVisibilityChange={setIsOverlayVisible}
      />
    </div>
  );
};

export default Index;

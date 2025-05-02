
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameState } from "@/utils/mtgTypes";
import { getCardImageUrl } from "@/utils/logParserUtils";
import { ArrowLeft, ArrowRight, Minimize, Maximize, Settings } from "lucide-react";
import GameAdvisor from "./GameAdvisor";

interface OverlayProps {
  gameState: GameState | null;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

const Overlay = ({ gameState, isVisible, onVisibilityChange }: OverlayProps) => {
  const [position, setPosition] = useState<string>("right"); // "left", "right", "top", "bottom"
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(0.9);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });

  const positionStyles: { [key: string]: React.CSSProperties } = {
    left: {
      position: "fixed",
      left: isExpanded ? "10px" : "-300px",
      top: "50%",
      transform: "translateY(-50%)",
      transition: "left 0.3s ease",
    },
    right: {
      position: "fixed",
      right: isExpanded ? "10px" : "-300px",
      top: "50%",
      transform: "translateY(-50%)",
      transition: "right 0.3s ease",
    },
    top: {
      position: "fixed",
      top: isExpanded ? "10px" : "-400px",
      left: "50%",
      transform: "translateX(-50%)",
      transition: "top 0.3s ease",
    },
    bottom: {
      position: "fixed",
      bottom: isExpanded ? "10px" : "-400px",
      left: "50%",
      transform: "translateX(-50%)",
      transition: "bottom 0.3s ease",
    },
    custom: {
      position: "fixed",
      left: `${overlayPosition.x}px`,
      top: `${overlayPosition.y}px`,
      transition: isDragging ? "none" : "all 0.3s ease",
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.overlay-handle')) {
      setIsDragging(true);
      setPosition("custom");
      setDragOffset({
        x: e.clientX - overlayPosition.x,
        y: e.clientY - overlayPosition.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setOverlayPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const getPositionStyle = () => {
    return position === "custom" ? positionStyles.custom : positionStyles[position];
  };

  if (!isVisible) return null;

  return (
    <div 
      style={{ 
        ...getPositionStyle(), 
        opacity: opacity,
        zIndex: 9999,
      }}
      onMouseDown={handleMouseDown}
    >
      <Card 
        className="magic-card w-[300px] shadow-lg" 
      >
        {/* Handle for dragging */}
        <div className="overlay-handle bg-magic-gradient px-3 py-1 flex items-center justify-between cursor-move">
          <div className="text-xs font-medium text-white">SpellScribe Oracle</div>
          <div className="flex space-x-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-5 w-5 p-0 text-white hover:text-white hover:bg-white/10" 
              onClick={toggleExpand}
            >
              {isExpanded ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-5 w-5 p-0 text-white hover:text-white hover:bg-white/10" 
              onClick={() => onVisibilityChange(false)}
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <CardContent className="p-2 space-y-2">
            <Tabs defaultValue="advisor" className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-8">
                <TabsTrigger value="advisor" className="text-xs">Oracle Advisor</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="advisor" className="space-y-2 mt-2">
                <GameAdvisor gameState={gameState} />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-2 mt-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Overlay Position</label>
                    <div className="grid grid-cols-4 gap-1">
                      <Button 
                        size="sm" 
                        variant={position === "left" ? "default" : "outline"}
                        className="h-7 text-xs" 
                        onClick={() => setPosition("left")}
                      >
                        Left
                      </Button>
                      <Button 
                        size="sm" 
                        variant={position === "right" ? "default" : "outline"}
                        className="h-7 text-xs" 
                        onClick={() => setPosition("right")}
                      >
                        Right
                      </Button>
                      <Button 
                        size="sm" 
                        variant={position === "top" ? "default" : "outline"}
                        className="h-7 text-xs" 
                        onClick={() => setPosition("top")}
                      >
                        Top
                      </Button>
                      <Button 
                        size="sm" 
                        variant={position === "bottom" ? "default" : "outline"}
                        className="h-7 text-xs" 
                        onClick={() => setPosition("bottom")}
                      >
                        Bottom
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium block mb-1">Opacity: {Math.round(opacity * 100)}%</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1" 
                      step="0.05"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      Drag the overlay header to position it anywhere on screen.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Current game state summary */}
            {gameState && (
              <div className="bg-card-gradient rounded p-2 border border-magic-primary/20">
                <div className="text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Turn: {gameState.turn}</span>
                    <span className="text-muted-foreground">Phase: {gameState.phase}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>You: {gameState.playerLife} ❤️</span>
                    <span>Opp: {gameState.opponentLife} ❤️</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-muted-foreground">Mana Pool: </span>
                    {gameState.playerMana.white > 0 && <span className="mr-1">⚪{gameState.playerMana.white}</span>}
                    {gameState.playerMana.blue > 0 && <span className="mr-1">🔵{gameState.playerMana.blue}</span>}
                    {gameState.playerMana.black > 0 && <span className="mr-1">⚫{gameState.playerMana.black}</span>}
                    {gameState.playerMana.red > 0 && <span className="mr-1">🔴{gameState.playerMana.red}</span>}
                    {gameState.playerMana.green > 0 && <span className="mr-1">🟢{gameState.playerMana.green}</span>}
                    {gameState.playerMana.colorless > 0 && <span>⬜{gameState.playerMana.colorless}</span>}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Overlay;

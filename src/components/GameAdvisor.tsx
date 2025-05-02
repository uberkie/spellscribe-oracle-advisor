
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIAdvice, GameState } from "@/utils/mtgTypes";
import { Sparkles } from "lucide-react";

interface GameAdvisorProps {
  gameState: GameState | null;
}

const GameAdvisor = ({ gameState }: GameAdvisorProps) => {
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  useEffect(() => {
    // When game state changes, we might want to automatically generate new advice
    if (gameState) {
      // For auto-refresh, you could call generateAdvice() here
      // We'll let the user click the button instead for now
    }
  }, [gameState]);

  const generateAdvice = async () => {
    if (!gameState) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an AI model API
      // For now, we'll simulate a response after a delay
      setTimeout(() => {
        const simulatedAdvice: AIAdvice = {
          recommendedPlay: "Play Lightning Bolt targeting opponent's Llanowar Elves",
          reasoning: "Removing the opponent's mana producer will slow down their ability to cast larger threats in the coming turns. Since you have multiple burn spells, using one now to remove a key utility creature is a good tempo play.",
          alternativePlays: [
            "Play Faerie Miscreant to develop your board presence",
            "Cast Opt to find more gas"
          ],
          predictedOpponentResponse: "If the opponent has another mana producer, they'll likely play it next turn. Otherwise, expect them to play a 2-drop creature.",
          confidenceScore: 0.85
        };
        
        setAdvice(simulatedAdvice);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error generating advice:", error);
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = () => {
    // In a real app, we'd store this securely
    localStorage.setItem('aiApiKey', apiKey);
    setShowApiKeyInput(false);
  };

  // Determine if we can generate advice
  const canGenerateAdvice = gameState && gameState.playerHand.length > 0;

  return (
    <Card className="magic-card overflow-hidden">
      <CardHeader className="bg-magic-gradient pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-white">
            <Sparkles className="mr-2 h-5 w-5 text-magic-accent" />
            <span>Oracle Advisor</span>
          </CardTitle>
          
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs border-white/20 text-white hover:bg-white/10"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          >
            API Key
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {showApiKeyInput ? (
          <div className="space-y-2 mb-4">
            <input
              type="password"
              placeholder="Enter your AI model API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="magic-input w-full"
            />
            <Button 
              onClick={handleApiKeySubmit} 
              className="magic-button w-full"
            >
              Save API Key
            </Button>
          </div>
        ) : null}
        
        {!gameState ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Start a game to receive advice</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-semibold">Turn:</span> {gameState.turn} • 
                <span className="font-semibold ml-2">Phase:</span> {gameState.phase}
              </div>
              <Button
                className="magic-button float-element"
                onClick={generateAdvice}
                disabled={!canGenerateAdvice || isLoading}
              >
                {isLoading ? "Analyzing..." : "Get Advice"}
              </Button>
            </div>
            
            {advice ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="bg-magic-primary/5 p-3 rounded-md border border-magic-primary/30">
                  <h3 className="text-lg font-semibold text-magic-primary mb-1">Recommended Play</h3>
                  <p>{advice.recommendedPlay}</p>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-1">Reasoning</h3>
                  <p className="text-sm text-muted-foreground">{advice.reasoning}</p>
                </div>
                
                {advice.alternativePlays && advice.alternativePlays.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold mb-1">Alternative Options</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {advice.alternativePlays.map((play, index) => (
                        <li key={index}>{play}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {advice.predictedOpponentResponse && (
                  <div>
                    <h3 className="text-md font-semibold mb-1">Predicted Opponent Response</h3>
                    <p className="text-sm text-muted-foreground">{advice.predictedOpponentResponse}</p>
                  </div>
                )}
                
                {advice.confidenceScore !== undefined && (
                  <div className="flex items-center text-sm">
                    <span className="font-semibold mr-2">Confidence:</span>
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-magic-accent"
                        style={{ width: `${advice.confidenceScore * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">{Math.round(advice.confidenceScore * 100)}%</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  {isLoading ? "Analyzing game state..." : "Click 'Get Advice' for AI recommendations"}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameAdvisor;

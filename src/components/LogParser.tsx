
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { GameState } from "@/utils/mtgTypes";
import { parseLogFile, watchLogFile } from "@/utils/logParserUtils";
import { BookOpen } from "lucide-react";

interface LogParserProps {
  onGameStateUpdate: (gameState: GameState) => void;
}

const LogParser = ({ onGameStateUpdate }: LogParserProps) => {
  const [logPath, setLogPath] = useState<string>("C:\\Program Files (x86)\\Wizards of the Coast\\MTGA\\MTGA_Data\\Logs\\Logs");
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Idle");

  useEffect(() => {
    // Cleanup function
    let stopWatching: (() => void) | null = null;
    
    return () => {
      if (stopWatching) {
        stopWatching();
      }
    };
  }, []);

  const handleStartWatch = async () => {
    try {
      setStatus("Starting log monitor...");
      // In a production app, we would validate the path here
      
      const stopWatching = watchLogFile((gameState) => {
        onGameStateUpdate(gameState);
        setStatus(`Active - Last update: ${new Date().toLocaleTimeString()}`);
      });
      
      setIsWatching(true);
      setStatus("Log monitor active");
      
      return () => {
        stopWatching();
        setIsWatching(false);
      };
    } catch (error) {
      console.error("Error starting log monitor:", error);
      setStatus("Error: Could not start log monitor");
    }
  };

  const handleStopWatch = () => {
    setIsWatching(false);
    setStatus("Log monitor stopped");
  };

  return (
    <Card className="magic-card p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-magic-accent" />
          <h2 className="text-xl font-semibold">Log Parser</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            className="magic-input flex-1"
            value={logPath}
            onChange={(e) => setLogPath(e.target.value)}
            placeholder="Path to MTGA log files"
          />
          
          {!isWatching ? (
            <Button 
              className="magic-button" 
              onClick={handleStartWatch}
            >
              Start Monitoring
            </Button>
          ) : (
            <Button 
              className="magic-button-outline" 
              onClick={handleStopWatch}
            >
              Stop
            </Button>
          )}
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Status:</span> {status}
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>The log parser monitors your MTG Arena log files to track game state in real-time.</p>
        </div>
      </div>
    </Card>
  );
};

export default LogParser;

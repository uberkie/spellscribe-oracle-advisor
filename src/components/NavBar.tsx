
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  BarChart, 
  Settings, 
  Layers 
} from "lucide-react";

interface NavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggleOverlay: () => void;
}

const NavBar = ({ activeTab, onTabChange, onToggleOverlay }: NavBarProps) => {
  return (
    <div className="flex justify-between items-center bg-magic-gradient p-4 text-white rounded-lg mb-6">
      <div className="flex items-center">
        <BookOpen className="h-6 w-6 mr-2 text-magic-accent" />
        <h1 className="font-semibold text-xl">SpellScribe Oracle</h1>
      </div>
      
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button 
          variant={activeTab === "parser" ? "secondary" : "ghost"}
          className={`text-white hover:bg-white/10 ${activeTab === "parser" ? 'bg-white/20' : ''}`}
          onClick={() => onTabChange("parser")}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Parser</span>
        </Button>
        
        <Button 
          variant={activeTab === "deck" ? "secondary" : "ghost"}
          className={`text-white hover:bg-white/10 ${activeTab === "deck" ? 'bg-white/20' : ''}`}
          onClick={() => onTabChange("deck")}
        >
          <Layers className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Decks</span>
        </Button>
        
        <Button 
          variant={activeTab === "stats" ? "secondary" : "ghost"}
          className={`text-white hover:bg-white/10 ${activeTab === "stats" ? 'bg-white/20' : ''}`}
          onClick={() => onTabChange("stats")}
        >
          <BarChart className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Stats</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="border-white/20 text-white hover:bg-white/10"
          onClick={onToggleOverlay}
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Overlay</span>
        </Button>
      </div>
    </div>
  );
};

export default NavBar;

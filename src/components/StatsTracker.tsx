
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameStats, DeckPerformance } from "@/utils/mtgTypes";
import { BarChart, BarChartHorizontal, PieChart } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsCustomPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  Legend
} from "recharts";

const StatsTracker = () => {
  // Mock data for stats
  const [stats, setStats] = useState<GameStats>({
    totalGames: 42,
    wins: 25,
    losses: 17,
    winRate: 59.5,
    averageGameLength: 11.3,
    mostPlayedCard: "Lightning Bolt",
    mostEffectiveCard: "Counterspell",
    deckPerformance: {
      "deck1": {
        gamesPlayed: 25,
        wins: 18,
        losses: 7,
        winRate: 72,
        averageTurnLength: 10.2
      },
      "deck2": {
        gamesPlayed: 17,
        wins: 7,
        losses: 10,
        winRate: 41.2,
        averageTurnLength: 12.7
      }
    }
  });

  // Mock game history data for charts
  const gameHistoryData = [
    { date: "Jun 1", wins: 3, losses: 1 },
    { date: "Jun 2", wins: 2, losses: 2 },
    { date: "Jun 3", wins: 4, losses: 0 },
    { date: "Jun 4", wins: 1, losses: 3 },
    { date: "Jun 5", wins: 5, losses: 2 },
    { date: "Jun 6", wins: 0, losses: 2 },
    { date: "Jun 7", wins: 3, losses: 1 },
  ];

  // Data for pie chart
  const winLossData = [
    { name: 'Wins', value: stats.wins },
    { name: 'Losses', value: stats.losses },
  ];
  const COLORS = ['#8B5CF6', '#E5DEFF'];

  // Data for deck performance chart
  const deckPerformanceData = Object.entries(stats.deckPerformance).map(([id, data]) => ({
    name: id === "deck1" ? "Izzet Tempo" : "Golgari Midrange",
    winRate: data.winRate,
    gamesPlayed: data.gamesPlayed
  }));

  // Data for most played cards
  const cardPlayData = [
    { name: "Lightning Bolt", count: 37 },
    { name: "Counterspell", count: 28 },
    { name: "Birds of Paradise", count: 22 },
    { name: "Shock", count: 18 },
    { name: "Opt", count: 15 },
  ];

  return (
    <Card className="magic-card h-full overflow-hidden">
      <CardHeader className="bg-magic-gradient pb-2">
        <CardTitle className="flex items-center text-white">
          <BarChart className="mr-2 h-5 w-5 text-magic-accent" />
          <span>Stats Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-full">
        <Tabs defaultValue="overview" className="h-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="decks">Decks</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-magic-primary/10 p-3 rounded-md">
                <div className="text-sm text-magic-primary font-semibold">Total Games</div>
                <div className="text-2xl font-bold">{stats.totalGames}</div>
              </div>
              <div className="bg-magic-primary/10 p-3 rounded-md">
                <div className="text-sm text-magic-primary font-semibold">Win Rate</div>
                <div className="text-2xl font-bold">{stats.winRate}%</div>
              </div>
            </div>
            
            {/* Win/Loss chart */}
            <div className="bg-card p-2 rounded-md border">
              <h3 className="text-sm font-semibold mb-2">Win/Loss Distribution</h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsCustomPieChart>
                    <Pie
                      data={winLossData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {winLossData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsCustomPieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Game history chart */}
            <div className="bg-card p-2 rounded-md border">
              <h3 className="text-sm font-semibold mb-2">Recent Performance</h3>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gameHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis width={25} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="wins" 
                      stackId="1"
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="losses" 
                      stackId="1"
                      stroke="#E5DEFF" 
                      fill="#E5DEFF" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="decks" className="space-y-4">
            <div className="bg-card p-3 rounded-md border">
              <h3 className="text-sm font-semibold mb-2">Deck Performance</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={deckPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8B5CF6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#D946EF" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="winRate" name="Win Rate (%)" fill="#8B5CF6" />
                    <Bar yAxisId="right" dataKey="gamesPlayed" name="Games Played" fill="#D946EF" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Deck Details</h3>
              <div className="bg-card rounded-md border overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-border">
                  <div className="p-3">
                    <h4 className="font-medium text-sm">Izzet Tempo</h4>
                    <div className="text-xs text-muted-foreground mt-1">
                      <div className="flex justify-between">
                        <span>Win Rate:</span>
                        <span className="font-semibold text-magic-primary">72%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Games Played:</span>
                        <span>25</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. Game Length:</span>
                        <span>10.2 turns</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm">Golgari Midrange</h4>
                    <div className="text-xs text-muted-foreground mt-1">
                      <div className="flex justify-between">
                        <span>Win Rate:</span>
                        <span className="font-semibold text-magic-primary">41.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Games Played:</span>
                        <span>17</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. Game Length:</span>
                        <span>12.7 turns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cards" className="space-y-4">
            <div className="bg-card p-3 rounded-md border">
              <h3 className="text-sm font-semibold mb-2">Most Played Cards</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    layout="vertical"
                    data={cardPlayData}
                    margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Card Effectiveness</h3>
              <div className="bg-card rounded-md border p-3">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Counterspell</span>
                      <span className="text-magic-primary font-semibold">92% effective</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1">
                      <div className="bg-magic-primary h-full rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Lightning Bolt</span>
                      <span className="text-magic-primary font-semibold">87% effective</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1">
                      <div className="bg-magic-primary h-full rounded-full" style={{ width: "87%" }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Birds of Paradise</span>
                      <span className="text-magic-primary font-semibold">78% effective</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1">
                      <div className="bg-magic-primary h-full rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatsTracker;

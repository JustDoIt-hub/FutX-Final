import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import TournamentList from "@/components/TournamentList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";

const Tournaments = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch tournaments
  const { 
    data: tournamentsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  // Handle click on tournament card
  const handleTournamentClick = (tournamentId: number) => {
    navigate(`/tournaments/${tournamentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">Error loading tournaments</h3>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const { tournaments = [] } = tournamentsData || {};

  return (
    <div>
      <Navigation activeTab="tournaments" />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
            <p className="text-muted-foreground">
              Join tournaments to compete with other teams and win rewards
            </p>
          </div>
          <Button 
            onClick={() => navigate("/tournaments/create")}
            className="mt-4 md:mt-0"
          >
            Create Tournament
          </Button>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="REGISTRATION">Open</TabsTrigger>
            <TabsTrigger value="IN_PROGRESS">Active</TabsTrigger>
            <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <TournamentList 
              tournaments={tournaments} 
              onDetailsClick={handleTournamentClick}
              filterStatus="ALL"
            />
          </TabsContent>
          <TabsContent value="REGISTRATION">
            <TournamentList 
              tournaments={tournaments} 
              onDetailsClick={handleTournamentClick}
              filterStatus="REGISTRATION"
            />
          </TabsContent>
          <TabsContent value="IN_PROGRESS">
            <TournamentList 
              tournaments={tournaments} 
              onDetailsClick={handleTournamentClick}
              filterStatus="IN_PROGRESS"
            />
          </TabsContent>
          <TabsContent value="COMPLETED">
            <TournamentList 
              tournaments={tournaments} 
              onDetailsClick={handleTournamentClick}
              filterStatus="COMPLETED"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tournaments;
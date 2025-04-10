import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  Coins,
  Trophy,
  Users,
  Clock,
  Loader2,
} from "lucide-react";

const TournamentDetails = () => {
  const params = useParams<{ id: string }>();
  const tournamentId = parseInt(params.id);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  // Fetch tournament details
  const {
    data: tournamentDetails,
    isLoading: isLoadingTournament,
    error: tournamentError,
  } = useQuery({
    queryKey: [`/api/tournaments/${tournamentId}`],
    enabled: !isNaN(tournamentId),
  });

  // Fetch user teams for joining tournament
  const {
    data: teamsData,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Join tournament mutation
  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTeamId) throw new Error("Please select a team");
      const res = await apiRequest("POST", `/api/tournaments/${tournamentId}/join`, {
        tournamentId,
        teamId: selectedTeamId,
      });
      return await res.json();
    },
    onSuccess: () => {
      setIsJoinDialogOpen(false);
      toast({
        title: "Success",
        description: "You have successfully joined the tournament!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tournaments/${tournamentId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join tournament",
        variant: "destructive",
      });
    },
  });

  // Leave tournament mutation
  const leaveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/tournaments/${tournamentId}/leave`, {});
      return await res.json();
    },
    onSuccess: () => {
      setIsLeaveDialogOpen(false);
      toast({
        title: "Success",
        description: "You have left the tournament",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tournaments/${tournamentId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to leave tournament",
        variant: "destructive",
      });
    },
  });

  // Start tournament mutation
  const startMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/tournaments/${tournamentId}/start`, {});
      return await res.json();
    },
    onSuccess: () => {
      setIsStartDialogOpen(false);
      toast({
        title: "Success",
        description: "Tournament has started!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tournaments/${tournamentId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start tournament",
        variant: "destructive",
      });
    },
  });

  if (isLoadingTournament) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tournamentError || !tournamentDetails) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate("/tournaments")}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tournaments
        </Button>
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold mb-2">Error loading tournament</h3>
          <p className="text-muted-foreground mb-4">
            {tournamentError instanceof Error
              ? tournamentError.message
              : "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const { tournament, participants, matches } = tournamentDetails;
  const { teams = [] } = teamsData || {};

  // Check if user is already participating
  const userParticipant = participants.find((p: any) => p.user_id === 1); // Default user ID is 1
  const isParticipating = !!userParticipant && !userParticipant.eliminated;

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "REGISTRATION":
        return "bg-blue-500";
      case "IN_PROGRESS":
        return "bg-yellow-500";
      case "COMPLETED":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Helper function to format status label
  const formatStatus = (status: string) => {
    switch (status) {
      case "REGISTRATION":
        return "Registration Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  // Render tournament bracket if it exists
  const renderBracket = () => {
    if (!tournament.bracket || tournament.status === "REGISTRATION") return null;

    const bracket = tournament.bracket as any;
    const rounds = bracket.rounds;
    
    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Tournament Bracket</h3>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 min-w-[800px]">
            {Array.from({ length: rounds }, (_, i) => i + 1).map((round) => (
              <div key={round} className="flex-1">
                <h4 className="text-sm font-medium mb-2 text-center">
                  {round === 1
                    ? "First Round"
                    : round === rounds
                    ? "Final"
                    : `Round ${round}`}
                </h4>
                <div className="space-y-4">
                  {bracket.matches
                    .filter((match: any) => match.round === round)
                    .map((match: any) => {
                      // Get participant names
                      const homeParticipant = participants.find(
                        (p: any) => p.id === match.homeParticipantId
                      );
                      const awayParticipant = participants.find(
                        (p: any) => p.id === match.awayParticipantId
                      );
                      const winner = participants.find(
                        (p: any) => p.id === match.winnerId
                      );

                      return (
                        <Card
                          key={`${round}-${match.position}`}
                          className={`overflow-hidden ${
                            match.completed ? "border-green-500" : ""
                          }`}
                        >
                          <CardContent className="p-3">
                            <div className="text-xs font-medium mb-1">
                              Match {match.position}
                              {match.completed && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-green-100"
                                >
                                  Completed
                                </Badge>
                              )}
                            </div>
                            <div
                              className={`p-2 rounded ${
                                match.winnerId === match.homeParticipantId
                                  ? "bg-green-100"
                                  : "bg-slate-100"
                              }`}
                            >
                              {homeParticipant ? (
                                <div className="text-sm">
                                  Team: {homeParticipant.team_id}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground italic">
                                  TBD
                                </div>
                              )}
                            </div>
                            <div className="text-center text-xs my-1">vs</div>
                            <div
                              className={`p-2 rounded ${
                                match.winnerId === match.awayParticipantId
                                  ? "bg-green-100"
                                  : "bg-slate-100"
                              }`}
                            >
                              {awayParticipant ? (
                                <div className="text-sm">
                                  Team: {awayParticipant.team_id}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground italic">
                                  TBD
                                </div>
                              )}
                            </div>
                            {match.completed && (
                              <div className="mt-2 text-center text-xs">
                                <Badge variant="secondary">
                                  Winner: Team {winner?.team_id || "Unknown"}
                                </Badge>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        onClick={() => navigate("/tournaments")}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tournaments
      </Button>

      <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{tournament.name}</h1>
              <Badge className={getStatusColor(tournament.status)}>
                {formatStatus(tournament.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground">{tournament.description}</p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {tournament.status === "REGISTRATION" && (
              <>
                {!isParticipating ? (
                  <Button onClick={() => setIsJoinDialogOpen(true)}>
                    Join Tournament
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsLeaveDialogOpen(true)}
                  >
                    Leave Tournament
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsStartDialogOpen(true)}
                >
                  Start Tournament
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>
              {tournament.current_participants} / {tournament.max_participants}{" "}
              Participants
            </span>
          </div>
          <div className="flex items-center">
            <Coins className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{tournament.prize_coins} Coins Prize</span>
          </div>
          {tournament.starts_at && (
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>
                {tournament.status === "REGISTRATION"
                  ? "Starts: "
                  : tournament.status === "IN_PROGRESS"
                  ? "Started: "
                  : "Ended: "}
                {format(
                  new Date(
                    tournament.status === "COMPLETED" && tournament.ends_at
                      ? tournament.ends_at
                      : tournament.starts_at
                  ),
                  "MMM d, yyyy"
                )}
              </span>
            </div>
          )}
        </div>

        {tournament.status === "COMPLETED" && tournament.winner_id && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="h-6 w-6 mr-3 text-yellow-500" />
              <div>
                <h3 className="font-medium">Tournament Champion</h3>
                <p>
                  Team #{tournament.winner_id} has won {tournament.prize_coins} coins!
                </p>
              </div>
            </div>
          </div>
        )}

        {tournament.status === "IN_PROGRESS" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4 flex items-center">
            <Clock className="h-6 w-6 mr-3 text-yellow-500" />
            <div>
              <h3 className="font-medium">Tournament in Progress</h3>
              <p>
                Matches are currently being played. Check the bracket below for updates.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {renderBracket()}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Participants ({participants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length > 0 ? (
                <div className="space-y-2">
                  {participants.map((participant: any) => (
                    <div
                      key={participant.id}
                      className={`p-3 rounded-md border ${
                        participant.eliminated
                          ? "bg-gray-50 text-muted-foreground"
                          : "bg-card"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Team #{participant.team_id}</div>
                          <div className="text-sm text-muted-foreground">
                            Player #{participant.user_id}
                          </div>
                        </div>
                        {participant.eliminated ? (
                          <Badge variant="outline">Eliminated</Badge>
                        ) : tournament.status === "COMPLETED" &&
                          tournament.winner_id === participant.id ? (
                          <Badge className="bg-green-500">Winner</Badge>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No participants yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Join Tournament Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Tournament</DialogTitle>
            <DialogDescription>
              Select one of your teams to participate in this tournament.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label 
              htmlFor="team-select" 
              className="block text-sm font-medium mb-2"
            >
              Select Team
            </label>
            <Select 
              onValueChange={(value) => setSelectedTeamId(Number(value))}
            >
              <SelectTrigger id="team-select">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingTeams ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading teams...
                  </div>
                ) : teamsError ? (
                  <div className="p-2 text-destructive">
                    Error loading teams
                  </div>
                ) : teams.length === 0 ? (
                  <div className="p-2 text-muted-foreground">
                    You don't have any teams
                  </div>
                ) : (
                  teams.map((team: any) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {teams.length === 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                You need to create a team before joining a tournament.{" "}
                <Link 
                  href="/teams"
                  className="text-primary hover:underline"
                >
                  Create a team
                </Link>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsJoinDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => joinMutation.mutate()}
              disabled={joinMutation.isPending || !selectedTeamId || teams.length === 0}
            >
              {joinMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Join Tournament
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Tournament Dialog */}
      <AlertDialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Tournament?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this tournament? Your spot will be
              given up and you'll need to rejoin if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => leaveMutation.mutate()}
              disabled={leaveMutation.isPending}
            >
              {leaveMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Leave Tournament
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Start Tournament Dialog */}
      <AlertDialog open={isStartDialogOpen} onOpenChange={setIsStartDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Tournament?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start this tournament now? Registration will
              close immediately and matches will begin. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => startMutation.mutate()}
              disabled={startMutation.isPending}
            >
              {startMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Start Tournament
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TournamentDetails;
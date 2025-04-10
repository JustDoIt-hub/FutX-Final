import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Calendar, Users, Trophy } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";

interface Tournament {
  id: number;
  name: string;
  description: string;
  status: "REGISTRATION" | "IN_PROGRESS" | "COMPLETED";
  max_participants: number;
  current_participants: number;
  prize_coins: number;
  starts_at: string | null;
  ends_at: string | null;
  winner_id: number | null;
}

interface TournamentListProps {
  tournaments: Tournament[];
  onDetailsClick: (tournamentId: number) => void;
  filterStatus?: "REGISTRATION" | "IN_PROGRESS" | "COMPLETED" | "ALL";
}

const TournamentList = ({
  tournaments,
  onDetailsClick,
  filterStatus = "ALL",
}: TournamentListProps) => {
  const [, navigate] = useLocation();

  // Filter tournaments by status if filter is provided
  const filteredTournaments =
    filterStatus === "ALL"
      ? tournaments
      : tournaments.filter((tournament) => tournament.status === filterStatus);

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

  if (filteredTournaments.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
        <p className="text-muted-foreground">
          {filterStatus === "REGISTRATION"
            ? "There are no open tournaments at the moment. Check back later or create your own!"
            : filterStatus === "IN_PROGRESS"
            ? "There are no tournaments in progress at the moment."
            : filterStatus === "COMPLETED"
            ? "There are no completed tournaments yet."
            : "There are no tournaments available at the moment."}
        </p>
        <Button className="mt-4" onClick={() => navigate("/tournaments/create")}>
          Create Tournament
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTournaments.map((tournament) => (
        <Card key={tournament.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{tournament.name}</CardTitle>
              <Badge className={getStatusColor(tournament.status)}>
                {formatStatus(tournament.status)}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2 h-10">
              {tournament.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {tournament.current_participants} / {tournament.max_participants} Participants
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Coins className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{tournament.prize_coins} Coins Prize</span>
              </div>
              {tournament.starts_at && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
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
              {tournament.status === "COMPLETED" && tournament.winner_id && (
                <div className="flex items-center text-sm">
                  <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Winner: Player #{tournament.winner_id}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="default"
              className="w-full"
              onClick={() => onDetailsClick(tournament.id)}
            >
              {tournament.status === "REGISTRATION"
                ? "Join Tournament"
                : "View Details"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TournamentList;
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  max_participants: z.coerce
    .number()
    .min(2, "Tournament must have at least 2 participants")
    .max(32, "Tournament can have at most 32 participants"),
  prize_coins: z.coerce
    .number()
    .min(100, "Prize must be at least 100 coins")
    .max(10000, "Prize can be at most 10000 coins"),
});

type FormValues = z.infer<typeof formSchema>;

const TournamentCreate = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      max_participants: 8,
      prize_coins: 1000,
    },
  });

  // Handle form submission
  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest("POST", "/api/tournaments", values);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Tournament created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      navigate(`/tournaments/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tournament",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values);
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

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create Tournament</h1>
        <p className="text-muted-foreground">
          Set up a new tournament for players to compete in
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tournament Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tournament name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a memorable name for your tournament
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your tournament"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about the tournament, rules, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="max_participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Participants</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={2}
                          max={32}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of teams that can participate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prize_coins"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prize (Coins)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={100}
                          max={10000}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Reward for the tournament winner
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Tournament
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Tournament Info</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">How Tournaments Work</p>
                  <p className="text-muted-foreground mt-1">
                    Tournaments allow players to compete with their teams in a 
                    bracket-style competition. Winners advance to the next round until
                    a champion is crowned.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium">Participant Requirements</p>
                  <p className="text-muted-foreground mt-1">
                    Each player can join with one team. Make sure you have created
                    a team with your best players before hosting or joining a tournament.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium">Prizes</p>
                  <p className="text-muted-foreground mt-1">
                    The tournament winner receives the entire prize pool. Choose
                    a fair amount of coins to make your tournament attractive.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium">Number of Participants</p>
                  <p className="text-muted-foreground mt-1">
                    Tournament brackets work best with powers of 2 (4, 8, 16, 32).
                    You can choose any number, but smaller tournaments finish faster.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TournamentCreate;
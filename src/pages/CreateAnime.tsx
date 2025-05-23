
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react";
import AnimeForm from "@/components/AnimeForm";
import AdminNavbar from "@/components/AdminNavbar";
import { Anime } from "@/types/anime";
import { createAnime } from "@/lib/animeData";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const CreateAnime = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAnime = async (animeData: Omit<Anime, "id">) => {
    try {
      setIsSubmitting(true);
      await createAnime(animeData);
      toast({
        title: "Success",
        description: "Anime created successfully",
        variant: "default"
      });
      navigate("/admin");
    } catch (error) {
      console.error("Error creating anime:", error);
      toast({
        title: "Error",
        description: "Failed to create anime",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin")}
              className="h-9 w-9 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Add New Anime</h1>
              <p className="text-muted-foreground text-sm">Create a new anime entry with episodes</p>
            </div>
          </div>
          
          <Button 
            type="submit"
            form="anime-create-form"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            Create Anime
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">
                <span className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  New Anime Details
                </span>
              </CardTitle>
              <CardDescription>
                Fill in the anime details and add episode links below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimeForm 
                id="anime-create-form"
                onSubmit={handleCreateAnime} 
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateAnime;

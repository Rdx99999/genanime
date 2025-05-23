
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save, FileEdit } from "lucide-react";
import AnimeForm from "@/components/AnimeForm";
import AdminNavbar from "@/components/AdminNavbar";
import { Anime } from "@/types/anime";
import { getAnimeById, updateAnime } from "@/lib/animeData";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const EditAnime = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchAnime = async () => {
      try {
        setIsLoading(true);
        const data = await getAnimeById(id);
        setAnime(data);
      } catch (err) {
        console.error("Error fetching anime:", err);
        setError("Failed to load anime data");
        toast({
          title: "Error",
          description: "Failed to load anime data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, [id, toast]);

  const handleUpdateAnime = async (animeData: Omit<Anime, "id">) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updateAnime(id, animeData);
      toast({
        title: "Success",
        description: "Anime updated successfully",
        variant: "default"
      });
      navigate("/admin");
    } catch (error) {
      console.error("Error updating anime:", error);
      toast({
        title: "Error",
        description: "Failed to update anime",
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
              <h1 className="text-2xl font-bold">Edit Anime</h1>
              <p className="text-muted-foreground text-sm">Update anime details and episodes</p>
            </div>
          </div>
          
          {!isLoading && anime && (
            <Button 
              type="submit"
              form="anime-edit-form"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading anime data...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="w-full border-destructive/50">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-destructive/10 p-3 mb-4">
                <FileEdit className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{error}</h2>
              <p className="text-muted-foreground mb-4">Unable to load the anime data. Please try again.</p>
              <Button onClick={() => navigate("/admin")}>Return to Admin Dashboard</Button>
            </CardContent>
          </Card>
        ) : anime ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">
                  <span className="flex items-center gap-2">
                    <FileEdit className="h-5 w-5 text-primary" />
                    Editing: {anime.title}
                  </span>
                </CardTitle>
                <CardDescription>
                  Make changes to the anime details and episode links below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimeForm 
                  id="anime-edit-form"
                  initialData={anime} 
                  onSubmit={handleUpdateAnime} 
                  isEditing={true}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="w-full border-destructive/50">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-destructive/10 p-3 mb-4">
                <FileEdit className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Anime Not Found</h2>
              <p className="text-muted-foreground mb-4">We couldn't find the anime you're looking for.</p>
              <Button onClick={() => navigate("/admin")}>Return to Admin Dashboard</Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EditAnime;

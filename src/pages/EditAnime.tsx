
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import AnimeForm from "@/components/AnimeForm";
import AdminNavbar from "@/components/AdminNavbar";
import { Anime } from "@/types/anime";
import { getAnimeById, updateAnime } from "@/lib/animeData";
import { useToast } from "@/hooks/use-toast";

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
      <div className="container mx-auto py-6 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Edit Anime</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading anime data...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => navigate("/admin")}>Go Back</Button>
          </div>
        ) : anime ? (
          <div className="bg-card rounded-lg border p-6">
            <AnimeForm 
              initialData={anime} 
              onSubmit={handleUpdateAnime} 
              isEditing={true}
            />
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-destructive mb-4">Anime not found</p>
            <Button onClick={() => navigate("/admin")}>Go Back</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditAnime;

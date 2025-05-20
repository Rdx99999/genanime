
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnimeForm from "@/components/AnimeForm";
import AdminNavbar from "@/components/AdminNavbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getAnimeById, createAnime, updateAnime } from "@/lib/animeData";
import { Anime } from "@/types/anime";
import { useToast } from "@/hooks/use-toast";

const AnimeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      loadAnime(id);
    }
  }, [id]);

  const loadAnime = async (animeId: string) => {
    try {
      setLoading(true);
      const data = await getAnimeById(animeId);
      setAnime(data);
    } catch (error) {
      console.error("Error loading anime:", error);
      setError("Failed to load anime data");
      toast({
        title: "Error",
        description: "Failed to load anime data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (animeData: Omit<Anime, "id">) => {
    try {
      setLoading(true);
      if (isEditing && id) {
        await updateAnime(id, animeData);
        toast({
          title: "Success",
          description: "Anime updated successfully",
          variant: "default"
        });
      } else {
        await createAnime(animeData);
        toast({
          title: "Success",
          description: "Anime created successfully",
          variant: "default"
        });
      }
      navigate("/admin");
    } catch (error) {
      console.error("Error saving anime:", error);
      toast({
        title: "Error",
        description: "Failed to save anime",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <div className="container mx-auto py-6 px-4">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin
        </Button>

        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? "Edit Anime" : "Add New Anime"}
        </h1>

        {loading && !anime && isEditing ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading anime data...</span>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => id && loadAnime(id)}>Try Again</Button>
          </div>
        ) : (
          <AnimeForm
            initialData={anime || undefined}
            onSubmit={handleSubmit}
            isEditing={isEditing}
          />
        )}
      </div>
    </div>
  );
};

export default AnimeEditor;

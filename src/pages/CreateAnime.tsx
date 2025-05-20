
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AnimeForm from "@/components/AnimeForm";
import AdminNavbar from "@/components/AdminNavbar";
import { Anime } from "@/types/anime";
import { createAnime } from "@/lib/animeData";
import { useToast } from "@/hooks/use-toast";

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
      <div className="container mx-auto py-6 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Create New Anime</h1>
        
        <div className="bg-card rounded-lg border p-6">
          <AnimeForm 
            onSubmit={handleCreateAnime} 
            isEditing={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateAnime;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Anime, DownloadLink } from "@/types/anime";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface AnimeFormProps {
  initialData?: Anime;
  onSubmit: (animeData: Omit<Anime, "id">) => void;
  isEditing?: boolean;
}

const AnimeForm = ({ initialData, onSubmit, isEditing = false }: AnimeFormProps) => {
  const [formData, setFormData] = useState<Omit<Anime, "id">>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    releaseYear: initialData?.releaseYear || new Date().getFullYear(),
    genres: initialData?.genres || [],
    episodes: initialData?.episodes || 1,
    downloadLinks: initialData?.downloadLinks || [],
  });

  const [newGenre, setNewGenre] = useState("");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "episodes" || name === "releaseYear" ? parseInt(value, 10) : value,
    }));
  };

  const addGenre = () => {
    if (newGenre.trim() && !formData.genres.includes(newGenre.trim())) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, newGenre.trim()]
      }));
      setNewGenre("");
    }
  };

  const removeGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre)
    }));
  };

  const addDownloadLink = () => {
    const newLink: DownloadLink = {
      id: uuidv4(),
      quality: "720p",
      url: "",
      episodeNumber: 1
    };
    
    setFormData(prev => ({
      ...prev,
      downloadLinks: [...prev.downloadLinks, newLink]
    }));
  };

  const updateDownloadLink = (id: string, field: keyof DownloadLink, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map(link => 
        link.id === id 
          ? { ...link, [field]: field === "episodeNumber" ? parseInt(value.toString(), 10) : value } 
          : link
      )
    }));
  };

  const removeDownloadLink = (id: string) => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.filter(link => link.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Anime title"
            />
          </div>
          
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                name="releaseYear"
                type="number"
                value={formData.releaseYear}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="episodes">Episodes</Label>
              <Input
                id="episodes"
                name="episodes"
                type="number"
                value={formData.episodes}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
          </div>
          
          <div>
            <Label>Genres</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.genres.map(genre => (
                <div key={genre} className="bg-secondary text-foreground px-2 py-1 rounded-md flex items-center gap-1">
                  {genre}
                  <button
                    type="button"
                    onClick={() => removeGenre(genre)}
                    className="text-foreground/70 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                placeholder="Add genre"
              />
              <Button type="button" size="sm" onClick={addGenre}>Add</Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Anime description"
              className="h-32"
            />
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between items-center">
                Download Links
                <Button type="button" variant="outline" size="sm" onClick={addDownloadLink}>
                  <Plus className="h-4 w-4 mr-1" /> Add Link
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.downloadLinks.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No download links added yet
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.downloadLinks.map((link) => (
                    <div key={link.id} className="border rounded-md p-3">
                      <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-1">
                          <Label htmlFor={`quality-${link.id}`}>Quality</Label>
                          <Input
                            id={`quality-${link.id}`}
                            value={link.quality}
                            onChange={(e) => updateDownloadLink(link.id, "quality", e.target.value)}
                            placeholder="720p"
                          />
                        </div>
                        <div className="col-span-1">
                          <Label htmlFor={`episode-${link.id}`}>Episode #</Label>
                          <Input
                            id={`episode-${link.id}`}
                            type="number"
                            min="1"
                            value={link.episodeNumber}
                            onChange={(e) => updateDownloadLink(link.id, "episodeNumber", e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor={`url-${link.id}`}>URL</Label>
                          <Input
                            id={`url-${link.id}`}
                            value={link.url}
                            onChange={(e) => updateDownloadLink(link.id, "url", e.target.value)}
                            placeholder="Download URL"
                          />
                        </div>
                        <div className="col-span-1 flex items-end">
                          <Button 
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDownloadLink(link.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">
          {isEditing ? "Update Anime" : "Create Anime"}
        </Button>
      </div>
    </form>
  );
};

export default AnimeForm;

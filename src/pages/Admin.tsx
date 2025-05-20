import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Check, Edit, Plus, Search, Trash2, X, Loader2, Star, Clock } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import AnimeForm from "@/components/AnimeForm";
import { Anime } from "@/types/anime";
import { 
  getAllAnimes, 
  getAnimeById, 
  createAnime, 
  updateAnime, 
  deleteAnime,
  updateAnimeStatus,
  toggleAnimePopular, 
  toggleAnimeNewRelease 
} from "@/lib/animeData";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // These state variables are now redundant since status is stored in the anime object
  // But we'll keep them for backward compatibility
  const [popularAnimes, setPopularAnimes] = useState<Record<string, boolean>>({});
  const [newReleases, setNewReleases] = useState<Record<string, boolean>>({});

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadAnimes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      if (activeTab === "all") {
        setFilteredAnimes(animes);
      } else if (activeTab === "popular") {
        setFilteredAnimes(animes.filter(anime => popularAnimes[anime.id]));
      } else if (activeTab === "new") {
        setFilteredAnimes(animes.filter(anime => newReleases[anime.id]));
      }
    } else {
      let filtered = animes.filter(
        anime => anime.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (activeTab === "popular") {
        filtered = filtered.filter(anime => popularAnimes[anime.id]);
      } else if (activeTab === "new") {
        filtered = filtered.filter(anime => newReleases[anime.id]);
      }

      setFilteredAnimes(filtered);
    }
  }, [searchQuery, animes, activeTab, popularAnimes, newReleases]);

  const loadAnimes = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAnimes();

      // Initialize our section trackers from database fields
      const popular: Record<string, boolean> = {};
      const newest: Record<string, boolean> = {};

      // Use the database fields to populate our state
      data.forEach(anime => {
        if (anime.isPopular) {
          popular[anime.id] = true;
        }

        if (anime.isNewRelease) {
          newest[anime.id] = true;
        }
      });

      setPopularAnimes(popular);
      setNewReleases(newest);
      setAnimes(data);
      setFilteredAnimes(data);
    } catch (error) {
      console.error("Error loading animes:", error);
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

  const handleCreateAnime = async (animeData: Omit<Anime, "id">) => {
    try {
      await createAnime(animeData);
      await loadAnimes();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Anime created successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Error creating anime:", error);
      toast({
        title: "Error",
        description: "Failed to create anime",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAnime = async (animeData: Omit<Anime, "id">) => {
    if (!selectedAnime) return;

    try {
      await updateAnime(selectedAnime.id, animeData);
      await loadAnimes();
      setIsDialogOpen(false);
      setSelectedAnime(null);
      toast({
        title: "Success",
        description: "Anime updated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating anime:", error);
      toast({
        title: "Error",
        description: "Failed to update anime",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAnime = async () => {
    if (!selectedAnime) return;

    try {
      await deleteAnime(selectedAnime.id);
      await loadAnimes();
      setIsDeleteDialogOpen(false);
      setSelectedAnime(null);
      toast({
        title: "Success",
        description: "Anime deleted successfully",
        variant: "default"
      });
    } catch (error) {
      console.error("Error deleting anime:", error);
      toast({
        title: "Error",
        description: "Failed to delete anime",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (anime: Anime) => {
    setSelectedAnime(anime);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (anime: Anime) => {
    setSelectedAnime(anime);
    setIsDeleteDialogOpen(true);
  };

  const togglePopular = async (animeId: string) => {
    // Get the current state before toggling
    const currentStatus = popularAnimes[animeId] || false;
    const newStatus = !currentStatus;

    // Optimistically update the UI
    setPopularAnimes(prev => ({
      ...prev,
      [animeId]: newStatus
    }));

    try {
      // Update in the database
      await toggleAnimePopular(animeId, newStatus);

      toast({
        title: newStatus ? "Added to Popular" : "Removed from Popular",
        description: `Anime has been ${newStatus ? "added to" : "removed from"} the Popular section`,
        variant: "default"
      });
    } catch (error) {
      // If there's an error, revert the state
      setPopularAnimes(prev => ({
        ...prev,
        [animeId]: !newStatus
      }));

      console.error("Error updating popular status:", error);
      toast({
        title: "Error",
        description: "Failed to update Popular status",
        variant: "destructive"
      });
    }
  };

  const toggleNewRelease = async (animeId: string) => {
    // Get the current state before toggling
    const currentStatus = newReleases[animeId] || false;
    const newStatus = !currentStatus;

    // Optimistically update the UI
    setNewReleases(prev => ({
      ...prev,
      [animeId]: newStatus
    }));

    try {
      // Update in the database
      await toggleAnimeNewRelease(animeId, newStatus);

      toast({
        title: newStatus ? "Added to New Releases" : "Removed from New Releases",
        description: `Anime has been ${newStatus ? "added to" : "removed from"} the New Releases section`,
        variant: "default"
      });
    } catch (error) {
      // If there's an error, revert the state
      setNewReleases(prev => ({
        ...prev,
        [animeId]: !newStatus
      }));

      console.error("Error updating new release status:", error);
      toast({
        title: "Error",
        description: "Failed to update New Release status",
        variant: "destructive"
      });
    }
  };

  const navigateToEdit = (anime: Anime) => {
    navigate(`/admin/anime/${anime.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Anime Management</h1>
          <Button onClick={() => navigate('/admin/anime/new')}>
            <Plus className="mr-2 h-4 w-4" /> Add New Anime
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Anime</TabsTrigger>
            <TabsTrigger value="popular">Popular Anime</TabsTrigger>
            <TabsTrigger value="new">New Releases</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Anime Collection</CardTitle>
                <CardDescription>
                  Manage your anime entries and download links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search anime..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <span>Loading anime data...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => loadAnimes()}>Try Again</Button>
                  </div>
                ) : filteredAnimes.length === 0 ? (
                  <div className="text-center py-10">
                    {searchQuery ? (
                      <p className="text-muted-foreground">No anime found matching your search criteria</p>
                    ) : (
                      <p className="text-muted-foreground">No anime added yet. Create your first anime!</p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Episodes</TableHead>
                          <TableHead>Popular</TableHead>
                          <TableHead>New Release</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAnimes.map((anime) => (
                          <TableRow key={anime.id}>
                            <TableCell className="font-medium">{anime.title}</TableCell>
                            <TableCell>{anime.releaseYear}</TableCell>
                            <TableCell>{anime.episodes}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id={`popular-${anime.id}`} 
                                  checked={!!popularAnimes[anime.id]}
                                  onCheckedChange={() => togglePopular(anime.id)}
                                />
                                <Label htmlFor={`popular-${anime.id}`} className="sr-only">Popular</Label>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id={`new-${anime.id}`} 
                                  checked={!!newReleases[anime.id]}
                                  onCheckedChange={() => toggleNewRelease(anime.id)}
                                />
                                <Label htmlFor={`new-${anime.id}`} className="sr-only">New Release</Label>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => navigateToEdit(anime)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openDeleteDialog(anime)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Popular Anime
                </CardTitle>
                <CardDescription>
                  Manage animes featured in the Popular section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search popular anime..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <span>Loading anime data...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => loadAnimes()}>Try Again</Button>
                  </div>
                ) : filteredAnimes.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No anime in Popular section yet. Add some using the switches in All Anime tab.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Episodes</TableHead>
                          <TableHead>Popular</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAnimes.map((anime) => (
                          <TableRow key={anime.id}>
                            <TableCell className="font-medium">{anime.title}</TableCell>
                            <TableCell>{anime.releaseYear}</TableCell>
                            <TableCell>{anime.episodes}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id={`popular-tab-${anime.id}`} 
                                  checked={!!popularAnimes[anime.id]}
                                  onCheckedChange={() => togglePopular(anime.id)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => navigateToEdit(anime)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  New Releases
                </CardTitle>
                <CardDescription>
                  Manage animes featured in the New Releases section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search new releases..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <span>Loading anime data...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => loadAnimes()}>Try Again</Button>
                  </div>
                ) : filteredAnimes.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No anime in New Releases section yet. Add some using the switches in All Anime tab.</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Episodes</TableHead>
                          <TableHead>New Release</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAnimes.map((anime) => (
                          <TableRow key={anime.id}>
                            <TableCell className="font-medium">{anime.title}</TableCell>
                            <TableCell>{anime.releaseYear}</TableCell>
                            <TableCell>{anime.episodes}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id={`new-tab-${anime.id}`} 
                                  checked={!!newReleases[anime.id]}
                                  onCheckedChange={() => toggleNewRelease(anime.id)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => navigateToEdit(anime)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{selectedAnime?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAnime}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
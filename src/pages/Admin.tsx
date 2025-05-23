
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Check, Edit, Plus, Search, Trash2, X, Loader2, Star, Clock, Info, Eye } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { Anime } from "@/types/anime";
import { 
  getAllAnimes, 
  getAnimeById, 
  deleteAnime,
  toggleAnimePopular, 
  toggleAnimeNewRelease 
} from "@/lib/animeData";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Admin = () => {
  const navigate = useNavigate();
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // These state variables track feature status for UI display
  const [popularAnimes, setPopularAnimes] = useState<Record<string, boolean>>({});
  const [newReleases, setNewReleases] = useState<Record<string, boolean>>({});

  const { toast } = useToast();

  useEffect(() => {
    loadAnimes();
  }, []);

  useEffect(() => {
    let filtered = animes;
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        anime => anime.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (activeTab === "popular") {
      filtered = filtered.filter(anime => popularAnimes[anime.id]);
    } else if (activeTab === "new") {
      filtered = filtered.filter(anime => newReleases[anime.id]);
    }
    
    // Sort animes by title for easier navigation
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    
    setFilteredAnimes(filtered);
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
    navigate(`/admin/edit/${anime.id}`);
  };

  const openDetailView = (anime: Anime) => {
    navigate(`/anime/${anime.id}`);
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

  const renderAnimeStatus = (anime: Anime) => {
    return (
      <div className="flex flex-wrap gap-1">
        {popularAnimes[anime.id] && (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">
            <Star className="w-3 h-3 mr-1" /> Popular
          </Badge>
        )}
        {newReleases[anime.id] && (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">
            <Clock className="w-3 h-3 mr-1" /> New Release
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Anime Management</h1>
            <p className="text-muted-foreground">Manage your anime collection and featured content</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => loadAnimes()}>
              <Loader2 className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button onClick={() => navigate("/admin/create")}>
              <Plus className="mr-2 h-4 w-4" /> Add New Anime
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="flex items-center justify-center">
              <Info className="h-4 w-4 mr-2" /> All Anime 
              <Badge className="ml-2 bg-primary/20">{animes.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center justify-center">
              <Star className="h-4 w-4 mr-2" /> Popular
              <Badge className="ml-2 bg-yellow-500/20 text-yellow-500">
                {Object.values(popularAnimes).filter(Boolean).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center justify-center">
              <Clock className="h-4 w-4 mr-2" /> New Releases
              <Badge className="ml-2 bg-blue-500/20 text-blue-500">
                {Object.values(newReleases).filter(Boolean).length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search anime by title..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Anime Collection</CardTitle>
                <CardDescription>
                  Manage your anime entries, features, and download links
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                          <TableHead>Title & Info</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead>Features</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAnimes.map((anime) => (
                          <TableRow key={anime.id}>
                            <TableCell>
                              <div className="font-medium">{anime.title}</div>
                              <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 mt-1">
                                <span>{anime.releaseYear}</span>
                                <span>{anime.episodes} episodes</span>
                              </div>
                              <div className="md:hidden mt-2">
                                {renderAnimeStatus(anime)}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {renderAnimeStatus(anime)}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center space-x-2">
                                  <Switch 
                                    id={`popular-${anime.id}`} 
                                    checked={!!popularAnimes[anime.id]}
                                    onCheckedChange={() => togglePopular(anime.id)}
                                  />
                                  <Label htmlFor={`popular-${anime.id}`} className="text-sm">Popular</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch 
                                    id={`new-${anime.id}`} 
                                    checked={!!newReleases[anime.id]}
                                    onCheckedChange={() => toggleNewRelease(anime.id)}
                                  />
                                  <Label htmlFor={`new-${anime.id}`} className="text-sm">New Release</Label>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openDetailView(anime)}
                                  className="hidden md:flex"
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openEditDialog(anime)}
                                >
                                  <Edit className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Edit</span>
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDeleteDialog(anime)}
                                  className="text-destructive border-destructive/20 hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Delete</span>
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
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredAnimes.length} of {animes.length} animes
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Popular Anime
                </CardTitle>
                <CardDescription>
                  Manage animes featured in the Popular section of your website
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                          <TableHead>Title & Info</TableHead>
                          <TableHead>Popular Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAnimes.map((anime) => (
                          <TableRow key={anime.id}>
                            <TableCell>
                              <div className="font-medium">{anime.title}</div>
                              <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 mt-1">
                                <span>{anime.releaseYear}</span>
                                <span>{anime.episodes} episodes</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id={`popular-tab-${anime.id}`} 
                                  checked={!!popularAnimes[anime.id]}
                                  onCheckedChange={() => togglePopular(anime.id)}
                                />
                                <Label htmlFor={`popular-tab-${anime.id}`}>Featured in Popular</Label>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openDetailView(anime)}
                                  className="hidden md:flex"
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openEditDialog(anime)}
                                >
                                  <Edit className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Edit</span>
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
                <CardTitle className="flex items-center text-xl">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  New Releases
                </CardTitle>
                <CardDescription>
                  Manage animes featured in the New Releases section of your website
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                          <TableHead>Title & Info</TableHead>
                          <TableHead>New Release Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAnimes.map((anime) => (
                          <TableRow key={anime.id}>
                            <TableCell>
                              <div className="font-medium">{anime.title}</div>
                              <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 mt-1">
                                <span>{anime.releaseYear}</span>
                                <span>{anime.episodes} episodes</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id={`new-tab-${anime.id}`} 
                                  checked={!!newReleases[anime.id]}
                                  onCheckedChange={() => toggleNewRelease(anime.id)}
                                />
                                <Label htmlFor={`new-tab-${anime.id}`}>Featured in New Releases</Label>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openDetailView(anime)}
                                  className="hidden md:flex"
                                >
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openEditDialog(anime)}
                                >
                                  <Edit className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Edit</span>
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
            <DialogTitle className="text-destructive">Delete Anime</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="mb-2">
              Are you sure you want to delete <strong>"{selectedAnime?.title}"</strong>?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone and will remove all associated data including download links.
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAnime}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;

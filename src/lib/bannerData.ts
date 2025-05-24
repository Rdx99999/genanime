import { Banner } from "@/types/banner";

// In-memory banner storage (you can replace this with database integration later)
let banners: Banner[] = [
  {
    id: "1",
    title: "SOLO LEVELING",
    subtitle: "Entertainment District Arc", 
    description: "Tanjiro and his friends join the Sound Hashira Tengen Uzui on a mission in the Entertainment District.",
    image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/efaa210d-b55f-407c-bec4-101ae2d536cd/de3iif2-1ef9bdfd-043c-4586-ae57-829bd61cc4cc.png/v1/fill/w_1280,h_427,q_80,strp/solo_leveling_banner_by_godakutsu_de3iif2-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDI3IiwicGF0aCI6IlwvZlwvZWZhYTIxMGQtYjU1Zi00MDdjLWJlYzQtMTAxYWUyZDUzNmNkXC9kZTNpaWYyLTFlZjliZGZkLTA0M2MtNDU4Ni1hZTU3LTgyOWJkNjFjYzRjYy5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.pvdQB7bL4EhmLd4oKo3eS1u4fjyubbPS_YYKokRRDQM",
    color: "from-red-600/70 to-orange-600/30",
    rating: "9.2",
    episodes: 24,
    isActive: true,
    order: 1,
    buttonText: "Watch Now",
    buttonAction: "watch"
  },
  {
    id: "2", 
    title: "Attack on Titan",
    subtitle: "Final Season",
    description: "The final battle between humanity and the titans reaches its climactic conclusion.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070",
    color: "from-blue-600/70 to-purple-600/30", 
    rating: "9.5",
    episodes: 12,
    isActive: true,
    order: 2,
    buttonText: "Continue Watching",
    buttonAction: "watch"
  },
  {
    id: "3",
    title: "Demon Slayer", 
    subtitle: "Hashira Training Arc",
    description: "Tanjiro trains with the Hashira to prepare for the final battle against Muzan.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070",
    color: "from-green-600/70 to-teal-600/30",
    rating: "9.0", 
    episodes: 11,
    isActive: true,
    order: 3,
    buttonText: "Start Watching", 
    buttonAction: "watch"
  }
];

export const getAllBanners = async (): Promise<Banner[]> => {
  return banners.sort((a, b) => a.order - b.order);
};

export const getActiveBanners = async (): Promise<Banner[]> => {
  return banners.filter(banner => banner.isActive).sort((a, b) => a.order - b.order);
};

export const getBannerById = async (id: string): Promise<Banner | null> => {
  return banners.find(banner => banner.id === id) || null;
};

export const createBanner = async (bannerData: Omit<Banner, "id">): Promise<Banner> => {
  const newBanner: Banner = {
    ...bannerData,
    id: Date.now().toString()
  };
  banners.push(newBanner);
  return newBanner;
};

export const updateBanner = async (id: string, bannerData: Partial<Banner>): Promise<Banner | null> => {
  const index = banners.findIndex(banner => banner.id === id);
  if (index === -1) return null;
  
  banners[index] = { ...banners[index], ...bannerData };
  return banners[index];
};

export const deleteBanner = async (id: string): Promise<boolean> => {
  const index = banners.findIndex(banner => banner.id === id);
  if (index === -1) return false;
  
  banners.splice(index, 1);
  return true;
};

export const toggleBannerActive = async (id: string): Promise<Banner | null> => {
  const banner = banners.find(b => b.id === id);
  if (!banner) return null;
  
  banner.isActive = !banner.isActive;
  return banner;
};

export const reorderBanners = async (bannerId: string, newOrder: number): Promise<boolean> => {
  const banner = banners.find(b => b.id === bannerId);
  if (!banner) return false;
  
  banner.order = newOrder;
  return true;
};
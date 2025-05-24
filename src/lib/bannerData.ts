import { Banner } from "@/types/banner";
import { supabase } from "@/integrations/supabase/client";

// Get all banners from Supabase
export const getAllBanners = async (): Promise<Banner[]> => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
      throw new Error(error.message);
    }

    // Transform data to match frontend Banner type
    return data.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      image: item.image,
      color: item.color,
      rating: item.rating,
      episodes: item.episodes,
      buttonText: item.button_text,
      buttonAction: item.button_action,
      isActive: item.is_active,
      order: item.display_order,
      animeId: item.anime_id
    }));
  } catch (error) {
    console.error('Error in getAllBanners:', error);
    throw error;
  }
};

// Get only active banners from Supabase
export const getActiveBanners = async (): Promise<Banner[]> => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching active banners:', error);
      throw new Error(error.message);
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      image: item.image,
      color: item.color,
      rating: item.rating,
      episodes: item.episodes,
      buttonText: item.button_text,
      buttonAction: item.button_action,
      isActive: item.is_active,
      order: item.display_order,
      animeId: item.anime_id
    }));
  } catch (error) {
    console.error('Error in getActiveBanners:', error);
    throw error;
  }
};

// Get banner by ID from Supabase
export const getBannerById = async (id: string): Promise<Banner | null> => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching banner by ID:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      image: data.image,
      color: data.color,
      rating: data.rating,
      episodes: data.episodes,
      buttonText: data.button_text,
      buttonAction: data.button_action,
      isActive: data.is_active,
      order: data.display_order,
      animeId: data.anime_id
    };
  } catch (error) {
    console.error('Error in getBannerById:', error);
    return null;
  }
};

// Create new banner in Supabase
export const createBanner = async (bannerData: Omit<Banner, "id">): Promise<Banner> => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .insert([{
        title: bannerData.title,
        subtitle: bannerData.subtitle,
        description: bannerData.description,
        image: bannerData.image,
        color: bannerData.color,
        rating: bannerData.rating,
        episodes: bannerData.episodes,
        button_text: bannerData.buttonText,
        button_action: bannerData.buttonAction,
        is_active: bannerData.isActive,
        display_order: bannerData.order,
        anime_id: bannerData.animeId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating banner:', error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      image: data.image,
      color: data.color,
      rating: data.rating,
      episodes: data.episodes,
      buttonText: data.button_text,
      buttonAction: data.button_action,
      isActive: data.is_active,
      order: data.display_order,
      animeId: data.anime_id
    };
  } catch (error) {
    console.error('Error in createBanner:', error);
    throw error;
  }
};

// Update banner in Supabase
export const updateBanner = async (id: string, bannerData: Partial<Banner>): Promise<Banner | null> => {
  try {
    const updateData: any = {};
    
    if (bannerData.title !== undefined) updateData.title = bannerData.title;
    if (bannerData.subtitle !== undefined) updateData.subtitle = bannerData.subtitle;
    if (bannerData.description !== undefined) updateData.description = bannerData.description;
    if (bannerData.image !== undefined) updateData.image = bannerData.image;
    if (bannerData.color !== undefined) updateData.color = bannerData.color;
    if (bannerData.rating !== undefined) updateData.rating = bannerData.rating;
    if (bannerData.episodes !== undefined) updateData.episodes = bannerData.episodes;
    if (bannerData.buttonText !== undefined) updateData.button_text = bannerData.buttonText;
    if (bannerData.buttonAction !== undefined) updateData.button_action = bannerData.buttonAction;
    if (bannerData.isActive !== undefined) updateData.is_active = bannerData.isActive;
    if (bannerData.order !== undefined) updateData.display_order = bannerData.order;
    if (bannerData.animeId !== undefined) updateData.anime_id = bannerData.animeId;

    const { data, error } = await supabase
      .from('banners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating banner:', error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      image: data.image,
      color: data.color,
      rating: data.rating,
      episodes: data.episodes,
      buttonText: data.button_text,
      buttonAction: data.button_action,
      isActive: data.is_active,
      order: data.display_order,
      animeId: data.anime_id
    };
  } catch (error) {
    console.error('Error in updateBanner:', error);
    return null;
  }
};

// Delete banner from Supabase
export const deleteBanner = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting banner:', error);
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBanner:', error);
    return false;
  }
};

// Toggle banner active status in Supabase
export const toggleBannerActive = async (id: string): Promise<Banner | null> => {
  try {
    // First get current status
    const { data: currentData, error: fetchError } = await supabase
      .from('banners')
      .select('is_active')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching banner status:', fetchError);
      return null;
    }

    // Update with opposite status
    const { data, error } = await supabase
      .from('banners')
      .update({ is_active: !currentData.is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling banner status:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      image: data.image,
      color: data.color,
      rating: data.rating,
      episodes: data.episodes,
      buttonText: data.button_text,
      buttonAction: data.button_action,
      isActive: data.is_active,
      order: data.display_order,
      animeId: data.anime_id
    };
  } catch (error) {
    console.error('Error in toggleBannerActive:', error);
    return null;
  }
};

// Reorder banners in Supabase
export const reorderBanners = async (bannerId: string, newOrder: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('banners')
      .update({ display_order: newOrder })
      .eq('id', bannerId);

    if (error) {
      console.error('Error reordering banner:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in reorderBanners:', error);
    return false;
  }
};
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { Anime, DownloadLink } from "@/types/anime";

// Get all animes from the database
export async function getAllAnimes(): Promise<Anime[]> {
  try {
    const { data, error } = await supabase
      .from('animes')
      .select(`
        id,
        title,
        description,
        image_url,
        release_year,
        episodes,
        genres,
        is_popular,
        is_new_release,
        download_links (
          id,
          quality,
          url,
          episode_number
        )
      `);

    if (error) {
      console.error('Error fetching animes:', error);
      throw new Error(error.message);
    }

    // Transform the data to match our frontend Anime type
    const transformedData: Anime[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      releaseYear: item.release_year,
      episodes: item.episodes,
      genres: item.genres,
      isPopular: item.is_popular,
      isNewRelease: item.is_new_release,
      downloadLinks: item.download_links.map(link => ({
        id: link.id,
        quality: link.quality,
        url: link.url,
        episodeNumber: link.episode_number
      }))
    }));

    return transformedData;
  } catch (error) {
    console.error('Error in getAllAnimes:', error);
    throw error;
  }
}

export const getAnimeById = async (id: string): Promise<Anime | null> => {
  try {
    const { data: anime, error } = await supabase
      .from('animes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !anime) {
      console.error('Error fetching anime by ID:', error);
      throw error;
    }

    const { data: downloadLinks, error: linksError } = await supabase
      .from('download_links')
      .select('*')
      .eq('anime_id', id);

    if (linksError) {
      console.error('Error fetching download links:', linksError);
      throw linksError;
    }

    return {
      id: anime.id,
      title: anime.title,
      description: anime.description,
      imageUrl: anime.image_url,
      coverImage: anime.cover_image,
      releaseYear: anime.release_year,
      episodes: anime.episodes,
      genres: anime.genres,
      isPopular: anime.is_popular,
      isNewRelease: anime.is_new_release,
      downloadLinks: downloadLinks
        ? downloadLinks.map(link => ({
            id: link.id,
            quality: link.quality,
            url: link.url,
            episodeNumber: link.episode_number
          }))
        : []
    };
  } catch (error) {
    console.error('Error in getAnimeById:', error);
    throw error;
  }
};

// Toggle an anime's popular status
export const toggleAnimePopular = async (animeId: string, isPopular: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('animes')
      .update({ is_popular: isPopular })
      .eq('id', animeId);

    if (error) {
      console.error('Error updating popular status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in toggleAnimePopular:', error);
    throw error;
  }
};

// Toggle an anime's new release status
export const toggleAnimeNewRelease = async (animeId: string, isNewRelease: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('animes')
      .update({ is_new_release: isNewRelease })
      .eq('id', animeId);

    if (error) {
      console.error('Error updating new release status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in toggleAnimeNewRelease:', error);
    throw error;
  }
};

// Create a new anime
export const createAnime = async (animeData: Omit<Anime, "id">): Promise<Anime | null> => {
  try {
    const { data: anime, error } = await supabase
      .from('animes')
      .insert({
        title: animeData.title,
        description: animeData.description,
        image_url: animeData.imageUrl,
        cover_image: animeData.coverImage,
        release_year: animeData.releaseYear,
        episodes: animeData.episodes,
        genres: animeData.genres,
        is_popular: animeData.isPopular || false,
        is_new_release: animeData.isNewRelease || false
      })
      .select()
      .single();

    if (error || !anime) {
      console.error('Error creating anime:', error);
      throw error;
    }

    // Insert all download links
    if (animeData.downloadLinks && animeData.downloadLinks.length > 0) {
      const downloadLinksToInsert = animeData.downloadLinks.map(link => ({
        anime_id: anime.id,
        quality: link.quality,
        url: link.url,
        episode_number: link.episodeNumber || 1
      }));

      const { error: linksError } = await supabase
        .from('download_links')
        .insert(downloadLinksToInsert);

      if (linksError) {
        console.error('Error creating download links:', linksError);
        throw linksError;
      }
    }

    return {
      id: anime.id,
      title: anime.title,
      description: anime.description,
      imageUrl: anime.image_url,
      releaseYear: anime.release_year,
      episodes: anime.episodes,
      genres: anime.genres,
      isPopular: anime.is_popular,
      isNewRelease: anime.is_new_release,
      downloadLinks: animeData.downloadLinks || []
    };
  } catch (error) {
    console.error('Error in createAnime:', error);
    throw error;
  }
};

// Update an existing anime
export const updateAnime = async (id: string, animeData: Omit<Anime, "id">): Promise<Anime | null> => {
  try {
    // Update anime record
    const { data: anime, error } = await supabase
      .from('animes')
      .update({
        title: animeData.title,
        description: animeData.description,
        image_url: animeData.imageUrl,
        cover_image: animeData.coverImage,
        release_year: animeData.releaseYear,
        episodes: animeData.episodes,
        genres: animeData.genres
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !anime) {
      console.error('Error updating anime:', error);
      throw error;
    }

    // Delete all existing download links
    const { error: deleteError } = await supabase
      .from('download_links')
      .delete()
      .eq('anime_id', id);

    if (deleteError) {
      console.error('Error deleting download links:', deleteError);
      throw deleteError;
    }

    // Insert all new download links
    if (animeData.downloadLinks && animeData.downloadLinks.length > 0) {
      const downloadLinksToInsert = animeData.downloadLinks.map(link => ({
        anime_id: id,
        quality: link.quality,
        url: link.url,
        episode_number: link.episodeNumber || 1
      }));

      const { error: linksError } = await supabase
        .from('download_links')
        .insert(downloadLinksToInsert);

      if (linksError) {
        console.error('Error updating download links:', linksError);
        throw linksError;
      }
    }

    return {
      id: anime.id,
      title: anime.title,
      description: anime.description,
      imageUrl: anime.image_url,
      releaseYear: anime.release_year,
      episodes: anime.episodes,
      genres: anime.genres,
      isPopular: anime.is_popular,
      isNewRelease: anime.is_new_release,
      downloadLinks: animeData.downloadLinks || []
    };
  } catch (error) {
    console.error('Error in updateAnime:', error);
    throw error;
  }
};

// Delete an anime
export const deleteAnime = async (id: string): Promise<boolean> => {
  try {
    // Delete the anime (download links will be deleted due to CASCADE constraint)
    const { error } = await supabase
      .from('animes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting anime:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAnime:', error);
    throw error;
  }
};
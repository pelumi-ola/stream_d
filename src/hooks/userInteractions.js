// hooks/userInteractions.js
import { create } from "zustand";
import axios from "axios";
import { z } from "zod";
import { toast } from "sonner";

const VideoSchema = z.object({
  id: z.number(),
  match_id: z.number(),
  title: z.string(),
  category: z.string(),
  match_date: z.string(),
  thumbnail: z.string(),
  league: z.string(),
  video_url: z.string(),
  country: z.string(),
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const endpoints = {
  watchLater: "/interactions/saved-matches",
  favorite: "/interactions/favorite-matches",
  love: "/interactions/loved-matches",
};

export const useUserInteractions = create((set, get) => ({
  watchLater: [],
  favorite: [],
  love: [],
  loading: false,

  fetchInteractions: async (type, subscriber_id) => {
    if (!subscriber_id) return;

    set({ loading: true });
    try {
      const { data } = await api.get(endpoints[type], {
        params: { subscriber_id },
      });
      const parsed = z.array(VideoSchema).parse(data.data);
      set({ [type]: parsed });
    } catch (error) {
      console.error(
        `❌ Failed to fetch ${type}`,
        error.response?.data || error
      );
      toast.error(`Failed to fetch ${type}`);
    } finally {
      set({ loading: false });
    }
  },

  toggleInteraction: async (type, matchId, subscriber_id) => {
    if (!subscriber_id) throw new Error("No subscriber_id provided");

    const currentItems = get()[type];
    const exists = currentItems.some((i) => i.match_id === matchId);

    if (exists) {
      const removedItem = currentItems.find((i) => i.match_id === matchId);
      set({ [type]: currentItems.filter((i) => i.match_id !== matchId) });

      try {
        const { data } = await api.delete(endpoints[type], {
          data: { subscriber_id, match_id: matchId },
        });

        if (data.success) {
          toast.success(`Removed from ${type}`);
        } else {
          set({ [type]: [...get()[type], removedItem] });
          toast.error(data.message || `Failed to remove from ${type}`);
        }
      } catch (error) {
        set({ [type]: [...get()[type], removedItem] });
        if (axios.isAxiosError(error)) {
          const msg = error.response?.data?.message;
          toast.error(msg || `Failed to remove ${type}`);
        } else {
          toast.error(`Failed to remove ${type}`);
        }
        console.error(
          `❌ Failed to remove ${type}`,
          error.response?.data || error
        );
      }
    } else {
      const newItem = {
        id: Date.now(),
        match_id: matchId,
        subscriber_id,
        created_at: new Date().toISOString(),
      };
      set({ [type]: [...currentItems, newItem] });

      try {
        const { data } = await api.post(endpoints[type], {
          match_id: matchId,
          subscriber_id,
        });

        if (data.success) {
          toast.success(`Added to ${type}`);
        } else {
          set({ [type]: get()[type].filter((i) => i.id !== newItem.id) });
          toast.error(data.message || `Failed to add to ${type}`);
        }
      } catch (error) {
        set({ [type]: get()[type].filter((i) => i.id !== newItem.id) });
        if (axios.isAxiosError(error)) {
          const msg = error.response?.data?.message;
          toast.error(msg || `Failed to add ${type}`);
        } else {
          toast.error(`Failed to add ${type}`);
        }
        console.error(
          `❌ Failed to add ${type}`,
          error.response?.data || error
        );
      }
    }
  },

  removeInteraction: async (type, matchId, subscriber_id) => {
    if (!subscriber_id) throw new Error("No subscriber_id provided");

    const currentItems = get()[type];
    const removedItem = currentItems.find((i) => i.match_id === matchId);
    set({ [type]: currentItems.filter((i) => i.match_id !== matchId) });

    try {
      const { data } = await api.delete(endpoints[type], {
        data: { subscriber_id, match_id: matchId },
      });

      if (data.success) {
        toast.success(`Removed from ${type}`);
      } else {
        // rollback if server failed
        set({ [type]: [...get()[type], removedItem] });
        toast.error(data.message || `Failed to remove from ${type}`);
      }
    } catch (error) {
      // rollback
      set({ [type]: [...get()[type], removedItem] });
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;
        toast.error(msg || `Failed to remove ${type}`);
      } else {
        toast.error(`Failed to remove ${type}`);
      }
      console.error(
        `❌ Failed to remove ${type}`,
        error.response?.data || error
      );
    }
  },

  isFavorite: (matchId) => get().favorite.some((i) => i.match_id === matchId),
  isWatchLater: (matchId) =>
    get().watchLater.some((i) => i.match_id === matchId),
  isLoved: (matchId) => get().love.some((i) => i.match_id === matchId),
}));

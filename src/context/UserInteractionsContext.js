"use client";

import { createContext, useContext, useState } from "react";
import { useUserInteractions } from "@/hooks/userInteractions";

const UserInteractionsContext = createContext();

export function UserInteractionsProvider({ children }) {
  const {
    fetchInteractions,
    isFavorite,
    isWatchLater,
    isLoved,
    toggleInteraction,
  } = useUserInteractions();

  // Global state holder
  const [loaded, setLoaded] = useState(false);

  const loadAllInteractions = async (subscriber_id) => {
    if (!subscriber_id) return;
    await Promise.all([
      fetchInteractions("favorite", subscriber_id),
      fetchInteractions("watchLater", subscriber_id),
      fetchInteractions("love", subscriber_id),
    ]);
    setLoaded(true);
  };

  return (
    <UserInteractionsContext.Provider
      value={{
        isFavorite,
        isWatchLater,
        isLoved,
        toggleInteraction,
        loadAllInteractions,
        loaded,
      }}
    >
      {children}
    </UserInteractionsContext.Provider>
  );
}

export function useUserInteractionsContext() {
  return useContext(UserInteractionsContext);
}

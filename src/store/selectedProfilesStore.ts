import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface SelectedProfilesStore {
  selectedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => boolean;
  removeProfile: (identifier: string) => void;
  toggleProfile: (profile: UserProfileSummary) => boolean;
  clearProfiles: () => void;
  isSelected: (identifier: string) => boolean;
}

function getProfileIdentifier(profile: Partial<UserProfileSummary> | null | undefined) {
  return (
    profile?.username ??
    profile?.handle ??
    profile?.user_id ??
    profile?.fullname ??
    ""
  ).toLowerCase();
}

export const useSelectedProfilesStore = create<SelectedProfilesStore>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],
      addProfile: (profile) => {
        const identifier = getProfileIdentifier(profile);
        const exists = get().selectedProfiles.some(
          (item) => getProfileIdentifier(item) === identifier
        );

        if (exists || !identifier) {
          return false;
        }

        set((state) => ({
          selectedProfiles: [profile, ...state.selectedProfiles],
        }));

        return true;
      },
      removeProfile: (identifier) =>
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (item) => getProfileIdentifier(item) !== identifier.toLowerCase()
          ),
        })),
      toggleProfile: (profile) => {
        const identifier = getProfileIdentifier(profile);
        const exists = get().selectedProfiles.some(
          (item) => getProfileIdentifier(item) === identifier
        );

        if (exists) {
          get().removeProfile(identifier);
          return false;
        }

        get().addProfile(profile);
        return true;
      },
      clearProfiles: () => set({ selectedProfiles: [] }),
      isSelected: (identifier) =>
        get().selectedProfiles.some(
          (item) => getProfileIdentifier(item) === identifier.toLowerCase()
        ),
    }),
    {
      name: "wobb-selected-profiles",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedProfiles: state.selectedProfiles }),
    }
  )
);

import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {profiles.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 py-16 px-6 text-center dark:border-slate-800 dark:bg-slate-900/30 animate-[fadeIn_0.5s_ease-out]">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">
            🔍
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">No profiles found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            We couldn't find anyone matching "{searchQuery}". Try a different term.
          </p>
        </div>
      )}
      {profiles.map((profile, index) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          searchQuery={searchQuery}
          onProfileClick={onProfileClick}
          index={index}
        />
      ))}
    </div>
  );
}

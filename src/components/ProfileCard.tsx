import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { useSelectedProfilesStore } from "@/store/selectedProfilesStore";
import { VerifiedBadge } from "./VerifiedBadge";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
  index?: number;
}

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M followers";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K followers";
  return count + " followers";
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
  index = 0,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { isSelected, toggleProfile } = useSelectedProfilesStore();
  const [imageError, setImageError] = useState(false);
  const profileIdentity =
    profile.username ?? profile.handle ?? profile.fullname ?? profile.user_id;
  const selected = isSelected(profileIdentity);

  const handleClick = () => {
    const username = profileIdentity;
    if (onProfileClick) onProfileClick(username);
    if (!document.startViewTransition) {
      navigate(`/profile/${encodeURIComponent(username)}?platform=${platform}`);
    } else {
      document.startViewTransition(() => {
        navigate(`/profile/${encodeURIComponent(username)}?platform=${platform}`);
      });
    }
  };

  const handleAddToList = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleProfile(profile);
  };

  // Add a slight stagger effect based on index
  const animationDelay = `${Math.min(index * 50, 300)}ms`;

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col w-full aspect-[4/5] sm:aspect-square cursor-pointer items-center justify-between gap-3 rounded-[2rem] border border-slate-200/60 bg-white/70 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/50 hover:bg-white hover:shadow-xl hover:shadow-violet-500/10 dark:border-slate-800/60 dark:bg-slate-900/60 dark:hover:border-violet-500/30 dark:hover:bg-slate-900 animate-[fadeIn_0.5s_ease-out_both]"
      style={{ animationDelay }}
      data-search={searchQuery}
    >
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-2xl font-bold text-slate-500 shadow-inner dark:from-slate-800 dark:to-slate-900 mt-2">
        {!imageError && profile.picture ? (
          <img
            src={profile.picture}
            alt={profile.fullname}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <span>{profile.fullname?.slice(0, 2).toUpperCase() || "U"}</span>
        )}
      </div>
      <div className="flex flex-col items-center min-w-0 w-full">
        <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900 dark:text-slate-100 truncate text-lg w-full">
          <span className="truncate">@{profileIdentity}</span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="truncate text-sm text-slate-500 dark:text-slate-400 font-medium w-full">
          {profile.fullname}
        </div>
        <div className="mt-1 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {formatFollowersLocal(profile.followers)}
        </div>
      </div>
      <div className="w-full mt-auto pt-2">
        <button
          type="button"
          className={`w-full btn btn-md ${selected ? "btn-secondary" : "btn-primary"}`}
          onClick={handleAddToList}
        >
          {selected ? "Selected" : "Add"}
        </button>
      </div>
    </div>
  );
}

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
    navigate(`/profile/${encodeURIComponent(username)}?platform=${platform}`);
  };

  const handleAddToList = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleProfile(profile);
  };

  return (
    <div
      onClick={handleClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
      data-search={searchQuery}
    >
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
        {!imageError && profile.picture ? (
          <img
            src={profile.picture}
            alt={profile.fullname}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{profile.fullname?.slice(0, 2).toUpperCase() || "U"}</span>
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="font-semibold text-slate-900">
          @{profileIdentity}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-slate-600">{profile.fullname}</div>
        <div className="text-sm text-slate-500">
          {formatFollowersLocal(profile.followers)}
        </div>
      </div>
      <button
        type="button"
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          selected
            ? "bg-violet-600 text-white shadow-sm"
            : "bg-slate-100 text-slate-700 hover:bg-violet-50 hover:text-violet-700"
        }`}
        onClick={handleAddToList}
      >
        {selected ? "Selected" : "Add to List"}
      </button>
    </div>
  );
}

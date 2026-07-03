import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useSelectedProfilesStore } from "@/store/selectedProfilesStore";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { loadProfileByUsername } from "@/utils/profileLoader";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isSelected, toggleProfile } = useSelectedProfilesStore();

  useEffect(() => {
    if (!username) return;
    loadProfileByUsername(username, platform as Platform).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [platform, username]);

  if (!username) {
    return (
      <Layout>
        <div className="flex h-[50vh] flex-col items-center justify-center text-center">
          <p className="text-xl font-medium text-slate-900 dark:text-white">Invalid profile</p>
          <Link to="/" viewTransition className="mt-4 text-violet-600 hover:underline dark:text-violet-400">Return to Search</Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600 dark:border-slate-800 dark:border-t-violet-500" />
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex h-[50vh] flex-col items-center justify-center text-center">
          <p className="text-xl font-medium text-red-600 dark:text-red-400">Could not load profile details for {username}</p>
          <Link to="/" viewTransition className="mt-4 rounded-full bg-slate-100 px-6 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">Back to search</Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const userIdentity = user.username ?? user.handle ?? user.fullname ?? user.user_id;
  const selected = isSelected(userIdentity);

  const stats = [
    { label: "Followers", value: formatFollowersDetail(user.followers), show: true },
    { label: "Engagement", value: user.engagement_rate !== undefined ? (user.engagement_rate * 10000).toFixed(2) + "%" : null, show: user.engagement_rate !== undefined },
    { label: "Posts", value: user.posts_count, show: user.posts_count !== undefined && user.posts_count > 0 },
    { label: "Avg Likes", value: user.avg_likes ? formatFollowersDetail(user.avg_likes) : null, show: user.avg_likes !== undefined && user.avg_likes > 0 },
    { label: "Total Likes", value: user.total_likes ? formatFollowersDetail(user.total_likes) : null, show: user.total_likes !== undefined && user.total_likes > 0 },
    { label: "Avg Comments", value: user.avg_comments, show: user.avg_comments !== undefined && user.avg_comments > 0 },
    { label: "Avg Views", value: user.avg_views ? formatFollowersDetail(user.avg_views) : null, show: user.avg_views !== undefined && user.avg_views > 0 },
    { label: "Avg Shares", value: user.avg_shares, show: user.avg_shares !== undefined && user.avg_shares > 0 },
    { label: "Avg Saves", value: user.avg_saves, show: user.avg_saves !== undefined && user.avg_saves > 0 },
    { label: "Gender", value: user.gender, show: !!user.gender },
    { label: "Age Group", value: user.age_group, show: !!user.age_group },
    { label: "Language", value: user.language?.name, show: !!user.language?.name },
  ].filter(s => s.show);

  return (
    <Layout title={user.fullname}>
      <div className="mx-auto max-w-4xl">
        <Link to="/" viewTransition className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to search
        </Link>

        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/80 shadow-2xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-none animate-[fadeIn_0.5s_ease-out]">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-sky-500 opacity-20 dark:opacity-40" />
          
          <div className="relative px-8 pb-10 sm:px-12 sm:pb-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              {/* Profile Image & Basic Info */}
              <div className="-mt-16 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl dark:border-slate-900 dark:bg-slate-800 sm:h-40 sm:w-40">
                  {!imageError && user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.fullname}
                      className="h-full w-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-400">
                      {user.fullname?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                
                <div className="pb-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                      @{userIdentity}
                    </h1>
                    <div className="scale-125 origin-left">
                      <VerifiedBadge verified={user.is_verified} />
                    </div>
                  </div>
                  <p className="mt-1 text-lg font-medium text-slate-600 dark:text-slate-400">{user.fullname}</p>
                  <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {platform}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-3 pb-2">
                <button
                  type="button"
                  onClick={() => toggleProfile(user)}
                  className={`btn btn-lg w-full sm:w-auto ${selected ? "btn-secondary" : "btn-primary"}`}
                >
                  {selected ? "In List" : "Add to List"}
                </button>
                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    title="View on platform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            {user.description && (
              <div className="mt-10 max-w-3xl">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Bio</h3>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {user.description}
                </p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="mt-12">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {stats.map((stat, i) => (
                  <div 
                    key={stat.label} 
                    className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-transform hover:-translate-y-1 dark:border-slate-800/50 dark:bg-slate-900/50 animate-[fadeIn_0.5s_ease-out_both]"
                    style={{ animationDelay: `${i * 50 + 200}ms` }}
                  >
                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

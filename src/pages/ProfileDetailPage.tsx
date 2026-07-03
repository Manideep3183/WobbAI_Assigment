import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useSelectedProfilesStore } from "@/store/selectedProfilesStore";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
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
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
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
        <p>Invalid profile</p>
        <Link to="/">Back</Link>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-gray-400">Loading...</p>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-red-600 mb-4">
          Could not load profile details for {username}
        </p>
        <Link to="/" className="text-blue-600 underline">
          Back to search
        </Link>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const userIdentity = user.username ?? user.handle ?? user.fullname ?? user.user_id;
  const selected = isSelected(userIdentity);

  return (
    <Layout title={user.fullname}>
      <Link to="/" className="mb-4 inline-block text-sm font-medium text-violet-600">
        ← Back to search
      </Link>

      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-start">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-200 text-xl font-semibold text-slate-600">
          {!imageError && user.picture ? (
            <img
              src={user.picture}
              alt={user.fullname}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span>{user.fullname?.slice(0, 2).toUpperCase() || "U"}</span>
          )}
        </div>
        <div className="flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              @{userIdentity}
            </h2>
            <VerifiedBadge verified={user.is_verified} />
          </div>
          <p className="mt-1 text-slate-600">{user.fullname}</p>
          <p className="mt-2 text-sm text-slate-500">Platform: {platform}</p>

          {user.description && (
            <p className="mt-4 text-sm leading-6 text-slate-700">{user.description}</p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-slate-500">Followers</div>
              <div className="mt-1 font-semibold text-slate-900">
                {formatFollowersDetail(user.followers)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-slate-500">Engagement Rate</div>
              <div className="mt-1 font-semibold text-slate-900">
                {user.engagement_rate !== undefined
                  ? (user.engagement_rate * 10000).toFixed(2) + "%"
                  : "N/A"}
              </div>
            </div>
            {user.posts_count !== undefined && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-slate-500">Posts</div>
                <div className="mt-1 font-semibold text-slate-900">{user.posts_count}</div>
              </div>
            )}
            {user.avg_likes !== undefined && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-slate-500">Avg Likes</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {formatFollowersDetail(user.avg_likes)}
                </div>
              </div>
            )}
            {user.avg_comments !== undefined && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-slate-500">Avg Comments</div>
                <div className="mt-1 font-semibold text-slate-900">{user.avg_comments}</div>
              </div>
            )}
            {user.avg_views !== undefined && user.avg_views > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-slate-500">Avg Views</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {formatFollowersDetail(user.avg_views)}
                </div>
              </div>
            )}
            {user.engagements !== undefined && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-slate-500">Engagements</div>
                <div className="mt-1 font-semibold text-slate-900">
                  {formatEngagementRate(user.engagement_rate)}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {user.url && (
              <a
                href={user.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                View on platform →
              </a>
            )}
            <button
              type="button"
              onClick={() => toggleProfile(user)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selected
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-violet-50 text-violet-700 hover:bg-violet-100"
              }`}
            >
              {selected ? "Remove from List" : "Add to List"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

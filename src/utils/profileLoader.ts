import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { FullUserProfile, Platform, ProfileDetailResponse, SearchData, UserProfileSummary } from "@/types";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

const searchDataByPlatform: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

function getFallbackUsername(profile: Partial<UserProfileSummary>) {
  return (
    profile.username ??
    profile.handle ??
    profile.user_id ??
    profile.fullname?.replace(/\s+/g, "").toLowerCase() ??
    "profile"
  );
}

function createFallbackProfile(
  profile: Partial<UserProfileSummary>,
  platform: Platform | "unknown"
): FullUserProfile {
  const username = getFallbackUsername(profile);

  return {
    ...profile,
    username,
    fullname: profile.fullname ?? username,
    followers: profile.followers ?? 0,
    is_verified: profile.is_verified ?? false,
    picture: profile.picture ?? "",
    url: profile.url ?? "",
    description:
      platform === "unknown"
        ? "Detailed profile context is not available in the local dataset, so this view uses the search summary as a fallback."
        : `This ${platform} profile is available from the search index. Detailed profile context is not available in the local dataset yet.`,
    posts_count: 0,
    avg_likes: 0,
    avg_comments: 0,
    engagements: profile.engagements,
    engagement_rate: profile.engagement_rate,
    avg_views: profile.avg_views,
  } as FullUserProfile;
}

function findProfileInSearchData(
  username: string,
  platform: Platform | "unknown"
): UserProfileSummary | null {
  const platformsToSearch: Platform[] =
    platform === "unknown" ? ["instagram", "youtube", "tiktok"] : [platform];

  for (const currentPlatform of platformsToSearch) {
    const match = searchDataByPlatform[currentPlatform].accounts.find((entry) => {
      const candidate = entry.account.user_profile;
      const candidateUsername = (
        candidate.username ?? candidate.handle ?? candidate.user_id ?? candidate.fullname
      ).toLowerCase();
      return candidateUsername === username.toLowerCase();
    });

    if (match) {
      return match.account.user_profile;
    }
  }

  return null;
}

export async function loadProfileByUsername(
  username: string,
  platform: Platform | "unknown" = "unknown"
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];

  if (loader) {
    const result = await loader();
    const data =
      (result as { default?: ProfileDetailResponse }).default ?? result;
    return data as ProfileDetailResponse;
  }

  const fallbackProfile = findProfileInSearchData(username, platform);
  if (!fallbackProfile) {
    return null;
  }

  return {
    data: {
      success: true,
      user_profile: createFallbackProfile(fallbackProfile, platform),
    },
  };
}

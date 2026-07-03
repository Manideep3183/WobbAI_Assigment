import { useMemo, useState } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { useSelectedProfilesStore } from "@/store/selectedProfilesStore";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { getPlatformLabel } from "@/utils/dataHelpers";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedProfiles, removeProfile, clearProfiles } = useSelectedProfilesStore();

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  return (
    <Layout title="Find your next creator">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-sky-500 p-8 text-white shadow-xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-100">
            Curated search workspace
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Discover creators and build a shortlist in seconds.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-violet-50 sm:text-base">
            Search across Instagram, YouTube, and TikTok, then save the profiles you want to revisit later.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <PlatformFilter
              selected={platform}
              onChange={(p) => {
                setPlatform(p);
                setSearchQuery("");
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {filtered.length} of {allProfiles.length} on {getPlatformLabel(platform)}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {searchQuery ? `Filter: ${searchQuery}` : "All results"}
              </span>
            </div>

            <ProfileList
              profiles={filtered}
              platform={platform}
              searchQuery={searchQuery}
              onProfileClick={() => undefined}
            />
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                  Selected list
                </p>
                <h3 className="mt-1 text-xl font-semibold">{selectedProfiles.length} saved</h3>
              </div>
              {selectedProfiles.length > 0 && (
                <button
                  type="button"
                  onClick={clearProfiles}
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-5 space-y-3">
              {selectedProfiles.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                  Add creators to this shortlist to keep track of who stands out.
                </div>
              ) : (
                selectedProfiles.map((profile) => (
                  <div
                    key={profile.user_id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">@{profile.username ?? profile.handle ?? profile.fullname}</p>
                      <p className="truncate text-xs text-slate-400">{profile.fullname}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProfile(profile.username ?? profile.handle ?? profile.fullname)}
                      className="text-xs font-medium text-slate-300 transition hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

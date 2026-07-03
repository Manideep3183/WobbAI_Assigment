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
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-16 sm:px-12 sm:py-20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-fuchsia-600/20 to-blue-600/30 mix-blend-screen" />
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-violet-200 backdrop-blur-md">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Curated Workspace
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Discover creators and build a shortlist in seconds.
            </h2>
            <p className="mt-4 max-w-lg text-lg text-slate-300 leading-relaxed">
              Search across Instagram, YouTube, and TikTok. Save the profiles that fit your brand to revisit later.
            </p>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px] items-start">
          {/* Main Content Area */}
          <section className="min-w-0">
            <PlatformFilter
              selected={platform}
              onChange={(p) => {
                setPlatform(p);
                setSearchQuery("");
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Showing <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> of {allProfiles.length} on {getPlatformLabel(platform)}
              </span>
              {searchQuery && (
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 border border-violet-100 dark:border-violet-500/20">
                  Filter: {searchQuery}
                </span>
              )}
            </div>

            <ProfileList
              profiles={filtered}
              platform={platform}
              searchQuery={searchQuery}
              onProfileClick={() => undefined}
            />
          </section>

          {/* Sidebar Area */}
          <aside className="sticky top-6 flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Selected list
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedProfiles.length} saved
                </h3>
              </div>
              {selectedProfiles.length > 0 && (
                <button
                  type="button"
                  onClick={clearProfiles}
                  className="btn btn-sm btn-secondary text-red-500 dark:text-red-400"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {selectedProfiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 px-4 text-center dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="mb-2 text-2xl opacity-50">✨</div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Add creators to this shortlist to keep track of who stands out.
                  </p>
                </div>
              ) : (
                selectedProfiles.map((profile, index) => {
                  const name = profile.username ?? profile.handle ?? profile.fullname;
                  return (
                    <div
                      key={profile.user_id}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-violet-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-violet-500/30 animate-[fadeIn_0.3s_ease-out_both]"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                        {profile.picture ? (
                          <img src={profile.picture} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
                            {name?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          @{name}
                        </p>
                        <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                          {profile.fullname}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProfile(name)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:bg-slate-800 dark:hover:bg-red-900/30"
                        title="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

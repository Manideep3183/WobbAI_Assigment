# Wobb Influencer Search Assignment

This is the completed frontend assignment for building a polished influencer discovery experience with search, profile details, and a persistent shortlist feature.

## Getting Started

```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view the app.

To run tests:
```bash
npm run test
```

## What Was Changed

1. **Bug Fixes & Error Handling**: Fixed issues with missing user details, empty metrics, and broken image URLs by implementing graceful fallbacks. Wrote a node script to download external avatars locally to bypass 403 Forbidden hotlinking blocks.
2. **UI/UX Redesign**: Replaced the entire interface with a modern, premium aesthetic. Introduced a responsive CSS grid, cohesive button classes (`.btn`), beautiful empty states, hover interactions, and utilized the native View Transitions API for seamless cross-fade page routing.
3. **State Management**: Completely ripped out the old React Context API and replaced it with a Zustand store.
4. **Select Profile & Add to List**: Implemented the persistent shortlist feature using `zustand/middleware` for `localStorage`. Handled duplicates, toggles, and deletion.
5. **Code Quality**: Cleaned up the TypeScript interfaces in `types/index.ts`, separated concerns into reusable components (`ProfileCard.tsx`, `PlatformFilter.tsx`), and enforced standard React patterns.
6. **Testing**: Integrated Vitest and React Testing Library and wrote unit tests for the Zustand store and core components.

## Libraries Added

- **Zustand**: Used for lightweight, fast, and un-opinionated state management (replacing React Context).
- **Vitest & React Testing Library**: Used for setting up a robust unit testing environment.
- **jsdom**: Used to simulate the browser environment for Vitest.

## Assumptions Made

- **Local Data Only**: We assumed that the local JSON mock data is the only data source needed, and we shouldn't attempt to build an actual backend fetch implementation.
- **Platform Images**: We assumed it is acceptable to host the provided profile pictures locally (`public/images/`) rather than trying to hotlink directly to Google/YouTube CDNs, which are strictly CORS/403 protected.

## Trade-offs

- **Static vs Dynamic Searching**: Because we are filtering a relatively small local JSON dataset, we opted to filter the data completely synchronously on the client side on every keystroke. For a production app with millions of users, this would need to be debounced and sent as an API query.
- **Tailwind Config**: We opted to stick with Tailwind v4 (the default in the repo) and build custom CSS utility classes in `index.css` rather than installing heavy external component libraries (like MUI or Radix) to keep the bundle size small and maintain full visual control.

## Any Remaining Improvements

- **End-to-End Testing**: Adding Playwright or Cypress for complete E2E testing of the user flows.
- **Accessibility**: While we use semantic HTML and great color contrast, the app could benefit from stricter ARIA labels and robust keyboard navigation indexing for complete ADA compliance.
- **Data Fetching Abstraction**: Abstracting the local JSON imports into a mock API service (like MSW - Mock Service Worker) to better simulate a real-world network delay and loading states.

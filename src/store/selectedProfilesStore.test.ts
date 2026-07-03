import { describe, it, expect, beforeEach } from "vitest";
import { useSelectedProfilesStore } from "./selectedProfilesStore";

const mockProfile1 = {
  user_id: "1",
  username: "testuser1",
  url: "http://example.com/1",
  picture: "",
  fullname: "Test User 1",
  is_verified: false,
  followers: 100,
};

const mockProfile2 = {
  user_id: "2",
  username: "testuser2",
  url: "http://example.com/2",
  picture: "",
  fullname: "Test User 2",
  is_verified: true,
  followers: 200,
};

describe("selectedProfilesStore", () => {
  beforeEach(() => {
    // Clear the store before each test
    const { clearProfiles } = useSelectedProfilesStore.getState();
    clearProfiles();
  });

  it("should start with an empty selected profiles list", () => {
    const { selectedProfiles } = useSelectedProfilesStore.getState();
    expect(selectedProfiles).toEqual([]);
  });

  it("should add a profile", () => {
    const { addProfile } = useSelectedProfilesStore.getState();
    
    const added = addProfile(mockProfile1);
    expect(added).toBe(true);

    const { selectedProfiles, isSelected } = useSelectedProfilesStore.getState();
    expect(selectedProfiles.length).toBe(1);
    expect(selectedProfiles[0]).toEqual(mockProfile1);
    expect(isSelected("testuser1")).toBe(true);
  });

  it("should prevent adding duplicate profiles", () => {
    const { addProfile } = useSelectedProfilesStore.getState();
    
    addProfile(mockProfile1);
    const addedAgain = addProfile(mockProfile1);
    
    expect(addedAgain).toBe(false);
    
    const { selectedProfiles } = useSelectedProfilesStore.getState();
    expect(selectedProfiles.length).toBe(1);
  });

  it("should remove a profile", () => {
    const { addProfile, removeProfile } = useSelectedProfilesStore.getState();
    
    addProfile(mockProfile1);
    addProfile(mockProfile2);
    
    removeProfile("testuser1");
    
    const { selectedProfiles, isSelected } = useSelectedProfilesStore.getState();
    expect(selectedProfiles.length).toBe(1);
    expect(selectedProfiles[0]).toEqual(mockProfile2);
    expect(isSelected("testuser1")).toBe(false);
    expect(isSelected("testuser2")).toBe(true);
  });

  it("should toggle a profile", () => {
    const { toggleProfile } = useSelectedProfilesStore.getState();
    
    // Toggle on
    const isAdded = toggleProfile(mockProfile1);
    expect(isAdded).toBe(true);
    let state = useSelectedProfilesStore.getState();
    expect(state.selectedProfiles.length).toBe(1);

    // Toggle off
    const isAddedAgain = toggleProfile(mockProfile1);
    expect(isAddedAgain).toBe(false);
    state = useSelectedProfilesStore.getState();
    expect(state.selectedProfiles.length).toBe(0);
  });

  it("should clear all profiles", () => {
    const { addProfile, clearProfiles } = useSelectedProfilesStore.getState();
    
    addProfile(mockProfile1);
    addProfile(mockProfile2);
    
    let state = useSelectedProfilesStore.getState();
    expect(state.selectedProfiles.length).toBe(2);

    clearProfiles();
    
    state = useSelectedProfilesStore.getState();
    expect(state.selectedProfiles.length).toBe(0);
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VerifiedBadge } from "./VerifiedBadge";

describe("VerifiedBadge", () => {
  it("should render a checkmark when verified is true", () => {
    render(<VerifiedBadge verified={true} />);
    
    const badge = screen.getByText("✓");
    expect(badge).toBeInTheDocument();
    
    // Check if it has the correct color class
    expect(badge).toHaveClass("text-blue-500");
  });

  it("should render nothing when verified is false", () => {
    const { container } = render(<VerifiedBadge verified={false} />);
    
    // The container should be empty
    expect(container.firstChild).toBeNull();
  });
});

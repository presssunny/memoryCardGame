import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Card } from "./Card";

function makeCard(overrides = {}) {
  return {
    id: 0,
    value: "icon.svg",
    isFlipped: false,
    isMatched: false,
    ...overrides,
  };
}

describe("Card: mouse", () => {
  it("calls onClick with the card on click", () => {
    const onClick = vi.fn();
    const card = makeCard();
    render(<Card card={card} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith(card);
  });
});

describe("Card: keyboard accessibility", () => {
  it("is a focusable button with a real role", () => {
    render(<Card card={makeCard()} onClick={vi.fn()} />);
    const el = screen.getByRole("button");
    expect(el).toHaveAttribute("tabIndex", "0");
  });

  it("removes matched cards from the tab order", () => {
    render(<Card card={makeCard({ isMatched: true })} onClick={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "-1");
  });

  it("triggers onClick on Enter", () => {
    const onClick = vi.fn();
    const card = makeCard();
    render(<Card card={card} onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(onClick).toHaveBeenCalledWith(card);
  });

  it("triggers onClick on Space", () => {
    const onClick = vi.fn();
    const card = makeCard();
    render(<Card card={card} onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(onClick).toHaveBeenCalledWith(card);
  });

  it("does not trigger onClick on an unrelated key", () => {
    const onClick = vi.fn();
    render(<Card card={makeCard()} onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "a" });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("labels the current state for assistive tech", () => {
    const { rerender } = render(
      <Card card={makeCard()} onClick={vi.fn()} />,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName(/hidden/i);

    rerender(<Card card={makeCard({ isFlipped: true })} onClick={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveAccessibleName(/revealed/i);

    rerender(
      <Card
        card={makeCard({ isFlipped: true, isMatched: true })}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName(/matched/i);
  });
});

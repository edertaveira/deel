import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Switch from "./Switch";

describe("Switch component", () => {
  test("renders switch with label", () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <Switch label="Test Switch" onChange={mockOnChange} />
    );
    expect(getByText("Test Switch")).toBeInTheDocument();
  });

  test("toggle switch", () => {
    const mockOnChange = jest.fn();
    const { getByLabelText } = render(
      <Switch label="Test Switch" onChange={mockOnChange} />
    );

    const input = getByLabelText("Test Switch");
    expect(input).not.toBeChecked();

    fireEvent.click(input);
    expect(input).toBeChecked();

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });
});

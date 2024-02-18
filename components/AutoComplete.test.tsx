import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import AutoComplete from "./AutoComplete";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AutoComplete component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders input field", () => {
    const { getByPlaceholderText } = render(<AutoComplete getFromApi />);
    const inputElement = getByPlaceholderText("Search...");
    expect(inputElement).toBeInTheDocument();
  });

  test("renders suggestions on input change using external API", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ name: { official: "Brazil" }, cca3: "BRA" }],
    });

    const { getByPlaceholderText, getByText } = render(
      <AutoComplete getFromApi />
    );
    const inputElement = getByPlaceholderText("Search...");
    fireEvent.change(inputElement, { target: { value: "Brazil" } });
    await waitFor(() => {
      const suggestionElement = getByText("Brazil");
      expect(suggestionElement).toBeInTheDocument();
    });
  });

  test("renders suggestions on input change in local (Next.js)", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ name: "Brazil", code: "BR" }],
    });

    const { getByPlaceholderText, getByText } = render(<AutoComplete />);
    const inputElement = getByPlaceholderText("Search...");
    fireEvent.change(inputElement, { target: { value: "Brazil" } });
    await waitFor(() => {
      const suggestionElement = getByText("Brazil");
      expect(suggestionElement).toBeInTheDocument();
    });
  });

  test("selects suggestion on click", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ name: { official: "Brazil" }, cca3: "BRA" }],
    });

    const { getByPlaceholderText, getByText } = render(
      <AutoComplete getFromApi />
    );
    const inputElement = getByPlaceholderText("Search...");
    fireEvent.change(inputElement, { target: { value: "Brazil" } });
    await waitFor(() => {
      const suggestionElement = getByText("Brazil");
      fireEvent.click(suggestionElement);
      expect(inputElement).toHaveValue("Brazil");
    });
  });

  test("navigates suggestions with arrow keys", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { name: { official: "Brazil" }, cca3: "BRA" },
        { name: { official: "United States" }, cca3: "USA" },
      ],
    });

    const { getByPlaceholderText, getByText } = render(
      <AutoComplete getFromApi />
    );
    const inputElement = getByPlaceholderText("Search...");
    fireEvent.change(inputElement, { target: { value: "Brazil" } });
    await waitFor(() => {
      fireEvent.keyDown(inputElement, { key: "ArrowDown" });
      expect(getByText("Brazil").className).toContain("bg-yellow-200");
      fireEvent.keyDown(inputElement, { key: "ArrowDown" });
      expect(getByText("United States").className).toContain("bg-gray-100");
    });
  });

  test("selects suggestion on pressing Enter key", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ name: { official: "Brazil" } }],
    });

    const { getByPlaceholderText } = render(<AutoComplete getFromApi />);
    const inputElement = getByPlaceholderText("Search...");
    fireEvent.change(inputElement, { target: { value: "Brazil" } });
    fireEvent.keyDown(inputElement, { key: "Enter" });
    await waitFor(() => {
      expect(inputElement).toHaveValue("Brazil");
    });
  });

  test("closes suggestion list on pressing Escape key", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ name: { official: "Brazil" } }],
    });

    const { getByPlaceholderText, getByText, queryByText } = render(
      <AutoComplete getFromApi />
    );
    const inputElement = getByPlaceholderText("Search...");
    fireEvent.change(inputElement, { target: { value: "Brazil" } });
    await waitFor(() => {
      const suggestionElement = getByText("Brazil");
      expect(suggestionElement).toBeInTheDocument();
    });

    fireEvent.keyDown(inputElement, { key: "Escape" });
    await waitFor(() => {
      expect(queryByText("Brazil")).not.toBeInTheDocument();
    });
  });
});

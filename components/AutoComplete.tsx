"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AiOutlineLoading } from "react-icons/ai";

interface Item {
  code: string;
  name: string;
}

interface AutoCompleteProps {
  getFromApi?: boolean;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ getFromApi }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (selectedOption === null) {
          setSelectedOption(0);
        } else if (selectedOption < suggestions.length - 1) {
          setSelectedOption((prev) => (prev !== null ? prev + 1 : null));
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (selectedOption !== null && selectedOption > 0) {
          setSelectedOption((prev) => (prev !== null ? prev - 1 : null));
        }
      } else if (e.key === "Enter" && selectedOption !== null) {
        e.preventDefault();
        handleClick(suggestions[selectedOption]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSuggestions([]);
        setSelectedOption(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedOption, suggestions]);

  const filterSuggestions = async (value: string) => {
    if (getFromApi) {
      await filterFromRestApi(value);
    } else {
      await filterFromLocalApi(value);
    }
  };

  const filterFromLocalApi = async (value: string) => {
    const response = await axios.get(
      `/api/autocomplete?q=${encodeURIComponent(value)}`
    );
    const data = await response.data;
    setSuggestions(data);
    setSelectedOption(data.length > 0 ? 0 : null);
  };

  const filterFromRestApi = async (value: string) => {
    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${value}`
      );

      const data = await response.data;
      if (Array.isArray(data)) {
        const filteredSuggestions: Item[] = data.map(
          (country: any, index: number) => ({
            code: country.cca3,
            name: country.name.official,
          })
        );
        setSuggestions(filteredSuggestions);
        setLoading(false);
        setSelectedOption(filteredSuggestions.length > 0 ? 0 : null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    if (timeoutId) clearTimeout(timeoutId);
    if (value.length > 2 && value !== "") {
      setLoading(true);
      const newTimeoutId = setTimeout(async () => {
        await filterSuggestions(value);
        setLoading(false);
      }, 500);
      setTimeoutId(newTimeoutId);
    } else {
      setSuggestions([]);
      setSelectedOption(null);
      setLoading(false);
    }
  };

  const handleClick = (suggestion: Item) => {
    setQuery(suggestion.name);
    setSuggestions([]);
  };

  const handleBlur = () => {
    setSelectedOption(null);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setSelectedOption(0);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search..."
          ref={inputRef}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        {loading && (
          <div className="absolute top-0 right-0 h-full flex items-center px-3">
            <AiOutlineLoading className="animate-spin text-gray-400" />
          </div>
        )}
      </div>

      <ul className="rounded-md overflow-hidden">
        {suggestions.map((suggestion: Item, index) => (
          <li
            key={index + suggestion.code}
            onClick={() => handleClick(suggestion)}
            className={`cursor-pointer hover:bg-gray-200 bg-gray-300 py-2 px-4 ${
              selectedOption === index ? "bg-gray-100" : ""
            }`}
          >
            {query &&
            suggestion.name.toLowerCase().includes(query.toLowerCase()) ? (
              <>
                {suggestion.name.substring(
                  0,
                  suggestion.name.toLowerCase().indexOf(query.toLowerCase())
                )}
                <span className="bg-yellow-200">
                  {suggestion.name.substring(
                    suggestion.name.toLowerCase().indexOf(query.toLowerCase()),
                    suggestion.name.toLowerCase().indexOf(query.toLowerCase()) +
                      query.length
                  )}
                </span>
                {suggestion.name.substring(
                  suggestion.name.toLowerCase().indexOf(query.toLowerCase()) +
                    query.length
                )}
              </>
            ) : (
              suggestion.name
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoComplete;

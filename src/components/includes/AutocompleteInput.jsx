import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";

export const AutocompleteInput = ({
  value,
  onChange,
  placeholder = "Enter text...",
  className = "",
  disabled = false,
  suggestions = [],
  ...props
}) => {
  const [filtered, setFiltered] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const blurTimeoutRef = useRef(null);

  const filterSuggestions = useCallback(
    (inputValue) =>
      suggestions
        .filter((s) => s.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 8),
    [suggestions],
  );

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    if (suggestions.length > 0) {
      const f = filterSuggestions(inputValue);
      setFiltered(f);
      setShowSuggestions(f.length > 0);
      setActive(-1);
    }
  };

  const handleSuggestionClick = (s) => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    onChange(s);
    setShowSuggestions(false);
    setFiltered([]);
    setActive(-1);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filtered.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (active >= 0) handleSuggestionClick(filtered[active]);
        break;
      case "Escape":
        setShowSuggestions(false);
        setActive(-1);
        break;
    }
  };

  const handleInputBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
      setActive(-1);
    }, 150);
  };

  useEffect(() => {
    if (active >= 0 && suggestionsRef.current) {
      const el = suggestionsRef.current.children[active];
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [active]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full",
          showSuggestions && "rounded-b-none border-b-0",
          className,
        )}
        {...props}
      />

      {showSuggestions && filtered.length > 0 && (
        <div
          ref={suggestionsRef}
          className={cn(
            "absolute z-50 max-h-48 w-full overflow-y-auto rounded-b-md border border-t-0 shadow-lg bg-white",
            className,
          )}
        >
          {filtered.map((s, i) => (
            <div
              key={s}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSuggestionClick(s)}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                active === i && "bg-accent text-accent-foreground",
              )}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

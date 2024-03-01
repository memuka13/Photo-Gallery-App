import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Results from "../components/Results";
import fetchSearch from "../components/fetchSearch";
import ErrorBoundary from "../components/ErrorBoundary";
import { useNavigate } from "react-router-dom";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Main = () => {
  const navigate = useNavigate();
  const [requestParams, setRequestParams] = useState({
    searchTerm: "",
  });
  const debouncedSearchTerm = useDebounce(requestParams.searchTerm, 500);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ["searchTerm", { searchTerm: debouncedSearchTerm }],
      fetchSearch,
      {
        getNextPageParam: (lastPage, allPages) => allPages.length + 1,
      }
    );
  const photos = data?.pages.flatMap((page) => page) ?? [];
  const observer = useRef(null);
  const lastElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage]
  );

  return (
    <div className="search-page">
      <form>
        <button
          className="button"
          type="button"
          onClick={() => navigate("/history")}
        >
          History
        </button>

        <label htmlFor="searchTerm">
          Search
          <input
            id="searchTerm"
            name="searchTerm"
            placeholder="..."
            onChange={(e) => {
              e.preventDefault();
              const obj = {
                searchTerm: e.target.value ?? "",
              };
              setRequestParams(obj);
            }}
          />
        </label>
      </form>

      <Results photos={photos} />
      {isLoading && <div className="spinner" />}
      {!isLoading && <div ref={lastElementRef} />}
    </div>
  );
};

export default function MainErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Main {...props} />
    </ErrorBoundary>
  );
}

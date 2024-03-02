import React, { useCallback, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import fetchSearch from "../components/fetchSearch";
import Results from "../components/Results";

const History = () => {
  const queryClient = useQueryClient();
  const [searchTerms, setSearchTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const queryCache = queryClient.getQueryCache();
    const searchQueries = queryCache.findAll({
      queryKey: ["searchTerm"],
    });
    const tempSearchTerms = searchQueries.map(
      (query) => query.queryKey[1]["searchTerm"]
    );
    setSearchTerms(tempSearchTerms);
  }, []);

  useEffect(() => {
    const data = queryClient.getQueryData([
      "searchTerm",
      { searchTerm: selectedTerm },
    ]);
    setPhotos(data?.["pages"].flatMap((page) => page) ?? []);
  }, [selectedTerm]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ["searchTerm", { searchTerm: selectedTerm }],
      fetchSearch,
      {
        getNextPageParam: (lastPage, allPages) => allPages.length + 1,
      }
    );

  useEffect(() => {
    setPhotos((prev) => [
      ...prev,
      ...(data?.pages.flatMap((page) => page) ?? []),
    ]);
  }, [data]);

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
    <div className="page">
      <div className="history-search-term-buttons-container">
        {searchTerms.map((term: string, index) =>
          term.length ? (
            <button
              className={term === selectedTerm ? "activeButton" : null}
              key={index}
              onClick={() => setSelectedTerm(term)}
            >
              {term}
            </button>
          ) : null
        )}
      </div>
      <Results photos={photos} />
      {isLoading && <div className="spinner"></div>}
      {!isLoading && <div ref={lastElementRef}></div>}
    </div>
  );
};

export default function HistoryErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <History {...props} />
    </ErrorBoundary>
  );
}

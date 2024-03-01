import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import PhotoSearchContext from "./components/PhotoSearchContext";
import MainErrorBoundary from "./pages/Main";
import HistoryErrorBoundary from "./pages/History";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const App = () => {
  const PhotoSearch = useState(null);
  return (
    <div>
      <BrowserRouter>
        <PhotoSearchContext.Provider value={PhotoSearch}>
          <QueryClientProvider client={queryClient}>
            <header>
              <Link to="/">Photo Search App</Link>
            </header>
            <Routes>
              <Route path="/history" element={<HistoryErrorBoundary />} />
              <Route path="/" element={<MainErrorBoundary />} />
            </Routes>
          </QueryClientProvider>
        </PhotoSearchContext.Provider>
      </BrowserRouter>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/products${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  return (
    <form className={`search-bar ${compact ? "search-bar--compact" : ""}`} onSubmit={submit} role="search">
      <span aria-hidden="true">⌕</span>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cameras, alarms, networking…" aria-label="Search products" />
      <button type="submit">Search</button>
    </form>
  );
}

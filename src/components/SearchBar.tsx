import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!new URLSearchParams(location.search).has("q")) setQuery("");
  }, [location.pathname, location.search]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/products${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  return (
    <form className={`search-bar ${compact ? "search-bar--compact" : ""}`} onSubmit={submit} role="search">
      <span aria-hidden="true">⌕</span>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPlaceholder")} aria-label={t("search")} />
      <button type="submit">{t("search")}</button>
    </form>
  );
}

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useProducts } from "../context/ProductContext";
import { localizeProduct } from "../lib/product-i18n";

const fold = (text: string) => text.toLocaleLowerCase().replace(/[\s_\-#/().]/g, "");
export function SearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { products, loading } = useProducts();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapper = useRef<HTMLDivElement>(null);
  const listId = useId();
  const zh = language === 'zh';
  const matches = useMemo(() => {
    const terms = query.trim().split(/\s+/).map(fold).filter(Boolean);
    if (!terms.length) return [];
    const exact = fold(query);
    return products.map(product => ({product, name:localizeProduct(product, language).name}))
      .filter(({product,name}) => terms.every(term => fold(`${name} ${product.name} ${product.sku} ${product.brand}`).includes(term)))
      .map(match => ({...match, score:fold(match.product.sku) === exact ? 0 : fold(match.product.sku).startsWith(exact) ? 1 : fold(match.name).startsWith(exact) ? 2 : 3}))
      .sort((a,b) => a.score-b.score || a.name.localeCompare(b.name))
      .slice(0,8);
  }, [products, query, language]);
  const expanded = open && Boolean(query.trim());

  useEffect(() => {
    setQuery(new URLSearchParams(location.search).get('q') || '');
    setOpen(false); setActive(-1);
  }, [location.pathname, location.search]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!wrapper.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown',outside);
    return () => document.removeEventListener('pointerdown',outside);
  }, []);
  const choose = (index: number) => {
    const match=matches[index]; if(!match)return;
    setOpen(false); setActive(-1); navigate('/products/'+encodeURIComponent(match.product.id));
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if(expanded && active>=0 && matches[active]) {choose(active);return;}
    setOpen(false);setActive(-1);
    navigate(`/products${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key==='Escape') {event.preventDefault();setOpen(false);setActive(-1);}
    if((event.key==='ArrowDown'||event.key==='ArrowUp')&&matches.length) {
      event.preventDefault();setOpen(true);
      setActive(current=>event.key==='ArrowDown'?(current+1)%matches.length:(current<=0?matches.length-1:current-1));
    }
  };
  return <div className="store-search" ref={wrapper} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setOpen(false);}}>
    <form className={`search-bar ${compact ? "search-bar--compact" : ""}`} onSubmit={submit} role="search">
      <span aria-hidden="true">⌕</span>
      <input value={query} onChange={event=>{setQuery(event.target.value);setOpen(true);setActive(-1);}} onFocus={()=>setOpen(true)} onKeyDown={keyDown}
        placeholder={t('searchPlaceholder')} aria-label={t('search')} autoComplete="off" role="combobox" aria-autocomplete="list"
        aria-expanded={expanded} aria-controls={expanded?listId:undefined} aria-activedescendant={expanded&&active>=0&&matches[active]?`${listId}-${active}`:undefined}/>
      <button type="submit">{t('search')}</button>
    </form>
    {expanded&&<div className="store-search__dropdown"><ul id={listId} role="listbox" aria-label={zh?'产品建议':'Suggested products'}>
      {matches.map(({product,name},index)=><li key={product.id} role="presentation"><button type="button" id={`${listId}-${index}`} role="option" aria-selected={active===index}
        onMouseEnter={()=>setActive(index)} onClick={()=>choose(index)}>
        {product.image?<img src={product.image} alt="" width={40} height={40} onError={event=>{event.currentTarget.style.visibility='hidden';}}/>:<span className="store-search__placeholder" aria-hidden="true"/>}
        <span><strong>{name}</strong><small>{product.sku} · {product.brand}</small></span>
      </button></li>)}
    </ul>{!matches.length&&<p role="status">{loading?(zh?'正在加载产品…':'Loading products…'):(zh?'没有匹配的产品。':'No matching products.')}</p>}
    {matches.length>0&&<button type="button" className="store-search__all" onClick={()=>{setOpen(false);setActive(-1);navigate('/products?q='+encodeURIComponent(query.trim()));}}>{zh?'查看全部搜索结果':'View all search results'}</button>}</div>}
  </div>;
}

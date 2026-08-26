import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "zh";

const copy = {
  en: { products:"Products",about:"About",contact:"Contact",cart:"Cart",shopAll:"Shop all",quote:"Get a quote",search:"Search",searchPlaceholder:"Search cameras, alarms, networking…",owned:"New Zealand owned & operated",advice:"Free advice from local security specialists",footerIntro:"A Kiwi team delivering smart home, security and electrical solutions for residential and commercial projects.",shop:"Shop",allProducts:"All products",cameras:"CCTV cameras",alarms:"Alarm systems",networking:"Networking",help:"Help",aboutUs:"About us",requestQuote:"Request a quote",shipping:"Shipping & returns",specialist:"Talk to a specialist",hours:"Mon–Fri, 8:30am–5:00pm",prototype:"Prototype storefront.",prices:"Prices shown in NZD and include GST." },
  zh: { products:"产品",about:"关于我们",contact:"联系我们",cart:"购物车",shopAll:"全部商品",quote:"获取报价",search:"搜索",searchPlaceholder:"搜索摄像头、报警器、网络设备…",owned:"新西兰本地拥有及运营",advice:"本地安防专家提供免费咨询",footerIntro:"新西兰本地团队为住宅和商业项目提供智能家居、安防及电气解决方案。",shop:"选购",allProducts:"全部商品",cameras:"监控摄像头",alarms:"报警系统",networking:"网络设备",help:"帮助",aboutUs:"关于我们",requestQuote:"申请报价",shipping:"配送与退货",specialist:"咨询专家",hours:"周一至周五，上午8:30–下午5:00",prototype:"演示商城。",prices:"价格为新西兰元，含商品及服务税。" },
} as const;

type CopyKey = keyof typeof copy.en;
type Value = { language: Language; setLanguage: (language: Language) => void; t: (key: CopyKey) => string };
const LanguageContext = createContext<Value | undefined>(undefined);

function initialLanguage(): Language { try { return localStorage.getItem("iot-tech-language") === "zh" ? "zh" : "en"; } catch { return "en"; } }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  useEffect(() => { localStorage.setItem("iot-tech-language", language); document.documentElement.lang = language === "zh" ? "zh-CN" : "en"; }, [language]);
  const value = useMemo<Value>(() => ({ language, setLanguage, t: (key) => copy[language][key] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { const context = useContext(LanguageContext); if (!context) throw new Error("useLanguage must be used within LanguageProvider"); return context; }

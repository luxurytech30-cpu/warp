import { createContext, useContext, useState, ReactNode } from "react";

type LanguageType = "he" | "ar";

interface LanguageContextProps {
  language: LanguageType;
  switchLanguage: (lang: LanguageType) => void;
  isHebrew: boolean;
  isArabic: boolean;
}

const defaultValue: LanguageContextProps = {
  language: "ar",
  switchLanguage: () => {},
  isHebrew: false,
  isArabic: true,
};

const LanguageContext = createContext<LanguageContextProps>(defaultValue);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageType>("ar");

  const switchLanguage = (lang: LanguageType) => {
    setLanguage(lang);
  };

  const isHebrew = language === "he";
  const isArabic = language === "ar";

  return (
    <LanguageContext.Provider
      value={{ language, switchLanguage, isHebrew, isArabic }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

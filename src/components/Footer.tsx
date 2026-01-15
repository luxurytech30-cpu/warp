import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { isArabic } = useLanguage();

  const labels = isArabic
    ? {
        taglineTitle: "حوّل لحظاتك إلى هدايا لا تُنسى",
        taglineBody:
          "اكتشف مجموعة من الهدايا المطبوعة والمخصصة لكل مناسبة. نصنع كل قطعة بعناية وجودة عالية لتضيف لمسة خاصة وتجعل كل احتفال ذكرى جميلة.",
        quickLinks: "روابط سريعة",
        home: "الرئيسية",
        products: "المنتجات",
        about: "من نحن",
        contact: "تواصل معنا",
        terms: "شروط الخدمة",
        reachUs: "تواصل",
        rights: "© 2026 Perfect Wrap. جميع الحقوق محفوظة.",
      }
    : {
        taglineTitle: "הופכים רגעים למתנות שלא שוכחים",
        taglineBody:
          "כאן תמצאו מגוון מתנות מודפסות ומותאמות אישית לכל אירוע. כל מוצר מיוצר בקפידה ובאיכות גבוהה כדי להוסיף נגיעה מיוחדת ולהפוך כל חגיגה לזיכרון מרגש.",
        quickLinks: "קישורים מהירים",
        home: "דף הבית",
        products: "מוצרים",
        about: "אודות",
        contact: "צור קשר",
        terms: "תנאי שירות",
        reachUs: "יצירת קשר",
        rights: "© 2026 Perfect Wrap. כל הזכויות שמורות.",
      };

  return (
    <footer
      className="bg-secondary text-secondary-foreground py-16 mt-20"
      dir={isArabic ? "rtl" : "rtl"} // both Hebrew + Arabic are RTL
      lang={isArabic ? "ar" : "he"}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-3 text-gradient-primary">
              Perfect Wrap
            </h3>

            <p className="leading-relaxed">
              <span className="block font-semibold mb-2">
                {labels.taglineTitle}
              </span>
              <span className="text-secondary-foreground/80">
                {labels.taglineBody}
              </span>
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">{labels.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  {labels.home}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  {labels.products}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  {labels.about}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  {labels.contact}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  {labels.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">{labels.reachUs}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">050-601-6901</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <Mail className="h-4 w-4 text-primary" />
                <span dir="ltr">Perfectwrap2022@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 text-center text-secondary-foreground/60">
          <p>{labels.rights}</p>
        </div>
      </div>
    </footer>
  );
};

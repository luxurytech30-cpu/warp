import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient-primary">Perfect Wrap</h3>
            <p className="text-secondary-foreground/80 leading-relaxed">
              هدايا واكسسوارات مصممة بحب، بأسماء ورسائل شخصية لكل امرأة تبحث عن لمسة فريدة.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-foreground/80 hover:text-primary transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">منتجاتنا</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li>أكواب بطباعة الأسماء</li>
              <li>حقائب واكسسوارات</li>
              <li>هدايا مناسبات</li>
              <li>ألبسة مخصصة</li>
              <li>علب تغليف فاخرة</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">تواصل</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <Phone className="h-4 w-4 text-primary" />
                <span>03-1234567</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@perfectwrap.co</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <MapPin className="h-4 w-4 text-primary" />
                <span>تل أبيب / دبي</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/15 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/15 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/15 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 text-center text-secondary-foreground/60">
          <p>© 2024 Perfect Wrap. كل الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

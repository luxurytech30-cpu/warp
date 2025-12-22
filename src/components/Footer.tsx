import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient-gold">בניה פרימיום</h3>
            <p className="text-background/80 leading-relaxed">
              ספק מוביל של חומרי בניין איכוtiים בישראל. מגוון עצום, שירות מעולה, מחירים מיוחדים למקצוענים.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">קישורים מהירים</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/80 hover:text-primary transition-colors">
                  דף הבית
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-background/80 hover:text-primary transition-colors">
                  מוצרים
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/80 hover:text-primary transition-colors">
                  אודות
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/80 hover:text-primary transition-colors">
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">קטגוריות</h4>
            <ul className="space-y-2 text-background/80">
              <li>חומרי בניין</li>
              <li>חומרי גמר</li>
              <li>ברזל ופלדה</li>
              <li>כלי עבודה</li>
              <li>עץ וחומרי גמר</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">צור קשר</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/80">
                <Phone className="h-4 w-4 text-primary" />
                <span>03-1234567</span>
              </li>
              <li className="flex items-center gap-2 text-background/80">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@building-premium.co.il</span>
              </li>
              <li className="flex items-center gap-2 text-background/80">
                <MapPin className="h-4 w-4 text-primary" />
                <span>ת.ד. 1234, תל אביב</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary flex items-center justify-center transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/60">
          <p>© 2024 בניה פרימיום. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
};

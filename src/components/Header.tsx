import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Helper to close menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* --- Left Side: Logo --- */}
          <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary shadow-premium">
              <Package className="h-7 w-7 text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary leading-tight">Perfect Wrap</h1>
              <p className="text-xs text-muted-foreground">هدايا شخصية بلمسة أنثوية</p>
            </div>
          </Link>

          {/* --- Center: Desktop Navigation (Hidden on Mobile) --- */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks isAdmin={isAdmin} />
          </nav>

          {/* --- Right Side: Icons & Mobile Toggle --- */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" onClick={closeMenu}>
              <Button variant="outline" size="icon" className="relative border-primary/30 hover:border-primary hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -left-2 h-6 w-6 rounded-full gradient-gold text-xs font-bold flex items-center justify-center text-white shadow-gold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Desktop Auth (Hidden on very small screens if needed, or kept) */}
            <div className="hidden sm:flex">
                <AuthButtons user={user} logout={logout} />
            </div>

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* --- Mobile Navigation Menu (Rendered conditionally) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {/* Mobile Links */}
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary font-medium py-2 transition-colors border-b border-border/50" 
                onClick={closeMenu}
              >
                الرئيسية
              </Link>
              <Link 
                to="/products" 
                className="text-foreground hover:text-primary font-medium py-2 transition-colors border-b border-border/50" 
                onClick={closeMenu}
              >
                المنتجات
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-primary font-medium py-2 transition-colors border-b border-border/50" 
                onClick={closeMenu}
              >
                من نحن
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground hover:text-primary font-medium py-2 transition-colors border-b border-border/50" 
                onClick={closeMenu}
              >
                تواصل
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-foreground hover:text-primary font-medium py-2 transition-colors border-b border-border/50"
                  onClick={closeMenu}
                >
                  مسؤول
                </Link>
              )}
            </nav>

            {/* Mobile Auth Buttons (Visible only on mobile inside menu) */}
            <div className="sm:hidden flex flex-col gap-3 mt-2">
               <AuthButtons user={user} logout={logout} isMobile onClick={closeMenu} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// --- Sub-components for cleaner code ---

const NavLinks = ({ isAdmin }: { isAdmin: boolean }) => (
  <>
    <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
      الرئيسية
    </Link>
    <Link to="/products" className="text-foreground hover:text-primary font-medium transition-colors">
      المنتجات
    </Link>
    <Link to="/about" className="text-foreground hover:text-primary font-medium transition-colors">
      من نحن
    </Link>
    <Link to="/contact" className="text-foreground hover:text-primary font-medium transition-colors">
      تواصل
    </Link>
    {isAdmin && (
      <Link to="/admin" className="text-foreground hover:text-primary font-medium transition-colors">
        مسؤول
      </Link>
    )}
  </>
);

const AuthButtons = ({ user, logout, isMobile = false, onClick }: any) => {
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`gap-2 ${isMobile ? 'w-full justify-start' : ''}`}>
            <User className="h-4 w-4" />
            <span>{user.username}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isMobile ? "start" : "end"} className="w-48">
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer" onClick={onClick}>
              <User className="ml-2 h-4 w-4" />
              الملف الشخصي
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { logout(); if(onClick) onClick(); }} className="cursor-pointer text-destructive">
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل خروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'flex-col w-full' : ''}`}>
      <Link to="/login" className={isMobile ? 'w-full' : ''} onClick={onClick}>
        <Button className={`gradient-primary text-white shadow-premium hover:shadow-gold ${isMobile ? 'w-full' : ''}`}>
          <User className="ml-2 h-4 w-4" />
          تسجيل دخول
        </Button>
      </Link>
      <Link to="/register" className={isMobile ? 'w-full' : ''} onClick={onClick}>
        <Button variant="outline" className={`shadow-premium border-primary/30 hover:border-primary hover:text-primary ${isMobile ? 'w-full' : ''}`}>
          إنشاء حساب
        </Button>
      </Link>
    </div>
  );
};

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { useCartStore } from '@/lib/store';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Produits', href: '#produits' },
  { label: 'Programme Affilié', href: '/affilie' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-soft border-b border-border/50'
          : 'bg-white/60 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="SCORBIO"
              width={140}
              height={40}
              className="h-10 w-auto transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-scorbio-green transition-colors duration-200 rounded-lg hover:bg-scorbio-green/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart */}
            <Link
              href="#cart"
              className="relative p-2 rounded-lg hover:bg-scorbio-green/5 transition-colors duration-200"
              aria-label="Panier"
            >
              <ShoppingBag className="h-5 w-5 text-foreground/70 hover:text-scorbio-green transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-scorbio-green text-[10px] font-bold text-white min-w-[18px] h-[18px]">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* CTA Button */}
            <Button
              asChild
              className="bg-scorbio-green hover:bg-scorbio-green/90 text-white font-semibold rounded-lg px-6 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Link href="#produits">Commander</Link>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart */}
            <Link
              href="#cart"
              className="relative p-2 rounded-lg hover:bg-scorbio-green/5 transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="h-5 w-5 text-foreground/70" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full bg-scorbio-green text-[10px] font-bold text-white min-w-[18px] h-[18px]">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              className="hover:bg-scorbio-green/5"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
          <SheetHeader className="p-6 pb-4 border-b border-border/50">
            <SheetTitle className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="SCORBIO"
                width={120}
                height={34}
                className="h-8 w-auto"
              />
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 text-base font-medium text-foreground/80 hover:text-scorbio-green hover:bg-scorbio-green/5 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 mt-auto border-t border-border/50">
            <Button
              asChild
              className="w-full bg-scorbio-green hover:bg-scorbio-green/90 text-white font-semibold rounded-lg h-12 text-base shadow-sm"
            >
              <Link href="#produits" onClick={() => setMobileOpen(false)}>
                Commander
              </Link>
            </Button>

            <div className="mt-4 text-center">
              <a
                href="https://wa.me/213550000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-scorbio-green transition-colors"
              >
                Besoin d&apos;aide ? Contactez-nous sur WhatsApp
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

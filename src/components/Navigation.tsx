"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Saved Test Cases", href: "/saved-test-cases" },
  { name: "Saved Test Scripts", href: "/saved-test-scripts" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  // Check initial theme on mount
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  };

  const linkClasses = (href: string) => {
    let base =
      "hover:text-gray-300 transition duration-200 transform hover:scale-105";
    if (pathname === href) {
      base += " text-yellow-300 font-bold";
    }
    return base;
  };

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg backdrop-blur-md">
      <div className="w-full px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">AI Test Case Generator</h1>
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Dark Mode Toggle (Desktop) */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="hidden md:block focus:outline-none"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation with Transition */}
      <div
        className={`w-full md:hidden bg-gradient-to-r from-blue-600 to-blue-500 py-4 px-6 space-y-4 text-center transform origin-top transition-all duration-300 ease-in-out ${
          isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${linkClasses(link.href)} block`}
            onClick={() => setIsOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        {/* Dark Mode Toggle (Mobile) */}
        <button onClick={toggleDarkMode} aria-label="Toggle dark mode" className="focus:outline-none">
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;

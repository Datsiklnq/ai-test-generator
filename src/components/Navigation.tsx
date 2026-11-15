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
  { name: "Test Case Generator", href: "/pages/generate-test-case" },
  { name: "Saved Test Cases", href: "/saved-test-cases" },
  { name: "Saved Test Scripts", href: "/saved-test-scripts" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  // Check initial theme on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  };

  const linkClasses = (href: string) =>
    `px-4 py-2 rounded-md transition-all duration-300 ${
      pathname === href
        ? "text-yellow-400 font-semibold bg-gray-800"
        : "hover:text-yellow-300 hover:bg-gray-800"
    }`;

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-lg shadow-md text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <h1 className="text-xl md:text-2xl font-bold tracking-wide bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            ⚡ AI Test Generator
          </h1>

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClasses(link.href)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Dark Mode Toggle (Desktop) */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="hidden md:block p-2 bg-gray-800 rounded-md hover:bg-gray-700"
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md bg-gray-800 hover:bg-gray-700"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen ? "true" : "false"}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`absolute top-full left-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-lg transition-transform duration-300 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="py-6 px-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-center ${linkClasses(link.href)}`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {/* Dark Mode Toggle (Mobile) */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="w-full py-2 bg-gray-800 rounded-md hover:bg-gray-700"
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

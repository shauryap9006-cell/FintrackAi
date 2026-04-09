'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const visibleLinks = navLinks.filter(link => {
    if (link.href === '/') return true;
    return !!user;
  });

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* 🌌 Background Glow */}
      <div className="absolute top-0 left-0 w-full h-40 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-b from-cyan-500/20 via-cyan-400/10 to-transparent blur-3xl opacity-60" />
      </div>

      {/* 🧊 Navbar */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 mx-auto mt-2 max-w-7xl px-4 md:px-6 py-3 flex items-center justify-between
                   backdrop-blur-xl bg-slate-900 border border-slate-800
                   rounded-2xl shadow-lg shadow-cyan-500/10 mx-4 lg:mx-auto"
      >

        {/* 🔹 Left: Logo */}
        <Link href="/" className="flex items-center transition-transform hover:scale-105 active:scale-95">
          <img 
            src="/logo-main.png" 
            alt="Fintrack Ai Logo" 
            className="h-10 w-auto object-contain" 
          />
        </Link>

        {/* 🔹 Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{link.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* 🔹 Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex flex-col items-end mr-2">
                  <span className="text-xs text-slate-300 uppercase tracking-wider font-bold">Member</span>
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={logout}
                  className="bg-red-600/80 hover:bg-red-600 text-white rounded-md px-4 py-2 transition-colors duration-200 flex items-center gap-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <LogOut size={16} />
                  Log Out
                </motion.button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-slate-300 hover:text-white transition text-sm font-medium"
                  >
                    Log In
                  </motion.button>
                </Link>
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-md px-4 py-2 transition-colors duration-200 shadow-[0_0_12px_rgba(6,182,212,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.7)] text-sm"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800 pl-2 md:pl-4">
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center
                         rounded-xl bg-slate-900 border border-slate-800
                         text-white cursor-pointer"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* 📱 Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 z-40 p-4
                       backdrop-blur-2xl bg-slate-900 border border-slate-800
                       rounded-2xl shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                                   ${isActive
                        ? 'bg-slate-800 border border-cyan-500/40 text-white'
                        : 'text-slate-300 hover:bg-slate-800/70'}`}>
                      <Icon size={20} className={isActive ? 'text-cyan-400' : ''} />
                      <span className="font-medium">{link.label}</span>
                    </div>
                  </Link>
                );
              })}

              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-3">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="px-3 py-2 bg-slate-800 rounded-xl">
                      <p className="text-xs text-slate-400">Logged in as</p>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="bg-red-600/80 hover:bg-red-600 text-white rounded-md px-4 py-2 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-3 rounded-md border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 transition-colors duration-200">
                        Log In
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-md transition-colors duration-200">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

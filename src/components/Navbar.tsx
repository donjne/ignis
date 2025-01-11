'use client'

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Rocket, Menu, X, Coins, BarChart3, Phone } from 'lucide-react';
import WalletButton from '@/components/landing/WalletButton';

interface NavbarProps {
  currentPath: string;
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, isActive, onClick }) => (
  <motion.a
    href={href}
    onClick={onClick}
    className={`relative text-gray-300 hover:text-white transition-colors px-4 py-2 block w-full md:w-auto text-center font-['Orbitron'] ${
      isActive ? 'text-white' : ''
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="relative z-10">{children}</span>
    {isActive && (
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-lg -z-0"
        layoutId="active-nav"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <motion.div
      className="absolute inset-0 bg-white/5 rounded-lg -z-0"
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    />
  </motion.a>
);

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void; currentPath: string }> = ({ 
  isOpen, 
  onClose,
  currentPath 
}) => (
  <motion.div
    initial={false}
    animate={isOpen ? "open" : "closed"}
    variants={{
      open: { opacity: 1, x: 0 },
      closed: { opacity: 0, x: "100%" }
    }}
    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
  >
    <div className="flex justify-end p-6">
      <button onClick={onClose} className="text-white">
        <X className="h-6 w-6" />
      </button>
    </div>
    <nav className="flex flex-col items-center justify-center h-[80vh] space-y-8">
      <NavLink href="/launch" onClick={onClose} isActive={currentPath === '/launch'}>
        <Coins className="inline-block mr-2 h-4 w-4" />
        LAUNCH
      </NavLink>
      <NavLink href="/portfolio" onClick={onClose} isActive={currentPath === '/portfolio'}>
        <BarChart3 className="inline-block mr-2 h-4 w-4" />
        PORTFOLIO
      </NavLink>
      <NavLink href="/contact" onClick={onClose} isActive={currentPath === '/contact'}>
        <Phone className="inline-block mr-2 h-4 w-4" />
        CONTACT
      </NavLink>
      <WalletButton />
    </nav>
  </motion.div>
);

export const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <>
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        currentPath={currentPath}
      />
      
      <header className="fixed top-0 w-full z-40">
        <motion.nav 
          className="mx-auto px-4 sm:px-6 py-4 backdrop-blur-xl bg-black/20 border-b border-white/10"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          style={{ 
            opacity: headerOpacity,
            y: headerY
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.a 
              href="/"
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
              <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400 font-['Orbitron']">
                IGNIS
              </span>
            </motion.a>

            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/launch" isActive={currentPath === '/launch'}>
                <Coins className="inline-block mr-2 h-4 w-4" />
                LAUNCH
              </NavLink>
              <NavLink href="/portfolio" isActive={currentPath === '/portfolio'}>
                <BarChart3 className="inline-block mr-2 h-4 w-4" />
                PORTFOLIO
              </NavLink>
              <NavLink href="/contact" isActive={currentPath === '/contact'}>
                <Phone className="inline-block mr-2 h-4 w-4" />
                CONTACT
              </NavLink>
              <WalletButton />
            </div>
          </div>
        </motion.nav>
      </header>
    </>
  );
};
"use client";

import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Rocket, Wallet, Menu, X, Coins, Gem, BarChart3, Phone } from 'lucide-react';
import { Orbitron } from 'next/font/google';
import WalletButton from '@/components/landing/WalletButton'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-orbitron',
});

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

const GradientBackground: React.FC = () => (
  <div className="fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-teal-900/20" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0.9))]" />
    <div className="grid-animation absolute inset-0 opacity-20" />
    
    {/* Animated Fire Effect */}
    <div className="absolute bottom-0 left-0 right-0 h-full overflow-hidden">
      <div className="fire-container">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`fire-particle fire-${i + 1}`} />
        ))}
      </div>
    </div>
    
    {/* Glowing Orbs */}
    <div className="absolute inset-0">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`floating-orb orb-${i + 1}`} />
      ))}
    </div>
  </div>
);

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => (
  <motion.a
    href={href}
    onClick={onClick}
    className="relative text-gray-300 hover:text-white transition-colors px-4 py-2 block w-full md:w-auto text-center"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span className="relative z-10">{children}</span>
    <motion.div
      className="absolute inset-0 bg-white/5 rounded-lg -z-0"
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    />
  </motion.a>
);

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
      >
        <div className="flex justify-end p-6">
          <button onClick={onClose} className="text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-[80vh] space-y-8">
          <NavLink href="/launch" onClick={onClose}>
            <Coins className="inline-block mr-2 h-4 w-4" />
            LAUNCH
          </NavLink>
          <NavLink href="/swap" onClick={onClose}>
            <Gem className="inline-block mr-2 h-4 w-4" />
            SWAP
          </NavLink>
          <NavLink href="/portfolio" onClick={onClose}>
            <BarChart3 className="inline-block mr-2 h-4 w-4" />
            PORTFOLIO
          </NavLink>
          <NavLink href="/contact" onClick={onClose}>
                <Phone className="inline-block mr-2 h-4 w-4" />
                CONTACT
              </NavLink>
          <motion.button
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium w-48"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet className="inline-block mr-2 h-4 w-4" />
            CONNECT WALLET
          </motion.button>
        </nav>
      </motion.div>
    )}
  </AnimatePresence>
);

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/10 p-6 sm:p-8 hover:from-white/10 hover:to-white/20 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <Icon className="h-6 w-6 sm:h-8 sm:w-8 mb-4 text-cyan-400" />
    <h3 className="text-lg sm:text-xl font-bold mb-2 text-white/90">{title}</h3>
    <p className="text-sm sm:text-base text-gray-400">{description}</p>
    <motion.div
      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500"
      initial={{ width: 0 }}
      whileInView={{ width: '100%' }}
      transition={{ duration: 0.8, delay: delay + 0.3 }}
    />
  </motion.div>
);

const HomeComponent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <div className={`${orbitron.variable} font-sans bg-black min-h-screen relative`}>
      <GradientBackground />
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Navbar */}
      <header className="fixed top-0 w-full z-40 transition-all duration-300">
        <motion.nav 
          className="mx-auto px-4 sm:px-6 py-4 backdrop-blur-xl bg-black/20 border-b border-white/10"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
              <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                IGNIS
              </span>
            </motion.div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/launch">
                <Coins className="inline-block mr-2 h-4 w-4" />
                LAUNCH
              </NavLink>
              <NavLink href="/swap">
                <Gem className="inline-block mr-2 h-4 w-4" />
                SWAP
              </NavLink>
              <NavLink href="/portfolio">
                <BarChart3 className="inline-block mr-2 h-4 w-4" />
                PORTFOLIO
              </NavLink>
              <NavLink href="/contact">
                <Phone className="inline-block mr-2 h-4 w-4" />
                CONTACT
              </NavLink>
              <WalletButton />
            </div>
          </div>
        </motion.nav>
      </header>

      {/* Hero Section */}
      <main className="relative pt-24 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-size-200 animate-gradient"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              IGNITE THE FUTURE
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your gateway to the next generation of digital assets and decentralized finance
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-12 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Coins className="inline-block mr-2 h-4 w-4" />
                START CREATING
              </motion.button>
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Gem className="inline-block mr-2 h-4 w-4" />
                EXPLORE TOKENS
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-24 px-4">
            <FeatureCard
              icon={Coins}
              title="Token Creation"
              description="Launch your token in minutes with our intuitive platform. Smart contracts made simple."
              delay={0.2}
            />
            <FeatureCard
              icon={Gem}
              title="NFT Marketplace"
              description="Trade unique digital assets in a secure environment. Discover rare collections."
              delay={0.4}
            />
            <FeatureCard
              icon={BarChart3}
              title="Portfolio Tracking"
              description="Monitor your investments with advanced analytics and real-time data."
              delay={0.6}
            />
          </div>
        </div>
      </main>

      {/* Background Animations */}
      <style jsx global>{`
        .fire-container {
          position: absolute;
          bottom: -50%;
          left: 0;
          right: 0;
          height: 200%;
          transform: scale(2);
          filter: blur(3px);
        }

        .fire-particle {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          filter: blur(10px);
          animation: rise 3s infinite;
          opacity: 0;
        }

        .fire-1 { background: rgba(0, 255, 255, 0.3); animation-delay: 0s; left: 20%; }
        .fire-2 { background: rgba(0, 200, 255, 0.3); animation-delay: 0.3s; left: 40%; }
        .fire-3 { background: rgba(0, 255, 230, 0.3); animation-delay: 0.6s; left: 60%; }
        .fire-4 { background: rgba(0, 230, 255, 0.3); animation-delay: 0.9s; left: 80%; }
        .fire-5 { background: rgba(0, 210, 255, 0.3); animation-delay: 1.2s; left: 30%; }

        @keyframes rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.3;
          }
          80% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-1000px) scale(3);
            opacity: 0;
          }
        }

        .floating-orb {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          filter: blur(20px);
          opacity: 0.1;
          animation: float 10s infinite;
        }

        .orb-1 { background: rgba(0, 255, 255, 0.2); left: 10%; top: 20%; animation-delay: 0s; }
        .orb-2 { background: rgba(0, 200, 255, 0.2); left: 80%; top: 50%; animation-delay: 1s; }
        .orb-3 { background: rgba(0, 255, 230, 0.2); left: 30%; top: 70%; animation-delay: 2s; }
        .orb-4 { background: rgba(0, 230, 255, 0.2); left: 60%; top: 30%; animation-delay: 3s; }
        .orb-5 { background: rgba(0, 210, 255, 0.2); left: 20%; top: 40%; animation-delay: 4s; }
        .orb-6 { background: rgba(0, 255, 240, 0.2); left: 70%; top: 60%; animation-delay: 5s; }
        .orb-7 { background: rgba(0, 240, 255, 0.2); left: 40%; top: 20%; animation-delay: 6s; }
        .orb-8 { background: rgba(0, 220, 255, 0.2); left: 90%; top: 80%; animation-delay: 7s; }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(50px, -50px) scale(1.2);
          }
          50% {
            transform: translate(0, -100px) scale(1);
          }
          75% {
            transform: translate(-50px, -50px) scale(0.8);
          }
        }
        .grid-animation {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }

        .bg-size-200 {
          background-size: 200% auto;
        }

        .animate-gradient {
          animation: gradientMove 8s linear infinite;
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
};

export default HomeComponent;

// import React, { useEffect, useState, useRef } from 'react';
// import styled from 'styled-components';
// import { motion, useAnimation } from 'framer-motion';
// import { Rocket, Wallet, Menu, X, Coins, Gem, BarChart3 } from 'lucide-react';

// // Custom hook for 3D tilt effect
// const useTilt = (ref: React.RefObject<HTMLDivElement | null>) => {
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       const el = ref.current;
//       if (el) {
//         const { offsetWidth: width, offsetHeight: height } = el;
//         const { clientX, clientY } = e;
//         const x = (clientX - el.offsetLeft) / width - 0.5;
//         const y = (clientY - el.offsetTop) / height - 0.5;
//         el.style.transform = `perspective(1000px) rotateX(${-y * 20}deg) rotateY(${x * 20}deg) scale3d(1, 1, 1)`;
//       }
//     };
//     const refCurrent = ref.current;
//     refCurrent?.addEventListener('mousemove', handleMouseMove);

//     return () => {
//       refCurrent?.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, [ref]);
// };

// // Styled Components
// const StyledContainer = styled.div`
//   background: linear-gradient(to bottom, #000000, #1a1040);
//   color: #FFFFFF;
//   min-height: 100vh;
//   font-family: 'Roboto', sans-serif;
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   overflow: hidden;
// `;

// const StyledNavbar = styled.nav`
//   position: sticky;
//   top: 0;
//   background: rgba(0, 0, 0, 0.5);
//   backdrop-filter: blur(20px);
//   z-index: 1000;
//   padding: 1rem 2rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   transition: all 0.3s ease;

//   .nav-links {
//     display: flex;
//     gap: 2rem;

//     @media (max-width: 768px) {
//       display: none;
//     }
//   }

//   .mobile-nav {
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background: rgba(25, 25, 25, 0.95);
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     transform: translateY(-100%);
//     transition: transform 0.5s ease;

//     &.active {
//       transform: translateY(0);
//     }
//   }
// `;

// const NavItem = styled(motion.li)`
//   list-style: none;
//   a {
//     color: #F3E8FF;
//     text-decoration: none;
//     font-weight: 500;
//     padding: 0.5rem 1rem;
//     transition: color 0.2s ease, transform 0.2s ease;

//     &:hover {
//       color: #c9a7eb;
//       transform: translateY(-2px);
//     }
//   }
// `;

// const Logo = styled.h1`
//   font-size: 2.5em;
//   font-weight: 700;
//   background: linear-gradient(to right, #8A2387, #E94057);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   cursor: pointer;
//   transition: transform 0.3s ease;

//   &:hover {
//     transform: scale(1.1);
//   }
// `;

// const Button = styled(motion.button)`
//   background: transparent;
//   border: 2px solid #F3E8FF;
//   color: #F3E8FF;
//   padding: 10px 20px;
//   font-size: 1em;
//   font-weight: 400;
//   cursor: pointer;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: scale(1.05);
//     box-shadow: 0 0 20px rgba(255,255,255,0.3);
//   }
// `;

// const FeatureCard = styled(motion.div)`
//   background: rgba(0, 0, 0, 0.4);
//   padding: 2rem;
//   margin: 1rem;
//   border-radius: 10px;
//   color: #F3E8FF;
//   transition: transform 0.3s ease;

//   &:hover {
//     transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.05);
//     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
//   }

//   h3 {
//     font-size: 1.5em;
//     margin-bottom: 1rem;
//   }
//   p {
//     font-size: 1em;
//   }
// `;

// const HomeComponent: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
//   const controls = useAnimation();
//   const cardRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     controls.start({
//       opacity: [0, 1],
//       y: [100, 0],
//       transition: { duration: 1, ease: "easeOut" }
//     });
//   }, [controls]);

//   useTilt(cardRef);

//   return (
//     <StyledContainer>
//       <StyledNavbar>
//         <Logo>
//           <Rocket className="inline-block mr-2" />
//           Ignis
//         </Logo>
//         <motion.div 
//           className="nav-links"
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           <NavItem>
//             <a href="/launch"><Coins className="inline-block mr-1" />Launch</a>
//           </NavItem>
//           <NavItem>
//             <a href="/swap"><Gem className="inline-block mr-1" />Swap</a>
//           </NavItem>
//           <NavItem>
//             <a href="/portfolio"><BarChart3 className="inline-block mr-1" />Portfolio</a>
//           </NavItem>
//         </motion.div>
//         <motion.button 
//           className="md:hidden"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           whileTap={{ scale: 0.9 }}
//         >
//           {isMenuOpen ? <X /> : <Menu />}
//         </motion.button>
//         <motion.div 
//           className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}
//           onClick={() => setIsMenuOpen(false)}
//         >
//           <NavItem>
//             <a href="/launch"><Coins className="inline-block mr-1" />Launch</a>
//           </NavItem>
//           <NavItem>
//             <a href="/swap"><Gem className="inline-block mr-1" />Swap</a>
//           </NavItem>
//           <NavItem>
//             <a href="/portfolio"><BarChart3 className="inline-block mr-1" />Portfolio</a>
//           </NavItem>
//         </motion.div>
//         <motion.button 
//           className="hidden md:block"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Wallet className="inline-block mr-1" />Connect Wallet
//         </motion.button>
//       </StyledNavbar>

//       <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//         <motion.h1 
//           initial={{ opacity: 0, y: -100 }}
//           animate={controls}
//           className="text-8xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500"
//         >
//           Ignis
//         </motion.h1>
//         <motion.p 
//           initial={{ opacity: 0, x: -100 }}
//           animate={controls}
//           className="text-2xl mb-8"
//         >
//           Your gateway to the universe of tokens and NFTs.
//         </motion.p>
//         <motion.div 
//           className="cta-buttons flex flex-col md:flex-row gap-4 mt-4"
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={controls}
//           transition={{ delay: 0.5 }}
//         >
//           <Button><Coins className="inline-block mr-2" />Start Creating</Button>
//           <Button><Gem className="inline-block mr-2" />Explore Tokens</Button>
//         </motion.div>

//         <motion.div 
//           className="features grid grid-cols-1 md:grid-cols-3 gap-4 mt-10"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1, staggerChildren: 0.2 }}
//         >
//           <FeatureCard ref={cardRef}>
//             <h3><Coins /> Token Creation</h3>
//             <p>Launch your token in minutes</p>
//           </FeatureCard>
//           <FeatureCard>
//             <h3><Gem /> NFT Marketplace</h3>
//             <p>Trade unique digital assets</p>
//           </FeatureCard>
//           <FeatureCard>
//             <h3><BarChart3 /> Portfolio Tracking</h3>
//             <p>Monitor your investments</p>
//           </FeatureCard>
//         </motion.div>
//       </main>
//     </StyledContainer>
//   );
// };

// export default HomeComponent;

// import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
// import { motion, useAnimation } from 'framer-motion';
// import { Rocket, Wallet, Menu, X, Coins, Gem, BarChart3 } from 'lucide-react';

// // Custom hook for 3D tilt effect
// const useTilt = (ref) => {
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       const { current: el } = ref;
//       if (el) {
//         const { offsetWidth: width, offsetHeight: height } = el;
//         const { clientX, clientY } = e;
//         const x = (clientX - el.offsetLeft) / width - 0.5;
//         const y = (clientY - el.offsetTop) / height - 0.5;
//         el.style.transform = `perspective(1000px) rotateX(${-y * 20}deg) rotateY(${x * 20}deg) scale3d(1, 1, 1)`;
//       }
//     };
//     const refCurrent = ref.current;
//     refCurrent.addEventListener('mousemove', handleMouseMove);

//     return () => {
//       refCurrent.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, [ref]);
// };

// // Styled Components
// const StyledContainer = styled.div`
//   background: linear-gradient(to bottom, #000000, #1a1040);
//   color: #FFFFFF;
//   min-height: 100vh;
//   font-family: 'Roboto', sans-serif;
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   overflow: hidden;
// `;

// const StyledNavbar = styled.nav`
//   position: sticky;
//   top: 0;
//   background: rgba(0, 0, 0, 0.5);
//   backdrop-filter: blur(20px);
//   z-index: 1000;
//   padding: 1rem 2rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   transition: all 0.3s ease;

//   .nav-links {
//     display: flex;
//     gap: 2rem;

//     @media (max-width: 768px) {
//       display: none;
//     }
//   }

//   .mobile-nav {
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background: rgba(25, 25, 25, 0.95);
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     transform: translateY(-100%);
//     transition: transform 0.5s ease;

//     &.active {
//       transform: translateY(0);
//     }
//   }
// `;

// const NavItem = styled(motion.li)`
//   list-style: none;
//   a {
//     color: #F3E8FF;
//     text-decoration: none;
//     font-weight: 500;
//     padding: 0.5rem 1rem;
//     transition: color 0.2s ease, transform 0.2s ease;

//     &:hover {
//       color: #c9a7eb;
//       transform: translateY(-2px);
//     }
//   }
// `;

// const Logo = styled.h1`
//   font-size: 2.5em;
//   font-weight: 700;
//   background: linear-gradient(to right, #8A2387, #E94057);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   cursor: pointer;
//   transition: transform 0.3s ease;

//   &:hover {
//     transform: scale(1.1);
//   }
// `;

// const Button = styled(motion.button)`
//   background: transparent;
//   border: 2px solid #F3E8FF;
//   color: #F3E8FF;
//   padding: 10px 20px;
//   font-size: 1em;
//   font-weight: 400;
//   cursor: pointer;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: scale(1.05);
//     box-shadow: 0 0 20px rgba(255,255,255,0.3);
//   }
// `;

// const FeatureCard = styled(motion.div)`
//   background: rgba(0, 0, 0, 0.4);
//   padding: 2rem;
//   margin: 1rem;
//   border-radius: 10px;
//   color: #F3E8FF;
//   transition: transform 0.3s ease;

//   &:hover {
//     transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.05);
//     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
//   }

//   h3 {
//     font-size: 1.5em;
//     margin-bottom: 1rem;
//   }
//   p {
//     font-size: 1em;
//   }
// `;

// const HomeComponent = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const controls = useAnimation();

//   useEffect(() => {
//     controls.start({
//       opacity: [0, 1],
//       y: [100, 0],
//       transition: { duration: 1, ease: "easeOut" }
//     });
//   }, []);

//   const cardRef = React.useRef();

//   useTilt(cardRef);

//   return (
//     <StyledContainer>
//       <StyledNavbar>
//         <Logo>
//           <Rocket className="inline-block mr-2" />
//           Ignis
//         </Logo>
//         <motion.div 
//           className="nav-links"
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           <NavItem>
//             <a href="/launch"><Coins className="inline-block mr-1" />Launch</a>
//           </NavItem>
//           <NavItem>
//             <a href="/swap"><Gem className="inline-block mr-1" />Swap</a>
//           </NavItem>
//           <NavItem>
//             <a href="/portfolio"><BarChart3 className="inline-block mr-1" />Portfolio</a>
//           </NavItem>
//         </motion.div>
//         <motion.button 
//           className="md:hidden"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           whileTap={{ scale: 0.9 }}
//         >
//           {isMenuOpen ? <X /> : <Menu />}
//         </motion.button>
//         <motion.div 
//           className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}
//           onClick={() => setIsMenuOpen(false)}
//         >
//           <NavItem>
//             <a href="/launch"><Coins className="inline-block mr-1" />Launch</a>
//           </NavItem>
//           <NavItem>
//             <a href="/swap"><Gem className="inline-block mr-1" />Swap</a>
//           </NavItem>
//           <NavItem>
//             <a href="/portfolio"><BarChart3 className="inline-block mr-1" />Portfolio</a>
//           </NavItem>
//         </motion.div>
//         <motion.button 
//           className="hidden md:block"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Wallet className="inline-block mr-1" />Connect Wallet
//         </motion.button>
//       </StyledNavbar>

//       <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//         <motion.h1 
//           initial={{ opacity: 0, y: -100 }}
//           animate={controls}
//           className="text-8xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500"
//         >
//           Ignis
//         </motion.h1>
//         <motion.p 
//           initial={{ opacity: 0, x: -100 }}
//           animate={controls}
//           className="text-2xl mb-8"
//         >
//           Your gateway to the universe of tokens and NFTs.
//         </motion.p>
//         <motion.div 
//           className="cta-buttons flex flex-col md:flex-row gap-4 mt-4"
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={controls}
//           transition={{ delay: 0.5 }}
//         >
//           <Button><Coins className="inline-block mr-2" />Start Creating</Button>
//           <Button><Gem className="inline-block mr-2" />Explore Tokens</Button>
//         </motion.div>

//         <motion.div 
//           className="features grid grid-cols-1 md:grid-cols-3 gap-4 mt-10"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1, staggerChildren: 0.2 }}
//         >
//           <FeatureCard ref={cardRef}>
//             <h3><Coins /> Token Creation</h3>
//             <p>Launch your token in minutes</p>
//           </FeatureCard>
//           <FeatureCard>
//             <h3><Gem /> NFT Marketplace</h3>
//             <p>Trade unique digital assets</p>
//           </FeatureCard>
//           <FeatureCard>
//             <h3><BarChart3 /> Portfolio Tracking</h3>
//             <p>Monitor your investments</p>
//           </FeatureCard>
//         </motion.div>
//       </main>
//     </StyledContainer>
//   );
// };

// export default HomeComponent;
// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { motion } from 'framer-motion';
// import { Rocket, Wallet, Menu, X, Coins, Gem, BarChart3 } from 'lucide-react';

// // Interfaces
// interface NavItemProps {
//   icon: React.ComponentType<LucideIconProps>;
//   href: string;
//   text: string;
// }

// interface LucideIconProps {
//   className?: string;
//   size?: number | string;
// }

// // Styled Components
// const StyledNavbar = styled.nav`
//   position: sticky;
//   top: 0;
//   background: rgba(25, 25, 25, 0.8); // Darker background for contrast
//   backdrop-filter: blur(15px);
//   border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//   z-index: 1000;
//   padding: 1rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   width: 100%;

//   @media (max-width: 768px) {
//     padding: 0.5rem 1rem;
//   }
// `;

// const StyledNavLinks = styled.ul<{ isOpen: boolean }>`
//   display: flex; // Desktop view
//   gap: 1rem;
//   list-style: none;
//   padding: 0;
//   margin: 0;

//   @media (max-width: 768px) {
//     position: absolute;
//     top: 100%;
//     left: 0;
//     width: 100%;
//     background: rgba(25, 25, 25, 0.9);
//     display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
//     flex-direction: column;
//     align-items: center;
//     padding: 1rem 0;
//     box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//   }

//   li a {
//     color: #f3e8ff; // Light purple text color
//     text-decoration: none;
//     font-weight: 500;
//     transition: color 0.2s ease;
//     padding: 0.5rem 1rem;
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;

//     &:hover {
//       color: #c9a7eb; // Hover color for links
//     }

//     @media (max-width: 768px) {
//       width: 100%;
//       justify-content: center;
//     }
//   }
// `;

// const NavItem: React.FC<NavItemProps> = ({ icon: Icon, href, text }) => (
//   <motion.li
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//   >
//     <a href={href}>
//       <Icon className="w-5 h-5" />
//       {text}
//     </a>
//   </motion.li>
// );

// const ResponsiveNavbar: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

//   return (
//     <StyledNavbar>
//       <motion.h2 
//         className="text-xl md:text-2xl font-bold text-gradient bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
//         animate={{ scale: [1, 1.05, 1] }}
//         transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//       >
//         <Rocket className="inline-block mr-2" />
//         Ignis
//       </motion.h2>

//       <motion.button
//         className="p-2 ml-auto md:hidden bg-white/10 rounded-full text-white"
//         onClick={() => setIsMenuOpen(!isMenuOpen)}
//         whileTap={{ scale: 0.95 }}
//       >
//         {isMenuOpen ? <X /> : <Menu />}
//       </motion.button>

//       <StyledNavLinks isOpen={isMenuOpen}>
//         <NavItem icon={Coins} href="/launch" text="Launch" />
//         <NavItem icon={Gem} href="/swap" text="Swap" />
//         <NavItem icon={BarChart3} href="/portfolio" text="Portfolio" />
//       </StyledNavLinks>

//       <motion.button 
//         className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         <Wallet className="w-4 h-4" />
//         Connect Wallet
//       </motion.button>
//     </StyledNavbar>
//   );
// };

// export default ResponsiveNavbar;

// import { useEffect, useState } from 'react';
// import gsap from 'gsap';
// import { motion } from 'framer-motion';
// import { Rocket, Wallet, Menu, X, Coins, Gem, BarChart3 } from 'lucide-react';

// import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
// import gsap from 'gsap';
// import { motion } from 'framer-motion';
// import { Rocket, Wallet, Menu, X, Coins, Gem, BarChart3 } from 'lucide-react';

// interface AnimatedButtonProps {
//   text: string;
//   icon: React.ComponentType<LucideIconProps>;
//   className?: string;
// }

// interface NavItemProps {
//   icon: React.ComponentType<LucideIconProps>;
//   href: string;
//   text: string;
// }

// interface FeatureCardProps {
//   title: string;
//   icon: React.ComponentType<LucideIconProps>;
//   description: string;
// }

// interface NavProps {
//   $isOpen: boolean;
// }

// interface LucideIconProps {
//   className?: string;
//   size?: number | string;
// }

// // Styled Components
// const StyledContainer = styled.div`
//   background: linear-gradient(to bottom, #000000, #1a1040);
//   color: white;
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   overflow: hidden;

//   .star-bg {
//     position: absolute;
//     inset: 0;
//     background-image: 
//       radial-gradient(1px 1px at 20px 30px, white, rgba(0,0,0,0)),
//       radial-gradient(1px 1px at 40px 70px, white, rgba(0,0,0,0)),
//       radial-gradient(1px 1px at 50px 160px, white, rgba(0,0,0,0)),
//       radial-gradient(2px 2px at 200px 20px, white, rgba(0,0,0,0));
//     background-size: 200px 200px;
//     opacity: 0.5;
//     pointer-events: none;
//   }

//   .nebula {
//     position: absolute;
//     inset: 0;
//     background: 
//       radial-gradient(circle at 50% 50%, rgba(76, 0, 255, 0.1), transparent 60%),
//       radial-gradient(circle at 70% 30%, rgba(255, 0, 255, 0.1), transparent 40%);
//     filter: blur(30px);
//     mix-blend-mode: screen;
//     pointer-events: none;
//   }
// `;

// const StyledNavbar = styled.nav`
//   position: sticky;
//   top: 0;
//   background: rgba(0, 0, 0, 0.2);
//   backdrop-filter: blur(10px);
//   border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//   z-index: 1000;
//   padding: 1rem 2rem;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 2rem;

//   @media (max-width: 768px) {
//     padding: 1rem;
//     .connect-wallet {
//       display: none;
//     }
//   }

//   .nav-links {
//     display: flex; // Ensure this is always visible on desktop
//     @media (max-width: 768px) {
//       position: fixed;
//       top: 4rem;
//       left: 0;
//       right: 0;
//       background: rgba(0, 0, 0, 0.95);
//       backdrop-filter: blur(20px);
//       border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//       overflow: hidden;
//       transition: height 0.3s ease, opacity 0.3s ease;

//       &.active {
//         height: auto;
//         padding: 1rem;
//       }
//     }
//   }
// `;

// const StyledNavLinks = styled.ul<NavProps>`
//   display: flex; // Always flex for desktop
//   gap: 2rem;
//   margin: 0;
//   padding: 0;
//   list-style: none;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     gap: 1rem;
//     display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    
//     li {
//       width: 100%;
      
//       a {
//         display: flex;
//         padding: 0.5rem 1rem;
//         border-radius: 0.5rem;
//         transition: background-color 0.2s ease;
        
//         &:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }
//       }
//     }
//   }

//   li a {
//     color: rgba(255, 255, 255, 0.8);
//     text-decoration: none;
//     font-weight: 500;
//     transition: all 0.2s ease;
//     position: relative;
//     padding: 0.5rem 0;

//     &:after {
//       content: '';
//       position: absolute;
//       width: 100%;
//       transform: scaleX(0);
//       height: 2px;
//       bottom: 0;
//       left: 0;
//       background: linear-gradient(to right, #a855f7, #3b82f6);
//       transform-origin: bottom right;
//       transition: transform 0.25s ease-out;
//     }

//     &:hover {
//       color: white;
//       text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      
//       &:after {
//         transform: scaleX(1);
//         transform-origin: bottom left;
//       }
//     }
//   }
// `;

// const StyledFeatures = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: 2rem;
//   margin-top: 3rem;
//   padding: 1rem;
//   max-width: 1200px;
//   width: 100%;

//   .feature-card {
//     transition: all 0.3s ease;
    
//     &:hover {
//       transform: translateY(-5px);
//       box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
      
//       .icon {
//         transform: scale(1.1);
//         color: #a855f7;
//       }
//     }
//   }

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//     gap: 1rem;
//   }
// `;

// // Component implementation
// const HomeComponent: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

//   useEffect(() => {
//     const animations = [
//       gsap.fromTo('.title', 
//         { opacity: 0, y: -50 }, 
//         { opacity: 1, y: 0, duration: 2, ease: 'power3.out' }
//       ),
//       gsap.fromTo('.description', 
//         { opacity: 0, x: -50 }, 
//         { opacity: 1, x: 0, duration: 2.5, delay: 0.5, ease: 'elastic.out(1, 0.3)' }
//       ),
//       gsap.fromTo('.cta-buttons button', 
//         { opacity: 0, scale: 0.5 }, 
//         { 
//           opacity: 1, 
//           scale: 1, 
//           stagger: 0.3,
//           duration: 1,
//           delay: 1,
//           ease: 'back.out(1.7)'
//         }
//       ),
//       gsap.to('.star-bg', {
//         duration: 20,
//         backgroundPositionX: '+=1000px',
//         repeat: -1,
//         ease: 'none',
//       }),
//       gsap.to('.nebula', {
//         scale: 1.1,
//         opacity: 0.8,
//         duration: 8,
//         yoyo: true,
//         repeat: -1,
//         ease: 'power1.inOut'
//       })
//     ];

//     return () => {
//       animations.forEach(animation => animation.kill());
//     };
//   }, []);

//   const AnimatedButton: React.FC<AnimatedButtonProps> = ({ text, icon: Icon, className }) => (
//     <motion.button 
//       className={`${className} flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-purple-500/20 backdrop-blur-sm`}
//       whileHover={{ 
//         scale: 1.05,
//         boxShadow: '0 0 20px rgba(168,85,247,0.5)'
//       }}
//       whileTap={{ scale: 0.95 }}
//     >
//       <Icon className="w-5 h-5" />
//       {text}
//     </motion.button>
//   );

//   const NavItem: React.FC<NavItemProps> = ({ icon: Icon, href, text }) => (
//     <motion.li
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//     >
//       <a href={href} className="flex items-center gap-2">
//         <Icon className="w-4 h-4" />
//         {text}
//       </a>
//     </motion.li>
//   );

//   const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon: Icon, description }) => (
//     <motion.div
//       className="feature-card backdrop-blur-md bg-white/5 rounded-xl p-6 border border-white/10"
//       whileHover={{ 
//         scale: 1.05,
//         backgroundColor: 'rgba(255,255,255,0.1)'
//       }}
//     >
//       <Icon className="w-8 h-8 mb-4 text-purple-400" />
//       <h3 className="text-xl font-bold mb-2">{title}</h3>
//       <p className="text-purple-100">{description}</p>
//     </motion.div>
//   );

//   return (
//     <StyledContainer>
//       <div className="nebula" />
      
//       <StyledNavbar>
//         <motion.h2 
//           className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 cursor-pointer"
//           animate={{ scale: [1, 1.05, 1] }}
//           transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//         >
//           <Rocket className="inline-block mr-2" />
//           Ignis
//         </motion.h2>

//         <motion.button
//           className="md:hidden z-50 p-2 bg-white/10 rounded-lg backdrop-blur-sm"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           whileTap={{ scale: 0.95 }}
//         >
//           {isMenuOpen ? <X /> : <Menu />}
//         </motion.button>

//         <motion.div 
//           className={`nav-links ${isMenuOpen ? 'active' : ''}`}
//           initial={false}
//           animate={{
//             height: isMenuOpen ? 'auto' : 0,
//             opacity: isMenuOpen ? 1 : 0
//           }}
//         >
//           <StyledNavLinks $isOpen={isMenuOpen}>
//             <NavItem icon={Coins} href="/launch" text="Launch" />
//             <NavItem icon={Gem} href="/swap" text="Swap" />
//             <NavItem icon={BarChart3} href="/portfolio" text="Portfolio" />
//           </StyledNavLinks>
//         </motion.div>

//         <motion.button 
//           className="connect-wallet hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-full hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Wallet className="w-4 h-4" />
//           Connect Wallet
//         </motion.button>
//       </StyledNavbar>

//       <main className="relative flex-grow flex flex-col items-center justify-center text-center px-4">
//         <div className="star-bg" />
        
//         <motion.h1 
//           className="title text-7xl sm:text-9xl font-extrabold mb-4 z-10 font-sans text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-400 to-blue-500"
//           animate={{ 
//             scale: [1, 1.05, 1],
//             textShadow: [
//               "0 0 20px rgba(168,85,247,0.5)",
//               "0 0 60px rgba(168,85,247,0.2)",
//               "0 0 20px rgba(168,85,247,0.5)"
//             ]
//           }}
//           transition={{ 
//             duration: 3, 
//             repeat: Infinity, 
//             repeatType: "reverse",
//             ease: "easeInOut"
//           }}
//         >
//           Ignis
//         </motion.h1>

//         <motion.p 
//           className="description text-xl sm:text-2xl mb-8 z-10 font-sans text-purple-100"
//           animate={{ scale: [1, 1.02, 1] }}
//           transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
//         >
//           Your gateway to the universe of tokens and NFTs.
//         </motion.p>

//         <div className="cta-buttons flex flex-col sm:flex-row gap-4 z-10">
//           <AnimatedButton 
//             text="Start Creating" 
//             icon={Coins}
//             className="w-full sm:w-auto"
//           />
//           <AnimatedButton 
//             text="Explore Tokens" 
//             icon={Gem}
//             className="w-full sm:w-auto"
//           />
//         </div>

//         <StyledFeatures>
//           <FeatureCard 
//             title="Token Creation" 
//             icon={Coins}
//             description="Launch your token in minutes"
//           />
//           <FeatureCard 
//             title="NFT Marketplace" 
//             icon={Gem}
//             description="Trade unique digital assets"
//           />
//           <FeatureCard 
//             title="Portfolio Tracking" 
//             icon={BarChart3}
//             description="Monitor your investments"
//           />
//         </StyledFeatures>
//       </main>
//     </StyledContainer>
//   );
// };

// export default HomeComponent;

// const HomeComponent = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     // Title animation
//     gsap.fromTo('.title', 
//       { opacity: 0, y: -50 }, 
//       { opacity: 1, y: 0, duration: 2, ease: 'power3.out' }
//     );

//     // Description animation
//     gsap.fromTo('.description', 
//       { opacity: 0, x: -50 }, 
//       { opacity: 1, x: 0, duration: 2.5, delay: 0.5, ease: 'elastic.out(1, 0.3)' }
//     );

//     // Buttons animation
//     gsap.fromTo('.cta-buttons button', 
//       { opacity: 0, scale: 0.5 }, 
//       { 
//         opacity: 1, 
//         scale: 1, 
//         stagger: 0.3,
//         duration: 1,
//         delay: 1,
//         ease: 'back.out(1.7)'
//       }
//     );

//     // Enhanced star background animation
//     gsap.to('.star-bg', {
//       duration: 20,
//       backgroundPositionX: '+=1000px',
//       ease: 'none',
//       repeat: -1,
//     });

//     // Nebula effect animation
//     gsap.to('.nebula', {
//       scale: 1.1,
//       opacity: 0.8,
//       duration: 8,
//       yoyo: true,
//       repeat: -1,
//       ease: 'power1.inOut'
//     });
//   }, []);

//   return (
//     <StyledContainer>
//       <div className="nebula absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-blue-900/30 mix-blend-overlay" />
      
//       {/* Enhanced Navbar */}
//       <StyledNavbar>
//         <motion.h2 
//           className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 cursor-pointer"
//           animate={{ scale: [1, 1.05, 1] }}
//           transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//         >
//           <Rocket className="inline-block mr-2" />
//           Ignis
//         </motion.h2>

//         {/* Enhanced Mobile Menu Button */}
//         <motion.button
//           className="md:hidden z-50 p-2 bg-white/10 rounded-lg backdrop-blur-sm"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           whileTap={{ scale: 0.95 }}
//         >
//           {isMenuOpen ? <X /> : <Menu />}
//         </motion.button>

//         {/* Enhanced Navigation Links */}
//         <motion.div 
//           className={`nav-links ${isMenuOpen ? 'active' : ''}`}
//           initial={false}
//           animate={{
//             height: isMenuOpen ? 'auto' : 0,
//             opacity: isMenuOpen ? 1 : 0
//           }}
//         >
//           <StyledNavLinks $isOpen={isMenuOpen}>
//             <NavItem icon={Coins} href="/launch" text="Launch" />
//             <NavItem icon={Gem} href="/swap" text="Swap" />
//             <NavItem icon={BarChart3} href="/portfolio" text="Portfolio" />
//           </StyledNavLinks>
//         </motion.div>

//         <motion.button 
//           className="connect-wallet hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-full hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Wallet className="w-4 h-4" />
//           Connect Wallet
//         </motion.button>
//       </StyledNavbar>

//       <main className="relative flex-grow flex flex-col items-center justify-center text-center px-4">
//         <div className="star-bg absolute inset-0 z-0" />
        
//         <motion.h1 
//           className="title text-7xl sm:text-9xl font-extrabold mb-4 z-10 font-sans text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-400 to-blue-500"
//           animate={{ 
//             scale: [1, 1.05, 1],
//             textShadow: [
//               "0 0 20px rgba(168,85,247,0.5)",
//               "0 0 60px rgba(168,85,247,0.2)",
//               "0 0 20px rgba(168,85,247,0.5)"
//             ]
//           }}
//           transition={{ 
//             duration: 3, 
//             repeat: Infinity, 
//             repeatType: "reverse",
//             ease: "easeInOut"
//           }}
//         >
//           Ignis
//         </motion.h1>

//         <motion.p 
//           className="description text-xl sm:text-2xl mb-8 z-10 font-sans text-purple-100"
//           animate={{ scale: [1, 1.02, 1] }}
//           transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
//         >
//           Your gateway to the universe of tokens and NFTs.
//         </motion.p>

//         <div className="cta-buttons flex flex-col sm:flex-row gap-4 z-10">
//           <AnimatedButton 
//             text="Start Creating" 
//             icon={Coins}
//             className="w-full sm:w-auto"
//           />
//           <AnimatedButton 
//             text="Explore Tokens" 
//             icon={Gem}
//             className="w-full sm:w-auto"
//           />
//         </div>

//         <div className="mt-12 z-10">
//           <p className="max-w-xl mx-auto text-center leading-relaxed text-purple-100 text-lg">
//             Unlock the potential of your digital assets with Ignis
//           </p>
//           <StyledFeatures>
//             <FeatureCard 
//               title="Token Creation" 
//               icon={Coins} 
//               description="Launch your token in minutes"
//             />
//             <FeatureCard 
//               title="NFT Marketplace" 
//               icon={Gem} 
//               description="Trade unique digital assets"
//             />
//             <FeatureCard 
//               title="Portfolio Tracking" 
//               icon={BarChart3} 
//               description="Monitor your investments"
//             />
//           </StyledFeatures>
//         </div>
//       </main>
//     </StyledContainer>
//   );
// };

// // Enhanced Button Component
// const AnimatedButton = ({ text, icon: Icon, className }) => {
//   return (
//     <motion.button 
//       className={`${className} flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-purple-500/20 backdrop-blur-sm`}
//       whileHover={{ 
//         scale: 1.05,
//         boxShadow: '0 0 20px rgba(168,85,247,0.5)'
//       }}
//       whileTap={{ scale: 0.95 }}
//     >
//       {Icon && <Icon className="w-5 h-5" />}
//       {text}
//     </motion.button>
//   );
// };

// // Enhanced Navigation Item
// const NavItem = ({ icon: Icon, href, text }) => (
//   <motion.li
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//   >
//     <a href={href} className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors">
//       <Icon className="w-4 h-4" />
//       {text}
//     </a>
//   </motion.li>
// );

// // Enhanced Feature Card
// const FeatureCard = ({ title, icon: Icon, description }) => (
//   <motion.div
//     className="feature-card backdrop-blur-md bg-white/5 rounded-xl p-6 border border-white/10"
//     whileHover={{ 
//       scale: 1.05,
//       backgroundColor: 'rgba(255,255,255,0.1)'
//     }}
//   >
//     <Icon className="w-8 h-8 mb-4 text-purple-400" />
//     <h3 className="text-xl font-bold mb-2">{title}</h3>
//     <p className="text-purple-100">{description}</p>
//   </motion.div>
// );

// const StyledContainer = styled.div`
//   background: linear-gradient(to bottom, #000000, #1a1040);
//   color: white;
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   overflow: hidden;

//   .star-bg {
//     background-image: 
//       radial-gradient(1px 1px at 20px 30px, white, rgba(0,0,0,0)),
//       radial-gradient(1px 1px at 40px 70px, white, rgba(0,0,0,0)),
//       radial-gradient(1px 1px at 50px 160px, white, rgba(0,0,0,0)),
//       radial-gradient(2px 2px at 200px 20px, white, rgba(0,0,0,0));
//     background-size: 200px 200px;
//     opacity: 0.5;
//   }

//   .nebula {
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: 
//       radial-gradient(circle at 50% 50%, rgba(76, 0, 255, 0.1), transparent 60%),
//       radial-gradient(circle at 70% 30%, rgba(255, 0, 255, 0.1), transparent 40%);
//     filter: blur(30px);
//     mix-blend-mode: screen;
//     pointer-events: none;
//   }
// `;

// const StyledNavbar = styled.nav`
//   position: sticky;
//   top: 0;
//   background: rgba(0, 0, 0, 0.2);
//   backdrop-filter: blur(10px);
//   border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//   z-index: 1000;
//   padding: 1rem 2rem;

//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 2rem;

//   @media (max-width: 768px) {
//     padding: 1rem;
//     .connect-wallet {
//       display: none;
//     }
//   }

//   .nav-links {
//     @media (max-width: 768px) {
//       position: fixed;
//       top: 4rem;
//       left: 0;
//       right: 0;
//       background: rgba(0, 0, 0, 0.95);
//       backdrop-filter: blur(20px);
//       border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//       overflow: hidden;
//       transition: height 0.3s ease, opacity 0.3s ease;

//       &.active {
//         height: auto;
//         padding: 1rem;
//       }
//     }
//   }
// `;

// interface NavProps {
//   $isOpen: boolean;
// }

// const StyledNavLinks = styled.ul<NavProps>`
//   display: flex;
//   gap: 2rem;
//   margin: 0;
//   padding: 0;
//   list-style: none;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     gap: 1rem;
//     display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    
//     li {
//       width: 100%;
      
//       a {
//         display: flex;
//         padding: 0.5rem 1rem;
//         border-radius: 0.5rem;
//         transition: background-color 0.2s ease;
        
//         &:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }
//       }
//     }
//   }

//   li a {
//     color: rgba(255, 255, 255, 0.8);
//     text-decoration: none;
//     font-weight: 500;
//     transition: all 0.2s ease;
//     position: relative;
//     padding: 0.5rem 0;

//     &:after {
//       content: '';
//       position: absolute;
//       width: 100%;
//       transform: scaleX(0);
//       height: 2px;
//       bottom: 0;
//       left: 0;
//       background: linear-gradient(to right, #a855f7, #3b82f6);
//       transform-origin: bottom right;
//       transition: transform 0.25s ease-out;
//     }

//     &:hover {
//       color: white;
//       text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      
//       &:after {
//         transform: scaleX(1);
//         transform-origin: bottom left;
//       }
//     }
//   }
// `;

// Styled Components (keep existing styled-components but enhance with new styles)
// ... (previous styled components remain the same, just update the background and effects)

// export default HomeComponent;




// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { useRouter } from 'next/navigation'; // Changed from 'next/router'

// interface Planet {
//   name: string;
//   radius: number;
//   color: string;
//   orbitRadius: number;
//   rotationSpeed: number;
//   route: string;
//   position: THREE.Vector3;
// }

// const SpaceScene: React.FC = () => {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
//   const [showIntro, setShowIntro] = useState(true);

//   useEffect(() => {
//     // Auto-hide intro after 3 seconds
//     const timer = setTimeout(() => {
//       setShowIntro(false);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (!mountRef.current || showIntro) return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     mountRef.current.appendChild(renderer.domElement);

//     // Camera position
//     camera.position.z = 15;

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);
//     const pointLight = new THREE.PointLight(0xffffff, 1);
//     pointLight.position.set(0, 0, 0);
//     scene.add(pointLight);

//     // Controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;

//     // Planet definitions
//     const planets: Planet[] = [
//       {
//         name: 'Launch',
//         radius: 1,
//         color: '#FF6B6B',
//         orbitRadius: 8,
//         rotationSpeed: 0.001,
//         route: '/launch',
//         position: new THREE.Vector3(8, 0, 0)
//       },
//       {
//         name: 'Portfolio',
//         radius: 1.2,
//         color: '#4ECDC4',
//         orbitRadius: 6,
//         rotationSpeed: 0.002,
//         route: '/portfolio',
//         position: new THREE.Vector3(-6, 0, 0)
//       },
//       {
//         name: 'Swap',
//         radius: 0.8,
//         color: '#FFD93D',
//         orbitRadius: 10,
//         rotationSpeed: 0.0015,
//         route: '/swap',
//         position: new THREE.Vector3(0, 10, 0)
//       },
//       {
//         name: 'Contact',
//         radius: 0.9,
//         color: '#95A5A6',
//         orbitRadius: 7,
//         rotationSpeed: 0.0025,
//         route: '/contact',
//         position: new THREE.Vector3(0, -7, 0)
//       }
//     ];

//     // Create planets
//     const planetMeshes = planets.map(planet => {
//       const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
//       const material = new THREE.MeshPhongMaterial({
//         color: planet.color,
//         shininess: 15,
//       });
//       const mesh = new THREE.Mesh(geometry, material);
//       mesh.position.copy(planet.position);
//       mesh.userData = { name: planet.name, route: planet.route };
//       scene.add(mesh);
//       return mesh;
//     });

//     // Create central star (Connect Wallet)
//     const starGeometry = new THREE.SphereGeometry(2, 32, 32);
//     const starMaterial = new THREE.MeshPhongMaterial({
//       color: 0xFFA500,
//       emissive: 0xFFA500,
//       emissiveIntensity: 0.5,
//     });
//     const star = new THREE.Mesh(starGeometry, starMaterial);
//     scene.add(star);

//     // Raycaster for interaction
//     const raycaster = new THREE.Raycaster();
//     const mouse = new THREE.Vector2();

//     // Event listeners
//     const onMouseMove = (event: MouseEvent) => {
//       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects(planetMeshes);

//       if (intersects.length > 0) {
//         const intersectedObject = intersects[0].object;
//         setHoveredPlanet(intersectedObject.userData.name);
//         document.body.style.cursor = 'pointer';
//       } else {
//         setHoveredPlanet(null);
//         document.body.style.cursor = 'default';
//       }
//     };

//     const onClick = (event: MouseEvent) => {
//       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects([...planetMeshes, star]);

//       if (intersects.length > 0) {
//         const clickedObject = intersects[0].object;
//         if (clickedObject === star) {
//           // Handle wallet connection
//           console.log('Connect wallet clicked');
//         } else {
//           router.push(clickedObject.userData.route);
//         }
//       }
//     };

//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('click', onClick);

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);

//       // Rotate planets
//       planetMeshes.forEach((mesh, index) => {
//         const planet = planets[index];
//         mesh.rotation.y += planet.rotationSpeed;
//       });

//       // Rotate star
//       star.rotation.y += 0.001;

//       controls.update();
//       renderer.render(scene, camera);
//     };

//     animate();

//     // Handle window resize
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       if (mountRef.current) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//       window.removeEventListener('mousemove', onMouseMove);
//       window.removeEventListener('click', onClick);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [router, showIntro]); // Added showIntro dependency

//   return (
//     <div className="relative w-full h-screen bg-black">
//       {showIntro ? (
//         <div className="flex flex-col items-center justify-center h-full text-white animate-fade-in">
//           <h1 className="text-6xl font-bold mb-4 animate-pulse">IGNIS</h1>
//           <p className="text-xl text-center max-w-md animate-fade-in">
//             Your universe for creating tokens and NFTs
//           </p>
//         </div>
//       ) : (
//         <>
//           <div ref={mountRef} className="w-full h-full" />
//           {hoveredPlanet && (
//             <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
//               {hoveredPlanet}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default SpaceScene;

// import { useEffect, useState } from 'react';
// import gsap from 'gsap';
// import { motion } from 'framer-motion';
// import styled from 'styled-components';

// const HomeComponent: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     // Title animation
//     gsap.fromTo('.title', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 2, ease: 'power3.out' });

//     // Description animation
//     gsap.fromTo('.description', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 2.5, delay: 0.5, ease: 'elastic.out(1, 0.3)' });

//     // Buttons animation
//     gsap.fromTo('.cta-buttons button', 
//       { opacity: 0, scale: 0.5 }, 
//       { 
//         opacity: 1, 
//         scale: 1, 
//         stagger: 0.3,
//         duration: 1,
//         delay: 1,
//         ease: 'back.out(1.7)'
//       }
//     );

//     // Background animation for stars (pseudo-stars)
//     gsap.to('.star-bg', {
//       duration: 20,
//       backgroundPositionX: '+=1000px',
//       ease: 'none',
//       repeat: -1,
//     });
//   }, []);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   return (
//     <StyledContainer>
//       <StyledNavbar>
//         <motion.h2 
//           className="text-3xl font-bold text-white cursor-pointer"
//           animate={{ scale: [1, 1.05, 1] }}
//           transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//         >
//           Ignis
//         </motion.h2>
//         <StyledNavLinks $isOpen={isMenuOpen}>
//           <li><a href="/launch">Launch</a></li>
//           <li><a href="/contact">Contact</a></li>
//           <li><a href="/swap">Swap</a></li>
//           <li><a href="/portfolio">See Portfolio</a></li>
//         </StyledNavLinks>
//         <motion.button 
//           className="connect-wallet bg-transparent border border-white text-white py-2 px-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           Connect Wallet
//         </motion.button>
//         <div className="menuToggle cursor-pointer" onClick={toggleMenu}>
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
//           ))}
//         </div>
//       </StyledNavbar>
//       <main className="relative flex-grow flex flex-col items-center justify-center text-center">
//         <div className="star-bg absolute inset-0 z-0" />
//         <motion.h1 
//           className="title text-8xl sm:text-9xl font-extrabold mb-4 z-10 font-sans"
//           animate={{ 
//             scale: [1, 1.05, 1],
//             textShadow: ["0 0 0 transparent", "0 0 10px rgba(255,255,255,0.7)"]
//           }}
//           transition={{ 
//             duration: 3, 
//             repeat: Infinity, 
//             repeatType: "reverse",
//             ease: "easeInOut"
//           }}
//         >
//           Ignis
//         </motion.h1>
//         <motion.p 
//           className="description text-xl sm:text-2xl mb-8 z-10 font-sans"
//           animate={{ scale: [1, 1.02, 1] }}
//           transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
//         >
//           Your gateway to the universe of tokens and NFTs.
//         </motion.p>
//         <div className="cta-buttons flex flex-col sm:flex-row gap-4 z-10">
//         <AnimatedButton 
//             text="Start Creating" 
//             color="purple-600" 
//             hoverColor="purple-700" 
//             className="w-full sm:w-auto shadow-lg transition-shadow duration-300 hover:shadow-xl"
//         />
//         <AnimatedButton 
//             text="Explore Tokens" 
//             color="blue-600" 
//             hoverColor="blue-700" 
//             className="w-full sm:w-auto shadow-lg transition-shadow duration-300 hover:shadow-xl"
//         />
//         </div>
//         <div className="mt-12 text-base sm:text-lg text-gray-300 z-10">
//         <p className="max-w-xl mx-auto text-center leading-relaxed text-shadow-sm">
//             Unlock the potential of your digital assets with Ignis. <br/> 
//             Our platform offers:
//         </p>
//         <StyledFeatures>
//             <FeatureItem title="Seamless Token Creation" icon="🪙" />
//             <FeatureItem title="Intuitive NFT Marketplace" icon="🖼️" />
//             <FeatureItem title="Advanced Swapping and Portfolio Management" icon="📊" />
//         </StyledFeatures>
//         </div>
//       </main>
//     </StyledContainer>
//   );
// };

// // Custom Button component with GSAP animation
// const AnimatedButton = ({ text, color, hoverColor, className }: { text: string; color: string; hoverColor: string; className?: string }) => {
//   useEffect(() => {
//     gsap.to(`.button-${text.toLowerCase().replace(/\s/g, '')}`, {
//       y: 0,
//       scale: 1,
//       duration: 0.5,
//       ease: 'elastic.out(1, 0.3)',
//       delay: 1
//     });
//   }, [text]);

//   return (
//     <motion.button 
//       className={`button-${text.toLowerCase().replace(/\s/g, '')} ${className} bg-${color} hover:bg-${hoverColor} text-white font-bold py-3 px-6 rounded-full`}
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//     >
//       {text}
//     </motion.button>
//   );
// };

// export default HomeComponent;

// // Styled Components

// const StyledFeatures = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//   gap: 1rem;
//   margin-top: 2rem;
//   max-width: 800px;
//   width: 100%;
//   justify-items: center;

//   @media (max-width: 600px) {
//     grid-template-columns: 1fr;
//   }
// `;

// interface FeatureProps {
//   title: string;
//   icon: string;
// }

// const FeatureItem = ({ title, icon }: FeatureProps) => (
//   <StyledFeatureItem>
//     <div className="icon">{icon}</div>
//     <h3 className="title">{title}</h3>
//   </StyledFeatureItem>
// );

// const StyledFeatureItem = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   background: rgba(255, 255, 255, 0.1);
//   border-radius: 10px;
//   padding: 1rem;
//   text-align: center;
//   transition: transform 0.3s, background 0.3s;
//   backdrop-filter: blur(5px);

//   &:hover {
//     transform: translateY(-5px);
//     background: rgba(255, 255, 255, 0.2);
//   }

//   .icon {
//     font-size: 2.5em;
//     margin-bottom: 0.5rem;
//     text-shadow: 0 2px 5px rgba(0,0,0,0.2);
//   }

//   .title {
//     font-size: 1rem;
//     font-weight: 600;
//     color: #e2e8f0;
//     text-shadow: 0 1px 3px rgba(0,0,0,0.3);
//   }
// `;

// const StyledContainer = styled.div`
//   background: linear-gradient(to bottom, #000000, #1a202c);
//   color: white;
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;

//   .star-bg {
//     background: radial-gradient(white, transparent 1px) repeat;
//     background-size: 5px 5px;
//   }
// `;

// const StyledNavbar = styled.nav`
//   position: sticky;
//   top: 0;
//   background: linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.5));
//   backdrop-filter: blur(10px);
//   z-index: 1000;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 1rem 2rem;

//   .menuToggle {
//     display: none;
    
//     .bar {
//       width: 25px;
//       height: 3px;
//       background-color: #fff;
//       margin: 3px 0;
//       transition: 0.4s;
//     }

//     .open:nth-child(1) {
//       transform: rotate(-45deg) translate(-5px, 6px);
//     }
//     .open:nth-child(2) {
//       opacity: 0;
//     }
//     .open:nth-child(3) {
//       transform: rotate(45deg) translate(-5px, -6px);
//     }
//   }

//   @media (max-width: 768px) {
//     .menuToggle {
//       display: flex;
//       flex-direction: column;
//     }

//     .connect-wallet {
//       display: none;
//     }

//     .navLinks {
//       position: fixed;
//       top: 60px;
//       right: 0;
//       background-color: #1a202c;
//       width: 100%;
//       height: 0;
//       overflow: hidden;
//       transition: height 0.3s ease;
//       display: flex;
//       flex-direction: column;
//       align-items: flex-start;
//       padding: 1rem;

//       &.active {
//         height: auto;
//       }

//       li {
//         margin: 10px 0;
//       }
//     }
//   }
// `;

// interface NavProps {
//   $isOpen: boolean;
// }

// const StyledNavLinks = styled.ul<NavProps>`
//   display: flex;
//   gap: 20px;
//   margin: 0 auto;

//   @media (max-width: 768px) {
//     display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
//   }

//   li a {
//     color: white;
//     text-decoration: none;
//     font-weight: bold;
//     position: relative;

//     &:after {
//       content: '';
//       position: absolute;
//       width: 100%;
//       transform: scaleX(0);
//       height: 2px;
//       bottom: 0;
//       left: 0;
//       background-color: white;
//       transform-origin: bottom right;
//       transition: transform 0.25s ease-out;
//     }

//     &:hover:after {
//       transform: scaleX(1);
//       transform-origin: bottom left;
//     }
//   }
// `;
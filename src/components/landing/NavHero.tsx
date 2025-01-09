"use client";
// import { useEffect, useState } from 'react';
// import gsap from 'gsap';
// import { motion } from 'framer-motion';
// import { Rocket, Wallet, Menu, X, Coins, Gem, BarChart3 } from 'lucide-react';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { Rocket, Wallet, Menu, X, Coins, Gem, BarChart3 } from 'lucide-react';

interface AnimatedButtonProps {
  text: string;
  icon: React.ComponentType<LucideIconProps>;
  className?: string;
}

interface NavItemProps {
  icon: React.ComponentType<LucideIconProps>;
  href: string;
  text: string;
}

interface FeatureCardProps {
  title: string;
  icon: React.ComponentType<LucideIconProps>;
  description: string;
}

interface NavProps {
  $isOpen: boolean;
}

interface LucideIconProps {
  className?: string;
  size?: number | string;
}

// Styled Components
const StyledContainer = styled.div`
  background: linear-gradient(to bottom, #000000, #1a1040);
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  .star-bg {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(1px 1px at 20px 30px, white, rgba(0,0,0,0)),
      radial-gradient(1px 1px at 40px 70px, white, rgba(0,0,0,0)),
      radial-gradient(1px 1px at 50px 160px, white, rgba(0,0,0,0)),
      radial-gradient(2px 2px at 200px 20px, white, rgba(0,0,0,0));
    background-size: 200px 200px;
    opacity: 0.5;
    pointer-events: none;
  }

  .nebula {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 50% 50%, rgba(76, 0, 255, 0.1), transparent 60%),
      radial-gradient(circle at 70% 30%, rgba(255, 0, 255, 0.1), transparent 40%);
    filter: blur(30px);
    mix-blend-mode: screen;
    pointer-events: none;
  }
`;

const StyledNavbar = styled.nav`
  position: sticky;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding: 1rem 2rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    .connect-wallet {
      display: none;
    }
  }

  .nav-links {
    @media (max-width: 768px) {
      position: fixed;
      top: 4rem;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      overflow: hidden;
      transition: height 0.3s ease, opacity 0.3s ease;

      &.active {
        height: auto;
        padding: 1rem;
      }
    }
  }
`;

const StyledNavLinks = styled.ul<NavProps>`
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    
    li {
      width: 100%;
      
      a {
        display: flex;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: background-color 0.2s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }

  li a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;
    padding: 0.5rem 0;

    &:after {
      content: '';
      position: absolute;
      width: 100%;
      transform: scaleX(0);
      height: 2px;
      bottom: 0;
      left: 0;
      background: linear-gradient(to right, #a855f7, #3b82f6);
      transform-origin: bottom right;
      transition: transform 0.25s ease-out;
    }

    &:hover {
      color: white;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      
      &:after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
    }
  }
`;

const StyledFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  padding: 1rem;
  max-width: 1200px;
  width: 100%;

  .feature-card {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
      
      .icon {
        transform: scale(1.1);
        color: #a855f7;
      }
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// Component implementation
const HomeComponent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const animations = [
      gsap.fromTo('.title', 
        { opacity: 0, y: -50 }, 
        { opacity: 1, y: 0, duration: 2, ease: 'power3.out' }
      ),
      gsap.fromTo('.description', 
        { opacity: 0, x: -50 }, 
        { opacity: 1, x: 0, duration: 2.5, delay: 0.5, ease: 'elastic.out(1, 0.3)' }
      ),
      gsap.fromTo('.cta-buttons button', 
        { opacity: 0, scale: 0.5 }, 
        { 
          opacity: 1, 
          scale: 1, 
          stagger: 0.3,
          duration: 1,
          delay: 1,
          ease: 'back.out(1.7)'
        }
      ),
      gsap.to('.star-bg', {
        duration: 20,
        backgroundPositionX: '+=1000px',
        repeat: -1,
        ease: 'none',
      }),
      gsap.to('.nebula', {
        scale: 1.1,
        opacity: 0.8,
        duration: 8,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut'
      })
    ];

    return () => {
      animations.forEach(animation => animation.kill());
    };
  }, []);

  const AnimatedButton: React.FC<AnimatedButtonProps> = ({ text, icon: Icon, className }) => (
    <motion.button 
      className={`${className} flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-purple-500/20 backdrop-blur-sm`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 0 20px rgba(168,85,247,0.5)'
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-5 h-5" />
      {text}
    </motion.button>
  );

  const NavItem: React.FC<NavItemProps> = ({ icon: Icon, href, text }) => (
    <motion.li
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <a href={href} className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {text}
      </a>
    </motion.li>
  );

  const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon: Icon, description }) => (
    <motion.div
      className="feature-card backdrop-blur-md bg-white/5 rounded-xl p-6 border border-white/10"
      whileHover={{ 
        scale: 1.05,
        backgroundColor: 'rgba(255,255,255,0.1)'
      }}
    >
      <Icon className="w-8 h-8 mb-4 text-purple-400" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-purple-100">{description}</p>
    </motion.div>
  );

  return (
    <StyledContainer>
      <div className="nebula" />
      
      <StyledNavbar>
        <motion.h2 
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 cursor-pointer"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <Rocket className="inline-block mr-2" />
          Ignis
        </motion.h2>

        <motion.button
          className="md:hidden z-50 p-2 bg-white/10 rounded-lg backdrop-blur-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </motion.button>

        <motion.div 
          className={`nav-links ${isMenuOpen ? 'active' : ''}`}
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
        >
          <StyledNavLinks $isOpen={isMenuOpen}>
            <NavItem icon={Coins} href="/launch" text="Launch" />
            <NavItem icon={Gem} href="/swap" text="Swap" />
            <NavItem icon={BarChart3} href="/portfolio" text="Portfolio" />
          </StyledNavLinks>
        </motion.div>

        <motion.button 
          className="connect-wallet hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-full hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </motion.button>
      </StyledNavbar>

      <main className="relative flex-grow flex flex-col items-center justify-center text-center px-4">
        <div className="star-bg" />
        
        <motion.h1 
          className="title text-7xl sm:text-9xl font-extrabold mb-4 z-10 font-sans text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-400 to-blue-500"
          animate={{ 
            scale: [1, 1.05, 1],
            textShadow: [
              "0 0 20px rgba(168,85,247,0.5)",
              "0 0 60px rgba(168,85,247,0.2)",
              "0 0 20px rgba(168,85,247,0.5)"
            ]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          Ignis
        </motion.h1>

        <motion.p 
          className="description text-xl sm:text-2xl mb-8 z-10 font-sans text-purple-100"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          Your gateway to the universe of tokens and NFTs.
        </motion.p>

        <div className="cta-buttons flex flex-col sm:flex-row gap-4 z-10">
          <AnimatedButton 
            text="Start Creating" 
            icon={Coins}
            className="w-full sm:w-auto"
          />
          <AnimatedButton 
            text="Explore Tokens" 
            icon={Gem}
            className="w-full sm:w-auto"
          />
        </div>

        <StyledFeatures>
          <FeatureCard 
            title="Token Creation" 
            icon={Coins}
            description="Launch your token in minutes"
          />
          <FeatureCard 
            title="NFT Marketplace" 
            icon={Gem}
            description="Trade unique digital assets"
          />
          <FeatureCard 
            title="Portfolio Tracking" 
            icon={BarChart3}
            description="Monitor your investments"
          />
        </StyledFeatures>
      </main>
    </StyledContainer>
  );
};

export default HomeComponent;

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
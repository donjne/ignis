'use client'

import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Rocket, Menu, X, Coins, RefreshCw, BarChart3, Phone, Github } from 'lucide-react';
import WalletButton from '@/components/landing/WalletButton';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

const FIRE_POSITIONS = [
  { left: '5%', height: '80px', delay: '0s' },
  { left: '15%', height: '90px', delay: '0.1s' },
  { left: '25%', height: '70px', delay: '0.2s' },
  { left: '35%', height: '85px', delay: '0.3s' },
  { left: '45%', height: '95px', delay: '0.4s' },
  { left: '55%', height: '75px', delay: '0.5s' },
  { left: '65%', height: '88px', delay: '0.6s' },
  { left: '75%', height: '82px', delay: '0.7s' },
  { left: '85%', height: '78px', delay: '0.8s' },
  { left: '95%', height: '86px', delay: '0.9s' }
];

const GradientBackground: React.FC = () => (
  <div className="fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-teal-900/20" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0.9))]" />
    <div className="grid-animation absolute inset-0 opacity-20" />
    
    {/* Cyber Fire Effect */}
    <div className="absolute bottom-0 left-0 right-0 h-full overflow-hidden">
      <div className="cyber-fire-container">
        {FIRE_POSITIONS.map((pos, i) => (
          <div
            key={i}
            className="cyber-fire"
            style={{
              left: pos.left,
              height: pos.height,
              animationDelay: pos.delay
            }}
          />
        ))}
      </div>
      <div className="cyber-fire-base" />
    </div>
    
    {/* Rest of your background effects */}
    <div className="absolute bottom-0 left-0 right-0 h-full overflow-hidden">
      <div className="fire-container">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`fire-particle fire-${i + 1}`} />
        ))}
      </div>
    </div>
    
    <div className="absolute inset-0">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`floating-orb orb-${i + 1}`} />
      ))}
    </div>
  </div>
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
    <h3 className="text-lg sm:text-xl font-bold mb-2 text-white/90 font-orbitron">{title}</h3>
    <p className="text-sm sm:text-base text-gray-400">{description}</p>
    <motion.div
      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500"
      initial={{ width: 0 }}
      whileInView={{ width: '100%' }}
      transition={{ duration: 0.8, delay: delay + 0.3 }}
    />
  </motion.div>
);

const Footer: React.FC = () => {
  const footerLinks = [
    { href: '/launch', label: 'Launch' },
    { href: '/swap', label: 'Swap' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' }
  ];

  const socialLinks = [
    { href: 'https://github.com', icon: Github, label: 'GitHub' },
  ];

  return (
    <footer className="relative z-10 mt-16">
      <div className="bg-gradient-to-b from-transparent via-black/50 to-black border-t border-white/10">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 py-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-4 space-y-6">
              <motion.div 
                className="flex items-center justify-center md:justify-start space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Rocket className="h-8 w-8 text-cyan-400" />
                </motion.div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400 font-['Orbitron']">
                  IGNIS
                </span>
              </motion.div>
              <motion.p 
                className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto md:mx-0 text-center md:text-left"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Your gateway to the next generation of digital assets and decentralized finance. Building the future of blockchain technology.
              </motion.p>
            </div>

            {/* Quick Links Section */}
            <div className="col-span-1 md:col-span-4 flex flex-col items-center md:items-start space-y-6">
              <h4 className="text-white text-lg font-['Orbitron'] relative">
                Quick Links
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                />
              </h4>
              <div className="flex flex-col items-center md:items-start space-y-4">
                {footerLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors group relative"
                    whileHover={{ x: 5 }}
                  >
                    <span className="font-['Orbitron']">{link.label}</span>
                    <motion.span
                      className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-cyan-500 to-teal-500"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                    />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Connect Section */}
            <div className="col-span-1 md:col-span-4 flex flex-col items-center md:items-start space-y-6">
              <h4 className="text-white text-lg font-['Orbitron'] relative">
                Connect With Us
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                />
              </h4>
              <div className="flex justify-center md:justify-start space-x-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 360,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <motion.div 
            className="mt-16 pt-8 border-t border-white/10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-sm font-['Orbitron']">
              © {new Date().getFullYear()} IGNIS. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

const HomeComponent = () => {
  const { scrollYProgress } = useScroll();
  const router = useRouter();

  return (
    <div className="bg-black min-h-screen relative font-['Orbitron']">
      <GradientBackground />
      <Navbar currentPath="/" />

      <main className="relative pt-24 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-size-200 animate-gradient font-orbitron"
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
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-sm sm:text-base font-orbitron"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/launch')}
              >
                <Coins className="inline-block mr-2 h-4 w-4" />
                START CREATING
              </motion.button>
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-300 text-sm sm:text-base font-orbitron"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/swap')}
              >
                <RefreshCw className="inline-block mr-2 h-4 w-4" />
                SWAP ASSETS
              </motion.button>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-16 sm:mt-24 px-4">
            <FeatureCard
              icon={Coins}
              title="Token Creation"
              description="Launch your token in minutes with our intuitive platform. Smart contracts made simple."
              delay={0.2}
            />
            <FeatureCard
              icon={BarChart3}
              title="Portfolio Tracking"
              description="Monitor your investments with advanced analytics and real-time data."
              delay={0.4}
            />
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { filter: brightness(1) blur(20px); }
          50% { filter: brightness(1.3) blur(25px); }
        }

        .floating-orb {
          animation: float 10s infinite, pulse-glow 4s infinite;
        }

        .fire-particle {
          animation: rise 3s infinite, pulse-glow 2s infinite;
        }

        .fire-container {
          position: absolute;
          bottom: -50%;
          left: 0;
          right: 0;
          height: 200%;
          transform: scale(2);
          filter: blur(3px);
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

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(50px, -50px) scale(1.2) rotate(5deg);
          }
          50% {
            transform: translate(0, -100px) scale(1) rotate(0deg);
          }
          75% {
            transform: translate(-50px, -50px) scale(0.8) rotate(-5deg);
          }
        }

        .orb-1 { background: rgba(0, 255, 255, 0.2); left: 10%; top: 20%; animation-delay: 0s; }
        .orb-2 { background: rgba(0, 200, 255, 0.2); left: 80%; top: 50%; animation-delay: 1s; }
        .orb-3 { background: rgba(0, 255, 230, 0.2); left: 30%; top: 70%; animation-delay: 2s; }
        .orb-4 { background: rgba(0, 230, 255, 0.2); left: 60%; top: 30%; animation-delay: 3s; }
        .orb-5 { background: rgba(0, 210, 255, 0.2); left: 20%; top: 40%; animation-delay: 4s; }
        .orb-6 { background: rgba(0, 255, 240, 0.2); left: 70%; top: 60%; animation-delay: 5s; }
        .orb-7 { background: rgba(0, 240, 255, 0.2); left: 40%; top: 20%; animation-delay: 6s; }
        .orb-8 { background: rgba(0, 220, 255, 0.2); left: 90%; top: 80%; animation-delay: 7s; }

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

        /* New shimmer effect for cards */
        .group:hover::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
          transform: skewX(-45deg);
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-200%) skewX(-45deg);
          }
          100% {
            transform: translateX(200%) skewX(-45deg);
          }
        }

        /* Enhanced button hover effects */
        button:hover {
          animation: buttonPulse 2s infinite;
        }

        @keyframes buttonPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 255, 255, 0);
          }
        }

        .cyber-fire-container {
          position: absolute;
          bottom: -20%;
          left: 0;
          right: 0;
          height: 200%;
          transform: scale(2);
        }

        .cyber-fire {
          position: absolute;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to top, transparent, rgba(0, 255, 255, 0.5));
          filter: blur(2px);
          border-radius: 50% 50% 0 0;
          animation: cyber-burn 2s infinite;
        }

        .cyber-fire-base {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(to top, transparent, rgba(0, 255, 255, 0.2));
          filter: blur(4px);
          animation: base-pulse 2s infinite;
        }
            @keyframes cyber-burn {
          0% {
            height: 60px;
            opacity: 0;
          }
          25% {
            height: 80px;
            opacity: 0.5;
          }
          50% {
            height: 120px;
            opacity: 0.3;
          }
          75% {
            height: 90px;
            opacity: 0.2;
          }
          100% {
            height: 60px;
            opacity: 0;
          }
        }

        @keyframes base-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.5;
            transform: scaleY(1.2);
          }
        }

        /* Your existing animations below */
        @keyframes pulse-glow {
          0%, 100% { filter: brightness(1) blur(20px); }
          50% { filter: brightness(1.3) blur(25px); }
        }
      `}</style>
    </div>
  );
};

export default HomeComponent;
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  User, 
  Mail, 
  MessageSquare,
  CheckCircle,
  RefreshCw,
  XCircle
} from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success state after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const inputClasses = "w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white transition-all duration-300";
  
  const formControls = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
            Get in Touch
          </h1>
          <p className="text-gray-400 text-lg">
            Have a question? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-xl blur-xl" />
          
          <div className="relative bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={formControls} initial="initial" animate="animate">
                <div className="relative">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="John Doe"
                      required
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={formControls} initial="initial" animate="animate">
                <div className="relative">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="john@example.com"
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={formControls} initial="initial" animate="animate">
                <div className="relative">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputClasses} min-h-[120px] resize-y`}
                      placeholder="Your message here..."
                      required
                    />
                    <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full p-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium 
                          hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' && (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                )}
                {status === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Sent Successfully!
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center text-red-400"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Error Sending
                  </motion.div>
                )}
                {status === 'idle' && (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-teal-900/20" />
        <div className="absolute inset-0">
          <div className="grid-animation opacity-10" />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
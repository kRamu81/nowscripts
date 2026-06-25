import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';

export const ExpandableImage = ({ src, alt, title, ...props }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="relative group cursor-pointer my-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-center items-center shadow-sm hover:shadow-md transition-shadow"
        onClick={() => setIsOpen(true)}
      >
        <img src={src} alt={alt || title} title={title} className="max-w-full max-h-[600px] object-contain rounded-xl" {...props} />
        
        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-medium flex items-center gap-2 text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-200">
            <Maximize2 className="w-4 h-4" /> Open Full Screen
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-zoom-out"
              onClick={() => setIsOpen(false)}
            />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 z-[210] p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              src={src}
              alt={alt}
              className="relative z-[205] max-w-full max-h-full object-contain rounded-md shadow-2xl"
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

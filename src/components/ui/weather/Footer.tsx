import React from 'react';
import { Github, Youtube, Linkedin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-8 pt-6 border-t border-cyan-500/20 text-center text-sm text-cyan-200/50">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <p className="flex items-center gap-2">
          {/* Replaced Sparkles and BarChart with logo */}
          Powered by Syntax Squad
        </p>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <a href="https://www.youtube.com/@SyntaxSquad22" className="hover:text-white transition-colors flex items-center gap-1">
          <Youtube className="w-4 h-4" />
          YouTube
        </a>
        <p>•</p>
        <a href="https://www.linkedin.com/company/syntaxsquad22/" className="hover:text-white transition-colors flex items-center gap-1">
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </a>
        <p>•</p>
        <a href="https://www.facebook.com/share/1Hmnpq9pyV/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
          <Facebook className="w-4 h-4" />
          FaceBook
        </a>
        <p>•</p>
        <a href="https://www.instagram.com/_syntax_squad_/?igsh=eHRnZDdpM3lhano3#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
          <Instagram className="w-4 h-4" />
          Instagram
        </a>
      </div>
      
      <p className="mt-4 text-xs text-gray-400">
        © {new Date().getFullYear()} SyntaxSquad. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
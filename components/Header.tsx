
import React from 'react';
import { Pickaxe, Search, Bookmark } from 'lucide-react';

interface HeaderProps {
  onShowSaved: () => void;
  savedCount: number;
}

const Header: React.FC<HeaderProps> = ({ onShowSaved, savedCount }) => {
  return (
    <header className="w-full py-4 px-6 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/20">
            <Pickaxe className="text-slate-900 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-serif">DigLog</h1>
            <p className="text-xs text-amber-500 font-medium tracking-wide">ARTIFACT ARCHIVE SEARCH</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-amber-400 transition-colors">Database</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Identification</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Resources</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={onShowSaved}
            className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 text-slate-300 text-sm font-medium"
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white shadow-sm">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import { Trash2, Calendar, Search, ArrowRight } from 'lucide-react';
import { SavedItem } from '../types';

interface SavedViewProps {
  items: SavedItem[];
  onLoad: (item: SavedItem) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const SavedView: React.FC<SavedViewProps> = ({ items, onLoad, onDelete, onClose }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-[60vh]">
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
        <div>
            <h2 className="text-2xl font-serif font-bold text-slate-100">Saved Discoveries</h2>
            <p className="text-slate-400 text-sm">Your personal archive of identified artifacts</p>
        </div>
        <button onClick={onClose} className="text-sm font-medium text-amber-500 hover:text-amber-400 flex items-center gap-2 px-4 py-2 hover:bg-amber-950/30 rounded-lg transition-all">
            Back to Search <ArrowRight className="w-4 h-4"/>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-800 border-dashed">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
            <Search className="w-8 h-8" />
          </div>
          <p className="text-slate-400 font-medium">No saved items yet.</p>
          <p className="text-slate-600 text-sm mt-1">Identify an artifact and click "Save" to add it here.</p>
          <button onClick={onClose} className="mt-6 text-amber-500 hover:underline text-sm">Start Searching</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 transition-all group">
              <div className="flex gap-4">
                {item.image ? (
                  <div className="w-24 h-24 bg-slate-900 rounded-lg flex-shrink-0 overflow-hidden border border-slate-700/50">
                     <img src={`data:${item.image.mimeType};base64,${item.image.data}`} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-slate-900 rounded-lg flex-shrink-0 flex items-center justify-center text-slate-700 border border-slate-700/50">
                     <Search className="w-8 h-8" />
                  </div>
                )}
                
                <div className="flex-grow min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                       <h3 className="font-bold text-slate-200 truncate pr-2 font-serif">{item.query || 'Unlabeled Artifact'}</h3>
                       <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} 
                        className="text-slate-600 hover:text-red-400 p-1.5 hover:bg-red-950/30 rounded transition-colors"
                        title="Delete"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                       <Calendar className="w-3 h-3" /> {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                       {item.resultText?.substring(0, 150).replace(/[#*]/g, '')}...
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-end">
                <button 
                  onClick={() => onLoad(item)}
                  className="text-xs bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-600/20 px-4 py-2 rounded-full font-medium transition-colors w-full sm:w-auto text-center"
                >
                  View Full Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedView;

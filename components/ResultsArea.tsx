
import React from 'react';
import { ExternalLink, Bookmark, Share2, AlertCircle, Image as ImageIcon, Check } from 'lucide-react';
import { SearchState } from '../types';
import ReactMarkdown from 'react-markdown';

interface ResultsAreaProps {
  state: SearchState;
  onSave: () => void;
  isSaved: boolean;
}

const ResultsArea: React.FC<ResultsAreaProps> = ({ state, onSave, isSaved }) => {
  const { resultText, groundingMetadata, isSearching, error, image } = state;

  if (isSearching) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-2/3"></div>
          <div className="mt-8 h-64 bg-slate-800 rounded-xl"></div>
        </div>
        <div className="lg:col-span-1 space-y-4">
           <div className="h-8 bg-slate-800 rounded w-1/2"></div>
           <div className="h-24 bg-slate-800 rounded-xl"></div>
           <div className="h-24 bg-slate-800 rounded-xl"></div>
           <div className="h-24 bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Search Failed</h3>
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  if (!resultText) {
    return (
        <div className="max-w-7xl mx-auto px-6 py-16 text-center opacity-50">
            <p className="text-lg text-slate-500">Upload an image or enter a description to search databases.</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content: Analysis */}
        <div className="lg:col-span-8">
          
          {/* Display Uploaded Image Analysis Context */}
          {image && (
            <div className="mb-8 flex items-start gap-6 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                <img 
                  src={`data:${image.mimeType};base64,${image.data}`} 
                  alt="Analyzed Object" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Analyzed Object
                </h3>
                <p className="text-slate-300 text-sm">
                  The results below are based on the visual analysis of this image{state.query ? ` and your note: "${state.query}"` : '.'}
                </p>
              </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
             {/* Decor */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-16 -mt-16"></div>

            <div className="prose prose-invert prose-amber max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-serif text-amber-50 font-bold mb-6 pb-4 border-b border-slate-800" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-serif text-amber-400 font-semibold mt-8 mb-4 flex items-center gap-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-medium text-slate-200 mt-6 mb-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-amber-200 font-semibold" {...props} />,
                    ul: ({node, ...props}) => <ul className="space-y-2 my-4 list-disc pl-5 text-slate-300" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-4" {...props} />,
                    a: ({node, ...props}) => <a className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors" {...props} />,
                    img: ({node, ...props}) => (
                        <span className="block my-4">
                           <img className="rounded-lg border border-slate-700 shadow-md max-h-96 mx-auto" {...props} />
                           {props.alt && <span className="block text-center text-xs text-slate-500 mt-2 italic">{props.alt}</span>}
                        </span>
                    ),
                  }}
                >
                    {resultText}
                </ReactMarkdown>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-sm text-slate-500">
               <span>AI-Generated Analysis based on search results</span>
               <div className="flex gap-4">
                  <button 
                    onClick={onSave}
                    disabled={isSaved}
                    className={`flex items-center gap-2 transition-all px-3 py-1.5 rounded-lg ${
                      isSaved 
                        ? 'text-green-500 bg-green-500/10 cursor-default' 
                        : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    {isSaved ? <Check className="w-4 h-4"/> : <Bookmark className="w-4 h-4"/>}
                    {isSaved ? 'Saved to Archive' : 'Save Result'}
                  </button>
                  <button className="flex items-center gap-2 hover:text-amber-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800">
                    <Share2 className="w-4 h-4"/> Share
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Sources & Database Links */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Verified Database Matches
            </h3>

            {groundingMetadata?.groundingChunks && groundingMetadata.groundingChunks.length > 0 ? (
              <div className="space-y-3">
                {groundingMetadata.groundingChunks.map((chunk, index) => {
                  if (!chunk.web?.uri) return null;
                  const isPas = chunk.web.uri.includes('finds.org.uk');
                  
                  return (
                    <a 
                      key={index}
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block group relative p-4 rounded-lg border transition-all duration-200 ${isPas ? 'bg-amber-950/20 border-amber-900/50 hover:border-amber-600/50 hover:bg-amber-900/30' : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-750'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPas ? 'bg-amber-900 text-amber-200' : 'bg-slate-700 text-slate-300'}`}>
                            {isPas ? 'PAS DATABASE' : 'EXTERNAL SOURCE'}
                         </span>
                         <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                      </div>
                      <h4 className="text-sm font-medium text-slate-200 group-hover:text-white leading-tight mb-1">
                        {chunk.web.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate group-hover:text-slate-400">
                        {chunk.web.uri}
                      </p>
                    </a>
                  );
                })}
              </div>
            ) : (
                <div className="text-center py-8 bg-slate-800 rounded-lg border border-slate-700 border-dashed">
                    <p className="text-slate-500 text-sm">No direct database links returned.</p>
                </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-xs font-semibold text-slate-400 mb-3">QUICK LINKS</h4>
                <div className="flex flex-wrap gap-2">
                    <a href="https://finds.org.uk" target="_blank" rel="noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition-colors">Finds.org.uk</a>
                    <a href="https://www.ukdfd.co.uk" target="_blank" rel="noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition-colors">UKDFD</a>
                    <a href="https://www.britishmuseum.org/collection" target="_blank" rel="noreferrer" className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-full transition-colors">British Museum</a>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsArea;

import React, { useState, useRef } from 'react';
import { Search, Loader2, Filter, Camera, X, Image as ImageIcon } from 'lucide-react';
import { DatabaseFilter, ImageAttachment } from '../types';

interface SearchHeroProps {
  onSearch: (query: string, filter: DatabaseFilter, image: ImageAttachment | null) => void;
  isSearching: boolean;
}

const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isSearching }) => {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<DatabaseFilter>(DatabaseFilter.ALL);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageAttachment | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || selectedImage) && !isProcessingImage) {
      onSearch(input, filter, selectedImage);
    }
  };

  const processImage = async (file: File): Promise<ImageAttachment> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxDim = 1024; // Limit max dimension to 1024px
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve({
            data: dataUrl.split(',')[1],
            mimeType: 'image/jpeg'
          });
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const processedImage = await processImage(file);
        setSelectedImage(processedImage);
      } catch (err) {
        console.error("Error processing image:", err);
        // Fallback or error handling
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative w-full bg-slate-900 border-b border-slate-800 pb-12 pt-16 px-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-900/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-slate-800/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
          Unearth History
        </h2>
        <p className="text-slate-400 mb-8 text-lg max-w-xl mx-auto leading-relaxed">
          Upload a photo or search the <span className="text-amber-400 font-semibold">Portable Antiquities Scheme</span> and other databases to identify your finds.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          {selectedImage && (
            <div className="mb-4 relative inline-block">
              <img 
                src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                alt="Selected" 
                className="h-32 rounded-lg border-2 border-amber-500/50 shadow-lg object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-slate-800 text-slate-200 rounded-full p-1 border border-slate-600 hover:bg-red-900/80 hover:text-red-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="relative flex items-center">
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingImage || isSearching}
              className="absolute left-2 p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
              title="Upload Image"
            >
              {isProcessingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={selectedImage ? "Add details about the image (optional)..." : "Describe your find (e.g. Roman Brooch)..."}
              className="w-full h-14 pl-12 pr-32 bg-slate-800/50 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all backdrop-blur-sm"
            />
            
            <div className="absolute right-2 flex items-center gap-2">
               {/* Filter Dropdown Toggle */}
               <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
                  title="Select Database"
                >
                  <Filter className="w-5 h-5" />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute top-10 right-0 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                    <div className="p-2 flex flex-col gap-1">
                      {Object.values(DatabaseFilter).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                          className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${filter === f ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-slate-700'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSearching || isProcessingImage}
                className="h-10 px-6 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3"/> {selectedImage ? "Image Attached" : "Text or Image Search"}</span>
            <span>Target: <span className="text-amber-500">{filter}</span></span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchHero;
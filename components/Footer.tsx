import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 bg-slate-950 border-t border-slate-900 text-center text-slate-500 text-sm">
      <div className="max-w-4xl mx-auto px-4">
        <p className="mb-2">DigLog is a tool for educational and identification purposes.</p>
        <p>Always follow the <a href="https://www.ncmd.co.uk/code-of-conduct/" className="text-amber-600 hover:underline">Code of Practice for Responsible Metal Detecting</a>.</p>
        <p className="mt-4 text-xs opacity-50">&copy; {new Date().getFullYear()} DigLog. Powered by Google Gemini.</p>
      </div>
    </footer>
  );
};

export default Footer;
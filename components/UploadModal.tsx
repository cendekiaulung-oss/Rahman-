import React, { useState } from 'react';
import { Upload, X, Loader2, CheckCircle, AlertCircle, File as FileIcon } from 'lucide-react';
import { classifyFile } from '../services/geminiService';
import { FileRecord, FileCategory } from '../types';

interface UploadModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newFile: FileRecord) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ userId, isOpen, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ category: FileCategory, tags: string[], summary: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null);
      setAnalysisResult(null);

      // Trigger AI Analysis
      setIsAnalyzing(true);
      try {
        const result = await classifyFile(file.name, file.type, file.size);
        setAnalysisResult(result);
      } catch (err) {
        setError("Gagal menganalisis file. Silakan isi data secara manual.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSave = () => {
    if (!selectedFile || !analysisResult) return;

    const newRecord: FileRecord = {
      id: `f-${Date.now()}`,
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      size: selectedFile.size,
      uploadDate: new Date().toISOString(),
      category: analysisResult.category,
      tags: analysisResult.tags,
      uploadedBy: userId,
      description: analysisResult.summary
    };

    onUploadSuccess(newRecord);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Upload Dokumen Baru</h3>
            <p className="text-xs text-slate-500">Analisis AI otomatis aktif</p>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Drop Zone Visual */}
          <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            selectedFile ? 'border-blue-300 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}>
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png"
            />
            
            {!selectedFile ? (
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Klik untuk memilih file</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOCX, XLSX, JPG, PNG (Max 10MB)</p>
                </div>
              </label>
            ) : (
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-blue-600 text-white rounded-lg shadow-md">
                  <FileIcon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => { setSelectedFile(null); setAnalysisResult(null); }} className="text-red-500 text-xs font-medium hover:underline">
                  Ganti
                </button>
              </div>
            )}
          </div>

          {/* AI Status Area */}
          {isAnalyzing && (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <Loader2 className="animate-spin text-blue-600" size={20} />
              <div className="text-sm text-slate-600">
                <span className="font-semibold">Gemini AI</span> sedang menganalisis dokumen...
              </div>
            </div>
          )}

          {error && (
             <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200 text-red-700 text-sm">
               <AlertCircle size={18} />
               {error}
             </div>
          )}

          {/* Analysis Result */}
          {analysisResult && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                 <div className="flex items-center gap-2 mb-3 text-emerald-800 font-semibold text-sm">
                   <CheckCircle size={16} />
                   Hasil Klasifikasi Otomatis
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <label className="text-xs text-slate-500 uppercase font-bold">Kategori</label>
                     <p className="font-medium text-slate-900 bg-white px-2 py-1 rounded border border-emerald-100 mt-1">
                       {analysisResult.category}
                     </p>
                   </div>
                   <div>
                     <label className="text-xs text-slate-500 uppercase font-bold">Tags</label>
                     <div className="flex flex-wrap gap-1 mt-1">
                       {analysisResult.tags.map(tag => (
                         <span key={tag} className="text-xs bg-white text-slate-600 px-1.5 py-0.5 rounded border border-emerald-100">#{tag}</span>
                       ))}
                     </div>
                   </div>
                   <div className="col-span-2">
                     <label className="text-xs text-slate-500 uppercase font-bold">Ringkasan</label>
                     <p className="text-slate-700 italic mt-1 text-xs">"{analysisResult.summary}"</p>
                   </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors text-sm">
            Batal
          </button>
          <button 
            disabled={!selectedFile || !analysisResult}
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
          >
            <Upload size={16} />
            Simpan ke Arsip
          </button>
        </div>
      </div>
    </div>
  );
};
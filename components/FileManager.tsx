import React, { useState, useMemo } from 'react';
import { FileRecord, FileCategory, UserRole, User } from '../types';
import { Search, Filter, Download, Trash2, Eye, FileText, Calendar } from 'lucide-react';

interface FileManagerProps {
  files: FileRecord[];
  currentUser: User;
  onDelete: (id: string) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({ files, currentUser, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = 
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'All' || file.category === categoryFilter;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      const dateA = new Date(a.uploadDate).getTime();
      const dateB = new Date(b.uploadDate).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [files, searchTerm, categoryFilter, sortOrder]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama file, tag, atau kata kunci..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-300 text-slate-700 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">Semua Kategori</option>
              {Object.values(FileCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>

          <button 
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Calendar size={16} />
            <span>{sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
        <div className="col-span-5">Nama Dokumen</div>
        <div className="col-span-3">Kategori & Tags</div>
        <div className="col-span-2 text-right">Ukuran</div>
        <div className="col-span-2 text-center">Aksi</div>
      </div>

      {/* File List */}
      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Search size={48} className="mb-4 opacity-50" />
            <p>Tidak ada dokumen yang ditemukan</p>
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div key={file.id} className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-blue-50/50 rounded-lg border border-transparent hover:border-blue-100 transition-all group">
              <div className="col-span-5 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                   file.fileType.includes('pdf') ? 'bg-red-100 text-red-600' : 
                   file.fileType.includes('sheet') ? 'bg-green-100 text-green-600' :
                   file.fileType.includes('image') ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate" title={file.fileName}>{file.fileName}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{new Date(file.uploadDate).toLocaleDateString('id-ID')}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="truncate max-w-[200px]">{file.description}</span>
                  </p>
                </div>
              </div>

              <div className="col-span-3">
                <div className="flex flex-col gap-1.5">
                  <span className="inline-flex w-fit px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {file.category}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {file.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100">#{tag}</span>
                    ))}
                    {file.tags.length > 2 && <span className="text-[10px] text-slate-400">+{file.tags.length - 2}</span>}
                  </div>
                </div>
              </div>

              <div className="col-span-2 text-right text-sm text-slate-600 font-medium">
                {(file.size / 1024).toFixed(0)} KB
              </div>

              <div className="col-span-2 flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Lihat">
                  <Eye size={16} />
                </button>
                <button className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Download">
                  <Download size={16} />
                </button>
                {currentUser.role === UserRole.ADMIN && (
                  <button 
                    onClick={() => onDelete(file.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
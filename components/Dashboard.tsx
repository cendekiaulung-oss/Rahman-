import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileRecord, FileCategory } from '../types';
import { FileText, Database, Clock, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  files: FileRecord[];
  onViewAll: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export const Dashboard: React.FC<DashboardProps> = ({ files, onViewAll }) => {
  // Calculate Stats
  const totalFiles = files.length;
  const totalSize = (files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2); // MB
  const lastUpload = files.length > 0 
    ? new Date(Math.max(...files.map(f => new Date(f.uploadDate).getTime()))).toLocaleDateString('id-ID')
    : '-';

  // Prepare Chart Data
  const categoryData = Object.values(FileCategory).map(cat => ({
    name: cat,
    value: files.filter(f => f.category === cat).length
  })).filter(d => d.value > 0);

  const recentFiles = [...files].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Ringkasan Statistik</h2>
        <span className="text-sm text-slate-500">Update Terakhir: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Arsip</p>
            <h3 className="text-3xl font-bold text-slate-900">{totalFiles}</h3>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <ArrowUpRight size={12} /> +2 minggu ini
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <FileText size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Penggunaan Penyimpanan</p>
            <h3 className="text-3xl font-bold text-slate-900">{totalSize} <span className="text-lg text-slate-400 font-normal">MB</span></h3>
            <p className="text-xs text-slate-400 mt-2">Dari 10 GB kuota tersedia</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Database size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Upload Terakhir</p>
            <h3 className="text-xl font-bold text-slate-900">{lastUpload}</h3>
            <p className="text-xs text-slate-400 mt-2">Aktivitas sistem aktif</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Distribusi Kategori Dokumen</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Aktivitas Terakhir</h3>
            <button onClick={onViewAll} className="text-sm text-blue-600 hover:underline">Lihat Semua</button>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="space-y-4">
              {recentFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className={`w-10 h-10 rounded flex items-center justify-center text-white text-xs font-bold
                    ${file.fileType.includes('pdf') ? 'bg-red-500' : 
                      file.fileType.includes('sheet') || file.fileType.includes('excel') ? 'bg-green-600' :
                      file.fileType.includes('image') ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                    {file.fileName.split('.').pop()?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.fileName}</p>
                    <p className="text-xs text-slate-500">{new Date(file.uploadDate).toLocaleDateString('id-ID')}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full whitespace-nowrap">
                    {file.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { LayoutDashboard, FolderOpen, Upload, Settings, LogOut, FileText } from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentUser: User | null;
  currentView: string;
  onChangeView: (view: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser, currentView, onChangeView, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.PUBLIC] },
    { id: 'archive', label: 'Arsip Dokumen', icon: FolderOpen, roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.PUBLIC] },
    { id: 'upload', label: 'Upload Arsip', icon: Upload, roles: [UserRole.ADMIN, UserRole.STAFF] },
  ];

  if (!currentUser) return null;

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50 transition-all duration-300">
      <div className="p-6 border-b border-slate-700 flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-lg">
          <FileText size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">DigiArsip</h1>
          <p className="text-xs text-slate-400">Arsip Digital Instansi</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          if (!item.roles.includes(currentUser.role)) return null;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-600" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 capitalize">{currentUser.role.toLowerCase()}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-2 justify-center px-4 py-2 bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 rounded-lg transition-colors text-sm"
        >
          <LogOut size={16} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
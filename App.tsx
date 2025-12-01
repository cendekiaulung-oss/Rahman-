import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FileManager } from './components/FileManager';
import { UploadModal } from './components/UploadModal';
import { MOCK_USERS, MOCK_FILES } from './services/mockData';
import { User, FileRecord, UserRole } from './types';
import { ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [files, setFiles] = useState<FileRecord[]>(MOCK_FILES);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Load files from local storage if available (simple persistence)
  useEffect(() => {
    const savedFiles = localStorage.getItem('digiarsip_files');
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
  }, []);

  // Save files to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('digiarsip_files', JSON.stringify(files));
  }, [files]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUploadSuccess = (newFile: FileRecord) => {
    setFiles(prev => [newFile, ...prev]);
    setCurrentView('archive'); // Switch to archive view to see result
  };

  const handleDeleteFile = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus arsip ini secara permanen?')) {
      setFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/30">
              <ShieldCheck size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">DigiArsip Login</h1>
          <p className="text-slate-500 mb-8 text-sm">Sistem Manajemen Arsip Digital Terpadu</p>
          
          <div className="space-y-3">
            {MOCK_USERS.map(user => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4 group text-left"
              >
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-blue-700">{user.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</p>
                </div>
              </button>
            ))}
          </div>
          
          <p className="mt-8 text-xs text-slate-400">
            &copy; 2024 Dinas Komunikasi & Informatika. Demo Version.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        currentUser={currentUser} 
        currentView={currentView} 
        onChangeView={(view) => {
          if (view === 'upload') {
            setIsUploadModalOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-64 p-8 animate-fade-in">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">
              {currentView === 'dashboard' ? 'Dashboard Utama' : 'Arsip Digital'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Selamat datang kembali, {currentUser.name.split(' ')[0]}
            </p>
          </div>
          
          {currentView === 'archive' && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.STAFF) && (
             <button 
               onClick={() => setIsUploadModalOpen(true)}
               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all"
             >
               + Upload Dokumen
             </button>
          )}
        </header>

        {currentView === 'dashboard' && (
          <Dashboard files={files} onViewAll={() => setCurrentView('archive')} />
        )}

        {currentView === 'archive' && (
          <FileManager files={files} currentUser={currentUser} onDelete={handleDeleteFile} />
        )}

        {/* Upload Modal is global but triggered via state */}
        <UploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)}
          userId={currentUser.id}
          onUploadSuccess={handleUploadSuccess}
        />
      </main>
    </div>
  );
};

export default App;
import { FileCategory, FileRecord, User, UserRole } from "../types";

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin Arsip',
    role: UserRole.ADMIN,
    avatar: 'https://ui-avatars.com/api/?name=Admin+Arsip&background=0D8ABC&color=fff'
  },
  {
    id: 'u2',
    name: 'Staf Administrasi',
    role: UserRole.STAFF,
    avatar: 'https://ui-avatars.com/api/?name=Staf+Admin&background=22c55e&color=fff'
  },
  {
    id: 'u3',
    name: 'Masyarakat Umum',
    role: UserRole.PUBLIC,
    avatar: 'https://ui-avatars.com/api/?name=Public+User&background=64748b&color=fff'
  }
];

export const MOCK_FILES: FileRecord[] = [
  {
    id: 'f1',
    fileName: 'Laporan_Keuangan_Q1_2024.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 2500000,
    uploadDate: '2024-03-15T10:00:00Z',
    category: FileCategory.KEUANGAN,
    tags: ['keuangan', '2024', 'kuartal 1'],
    uploadedBy: 'u2',
    description: 'Laporan realisasi anggaran kuartal pertama tahun 2024.'
  },
  {
    id: 'f2',
    fileName: 'SK_Pengangkatan_Pegawai_2024.pdf',
    fileType: 'application/pdf',
    size: 1200000,
    uploadDate: '2024-01-10T09:30:00Z',
    category: FileCategory.ADMINISTRASI,
    tags: ['SK', 'kepegawaian', '2024'],
    uploadedBy: 'u1',
    description: 'Surat Keputusan pengangkatan pegawai honorer.'
  },
  {
    id: 'f3',
    fileName: 'Dokumentasi_Rapat_Koordinasi.jpg',
    fileType: 'image/jpeg',
    size: 4500000,
    uploadDate: '2024-04-02T14:15:00Z',
    category: FileCategory.FOTO,
    tags: ['rapat', 'koordinasi', 'foto'],
    uploadedBy: 'u2',
    description: 'Foto kegiatan rapat koordinasi bulanan.'
  },
  {
    id: 'f4',
    fileName: 'Perda_No_5_Tahun_2023_Tata_Ruang.pdf',
    fileType: 'application/pdf',
    size: 5600000,
    uploadDate: '2023-12-20T11:00:00Z',
    category: FileCategory.HUKUM,
    tags: ['perda', 'tata ruang', 'hukum'],
    uploadedBy: 'u1',
    description: 'Peraturan Daerah tentang Rencana Tata Ruang Wilayah.'
  },
  {
    id: 'f5',
    fileName: 'Evaluasi_Kinerja_Semester_1.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 850000,
    uploadDate: '2024-07-01T08:45:00Z',
    category: FileCategory.LAPORAN,
    tags: ['evaluasi', 'kinerja', 'semester 1'],
    uploadedBy: 'u2',
    description: 'Dokumen evaluasi kinerja pegawai semester 1.'
  }
];
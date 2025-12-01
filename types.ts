export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  PUBLIC = 'PUBLIC'
}

export enum FileCategory {
  ADMINISTRASI = 'Administrasi',
  LAPORAN = 'Laporan',
  KEUANGAN = 'Keuangan',
  HUKUM = 'Produk Hukum',
  FOTO = 'Dokumentasi Foto',
  LAINNYA = 'Lainnya'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface FileRecord {
  id: string;
  fileName: string;
  fileType: string; // pdf, docx, etc.
  size: number; // in bytes
  uploadDate: string; // ISO string
  category: FileCategory;
  tags: string[];
  uploadedBy: string; // User ID
  description?: string;
}

export interface DashboardStats {
  totalFiles: number;
  totalSize: number;
  categoryDistribution: { name: string; value: number }[];
  recentUploads: FileRecord[];
}

/**
 * SQL Database Schema Design (Conceptual)
 * ---------------------------------------
 * 
 * Table: Users
 * - id (INT, PK)
 * - username (VARCHAR)
 * - password_hash (VARCHAR)
 * - role (ENUM: 'admin', 'staff', 'public')
 * - created_at (TIMESTAMP)
 * 
 * Table: Categories
 * - id (INT, PK)
 * - name (VARCHAR)
 * - description (TEXT)
 * 
 * Table: Files
 * - id (INT, PK)
 * - user_id (INT, FK -> Users.id)
 * - category_id (INT, FK -> Categories.id)
 * - file_name (VARCHAR)
 * - file_path (VARCHAR)
 * - file_size (BIGINT)
 * - file_type (VARCHAR)
 * - description (TEXT)
 * - tags (JSONB)
 * - created_at (TIMESTAMP)
 * - updated_at (TIMESTAMP)
 * 
 * Table: AuditLogs
 * - id (INT, PK)
 * - user_id (INT)
 * - action (VARCHAR)
 * - timestamp (TIMESTAMP)
 */
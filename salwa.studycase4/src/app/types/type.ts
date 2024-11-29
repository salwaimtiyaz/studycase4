export interface UserProps {
    id_user: string;
    nama_user: string;
    username: string;
    password: string;
    role?: 'admin' | 'resepsionis' | '';
    foto?: string;
	status: 'published' | 'draft';
}
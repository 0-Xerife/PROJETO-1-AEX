import { adminFixtures } from '../data/adminFixtures';
import { createMockAdminService, type AdminService } from './adminService';

// Substituir somente esta composição por um adaptador REST quando a API existir.
export const adminService: AdminService = createMockAdminService(adminFixtures);

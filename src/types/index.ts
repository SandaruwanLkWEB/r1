export type Role =
  | 'ADMIN'
  | 'HOD'
  | 'HR'
  | 'TRANSPORT_AUTHORITY'
  | 'EMP'
  | 'PLANNING'
  | 'SUPER_ADMINISTER';

export type AuthUser = {
  sub: string;
  email: string;
  role: Role;
  departmentId?: string;
  employeeId?: string;
  fullName: string;
};

export type ApiList<T> = T[];

export type RequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ADMIN_APPROVED'
  | 'ADMIN_REJECTED'
  | 'TA_PROCESSING'
  | 'TA_COMPLETED'
  | 'HR_APPROVED'
  | 'HR_REJECTED'
  | 'CANCELLED';

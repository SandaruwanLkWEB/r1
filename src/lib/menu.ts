import { BarChart3, Bell, Bus, Building2, Car, FileText, GitBranch, LayoutDashboard, MapPinned, Route, Settings, ShieldUser, Users } from 'lucide-react';
import { Role } from '../types';

export const menuItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'SUPER_ADMINISTER', 'HOD', 'HR', 'TRANSPORT_AUTHORITY', 'EMP', 'PLANNING'] as Role[] },
  { key: 'employees', label: 'Employees', path: '/employees', icon: Users, roles: ['ADMIN', 'SUPER_ADMINISTER', 'HOD', 'HR'] as Role[] },
  { key: 'departments', label: 'Departments', path: '/departments', icon: Building2, roles: ['ADMIN', 'SUPER_ADMINISTER', 'HR'] as Role[] },
  { key: 'routes', label: 'Routes', path: '/routes', icon: Route, roles: ['ADMIN', 'SUPER_ADMINISTER', 'TRANSPORT_AUTHORITY', 'PLANNING'] as Role[] },
  { key: 'places', label: 'Places', path: '/places', icon: MapPinned, roles: ['ADMIN', 'SUPER_ADMINISTER', 'HOD'] as Role[] },
  { key: 'vehicles', label: 'Vehicles', path: '/vehicles', icon: Bus, roles: ['ADMIN', 'SUPER_ADMINISTER', 'TRANSPORT_AUTHORITY'] as Role[] },
  { key: 'drivers', label: 'Drivers', path: '/drivers', icon: Car, roles: ['ADMIN', 'SUPER_ADMINISTER', 'TRANSPORT_AUTHORITY'] as Role[] },
  { key: 'requests', label: 'Requests', path: '/requests', icon: FileText, roles: ['ADMIN', 'SUPER_ADMINISTER', 'HOD', 'HR', 'TRANSPORT_AUTHORITY', 'PLANNING'] as Role[] },
  { key: 'groups', label: 'Generated Groups', path: '/groups', icon: GitBranch, roles: ['ADMIN', 'SUPER_ADMINISTER', 'HR', 'TRANSPORT_AUTHORITY', 'PLANNING'] as Role[] },
  { key: 'reports', label: 'Reports', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'SUPER_ADMINISTER', 'HR', 'TRANSPORT_AUTHORITY', 'PLANNING'] as Role[] },
  { key: 'users', label: 'User Control', path: '/users', icon: ShieldUser, roles: ['ADMIN', 'SUPER_ADMINISTER', 'HR'] as Role[] },
  { key: 'notifications', label: 'Notifications', path: '/notifications', icon: Bell, roles: ['ADMIN', 'SUPER_ADMINISTER', 'HOD', 'HR', 'TRANSPORT_AUTHORITY', 'EMP', 'PLANNING'] as Role[] },
  { key: 'profile', label: 'Profile', path: '/profile', icon: Settings, roles: ['ADMIN', 'SUPER_ADMINISTER', 'HOD', 'HR', 'TRANSPORT_AUTHORITY', 'EMP', 'PLANNING'] as Role[] },
];

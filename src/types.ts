export type UserRole = 'admin' | 'hr' | 'employee' | 'manager';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole; // Assurez-vous que 'role' est bien présent
    department: string;
    position: string;
    hireDate: string;
    isActive: boolean;
    avatar?: string;
}

export interface ChatMessage {
    id: string;
    message: string;
    isBot: boolean;
    timestamp: string;
}

export interface Employee {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    department: string;
    position: string;
    hireDate: string;
    isActive: boolean;
    avatar?: string;
    salary?: number;
    managerId?: string;
    skills?: string[];
    performance?: number;
}

export interface VacationRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    startDate: string;
    endDate: string;
    type: 'paid' | 'unpaid' | 'sick' | 'maternity' | 'paternity' | 'vacation' | 'personal';
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedDate?: string;
    comments?: string;
    daysRequested?: number;
    days: number;
    requestDate: string;
}

export interface Training {
    id: string;
    title: string;
    description: string;
    instructor: string;
    duration: number;
    startDate: string;
    endDate: string;
    location?: string;
    maxParticipants?: number;
    currentParticipants?: number;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'available' | 'enrolled' | 'in_progress';
    progress?: number;
    category: string;
    cost?: number;
    participants?: string[];
}

export interface Objective {
    id: string;
    employeeId: string;
    employeeName: string;
    title: string;
    description: string;
    category: 'performance' | 'development' | 'project' | 'behavioral';
    priority: 'low' | 'medium' | 'high';
    status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
    startDate: string;
    dueDate: string;
    completedDate?: string;
    progress: number;
    managerId: string;
    managerName: string;
}

export interface AIPredicton {
    id: string;
    employeeId: string;
    employeeName: string;
    currentSalary: number;
    predictedSalary: number;
    increasePercentage: number;
    confidence: number;
    factors: string[];
    recommendation: string;
    effectiveDate: string;
    createdAt: string;
}

// ... autres types ...
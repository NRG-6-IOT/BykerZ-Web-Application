export interface ExpenseItem {
  id: number;
  name: string;
  amount: number;
  unitPrice: number;
  totalPrice: number;
  itemType: string;
}

export interface Expense {
  id: number;
  name: string;
  finalPrice: number;
  expenseType: string;
  items: ExpenseItem[];
}

export interface Maintenance {
  id: number;
  details: string;
  vehicleId: number;
  dateOfService: string;
  location: string;
  description: string;
  state: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  expense: Expense | null;
}


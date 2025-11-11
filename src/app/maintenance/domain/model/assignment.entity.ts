export interface Owner {
  ownerId: number;
  completeName: string;
}

export interface Mechanic {
  mechanicId: number;
  completeName: string;
}

export interface Assignment {
  id: number;
  owner: Owner;
  mechanic: Mechanic;
  type: string;
  status: string;
  assignmentCode: string;
  createdAt: string;
}


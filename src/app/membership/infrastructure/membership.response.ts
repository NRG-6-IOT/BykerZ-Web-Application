import { MembershipType } from '../domain/membership-type.enum';

export interface UpdateMechanicMembershipTypeResource {
  membershipType: MembershipType;
}

export interface MechanicResource {
  mechanicId: number;
  completeName: string;
  membershipType: MembershipType;
}

// Si no tienes Mechanic en otro lado, créalo aquí
export interface Mechanic {
  id: number;
  completeName: string;
  membershipType: MembershipType;
}

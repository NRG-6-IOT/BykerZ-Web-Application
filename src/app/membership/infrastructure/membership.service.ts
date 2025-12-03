// src/app/membership/application/membership.service.ts
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  UpdateMechanicMembershipTypeResource,
  MechanicResource,
  Mechanic
} from '../infrastructure/membership.response';
import { MembershipType } from '../domain/membership-type.enum';
import {MembershipAssembler} from '@app/membership/infrastructure/membership.assembler';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderMechanicEndpointPath}`;
  private http = inject(HttpClient);

  updateMechanicMembershipType(
    mechanicId: number,
    membershipType: MembershipType
  ): Observable<Mechanic> {

    // Crea el recurso para enviar al backend
    const updateResource: UpdateMechanicMembershipTypeResource = {
      membershipType: membershipType
    };

    console.log('URL:', `${this.baseUrl}/${mechanicId}/membership`);
    console.log('Data enviada:', updateResource);

    // Envía la petición PUT
    return this.http.put<MechanicResource>(
      `${this.baseUrl}/${mechanicId}/membership`,
      updateResource
    ).pipe(
      // Convierte la respuesta del backend a tu entidad TypeScript
      map((resource: MechanicResource) => {
        console.log('Respuesta recibida:', resource);
        return MembershipAssembler.toEntityFromResource(resource);
      })
    );
  }
}

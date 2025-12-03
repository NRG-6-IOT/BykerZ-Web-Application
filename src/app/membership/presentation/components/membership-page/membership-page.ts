import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MembershipType } from '@app/membership/domain/membership-type.enum';
import { Mechanic } from '@app/membership/infrastructure/membership.response';
import { AuthenticationService } from '@app/iam/services/authentication.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {MembershipService} from '@app/membership/infrastructure/membership.service';

@Component({
  selector: 'app-membership-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule  // Importa TranslateModule
  ],
  templateUrl: './membership-page.html',
  styleUrls: ['./membership-page.css']
})
export class MembershipPage implements OnInit {

  // Inyecta los servicios
  private authService = inject(AuthenticationService);
  private translate = inject(TranslateService);

  mechanicId: number = 0;

  plans = [
    {
      name: 'Bronze',
      price: '49.90',
      idealFor: 'membership.bronze.idealFor',
      maxClients: '50',
      storage: '1TB',
      membershipType: MembershipType.BRONZE,
      color: 'amber',
      translationKey: 'membership.plans.bronze'
    },
    {
      name: 'Silver',
      price: '99.90',
      idealFor: 'membership.silver.idealFor',
      maxClients: '200',
      storage: '8TB',
      membershipType: MembershipType.SILVER,
      color: 'blue',
      popular: true,
      translationKey: 'membership.plans.silver'
    },
    {
      name: 'Black',
      price: '149.90',
      idealFor: 'membership.black.idealFor',
      maxClients: '500',
      storage: '20TB',
      membershipType: MembershipType.BLACK,
      color: 'gray',
      translationKey: 'membership.plans.black'
    }
  ];

  isLoading: boolean = false;
  selectedPlan: string | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private membershipService: MembershipService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getMechanicId();
    this.debugLocalStorage();
  }

  private debugLocalStorage() {
    console.log('=== DEBUG LOCALSTORAGE ===');
    console.log('token:', localStorage.getItem('token'));
    console.log('user_role:', localStorage.getItem('user_role'));
    console.log('role_id:', localStorage.getItem('role_id'));
    console.log('==========================');
  }

  private getMechanicId() {
    // 1. Intenta obtener de role_id
    const roleId = localStorage.getItem('role_id');
    if (roleId) {
      this.mechanicId = parseInt(roleId, 10);
      console.log('MechanicId de role_id:', this.mechanicId);
      return;
    }

    // 2. Intenta obtener del AuthenticationService
    const currentUserId = this.authService.getCurrentUserIdSync();
    if (currentUserId && currentUserId > 0) {
      this.mechanicId = currentUserId;
      console.log('MechanicId de auth service:', this.mechanicId);
      return;
    }

    // 3. Intenta obtener del token JWT
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id || payload.userId || payload.sub;
        if (userId) {
          this.mechanicId = parseInt(userId, 10);
          console.log('MechanicId del token:', this.mechanicId);
          return;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // 4. Si no se encontró
    console.error('No se pudo obtener mechanicId');
    this.errorMessage = this.translate.instant('membership.error.noMechanic');
  }

  selectPlan(plan: any) {
    if (this.isLoading) return;

    // Verifica mechanicId
    if (!this.mechanicId || this.mechanicId <= 0) {
      this.errorMessage = this.translate.instant('membership.error.noMechanic');
      return;
    }

    // Verifica que sea mecánico
    const userRole = localStorage.getItem('user_role');
    if (userRole !== 'ROLE_MECHANIC') {
      this.errorMessage = this.translate.instant('membership.error.mechanicsOnly');
      return;
    }

    this.selectedPlan = plan.name;
    this.errorMessage = '';
    this.successMessage = '';

    // Confirmación traducida
    const planNameTranslated = this.translate.instant(plan.translationKey);
    const confirmMessage = this.translate.instant(
      'membership.confirmation',
      { plan: planNameTranslated, price: plan.price }
    ) || `¿Está seguro de que desea actualizar a ${planNameTranslated} por S/ ${plan.price}/mes?`;

    if (confirm(confirmMessage)) {
      this.updateMembership(plan.membershipType, planNameTranslated);
    }
  }

  private updateMembership(membershipType: MembershipType, planNameTranslated: string) {
    this.isLoading = true;

    console.log('Enviando actualización:', {
      mechanicId: this.mechanicId,
      membershipType: membershipType
    });

    this.membershipService.updateMechanicMembershipType(this.mechanicId, membershipType)
      .subscribe({
        next: (updatedMechanic: Mechanic) => {
          this.isLoading = false;

          // Traduce el mensaje de éxito
          const planTranslated = this.getTranslatedPlanName(updatedMechanic.membershipType);
          this.successMessage = this.translate.instant(
            'membership.success.message',
            { plan: planTranslated }
          );

          console.log('Mecánico actualizado:', updatedMechanic);

          // Guarda en localStorage
          localStorage.setItem('membership_type', updatedMechanic.membershipType);

          // Redirige
          setTimeout(() => {
            this.router.navigate(['/mechanic-dashboard']);
          }, 3000);
        }
      });
  }

  private getTranslatedPlanName(membershipType: MembershipType): string {
    switch (membershipType) {
      case MembershipType.BRONZE:
        return this.translate.instant('membership.plans.bronze');
      case MembershipType.SILVER:
        return this.translate.instant('membership.plans.silver');
      case MembershipType.BLACK:
        return this.translate.instant('membership.plans.black');
      default:
        return membershipType;
    }
  }
}

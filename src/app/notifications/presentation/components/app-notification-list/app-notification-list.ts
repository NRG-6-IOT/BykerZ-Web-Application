// notification-list.component.ts
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationEntity } from '@app/notifications/domain/model/notification-entity.entity';
import { Subscription } from 'rxjs';
import { WebSocketService } from '@app/notifications/infrastructure/websocket/websocket.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-notification-list.html',
  styleUrl: './app-notification-list.css'
})
export class NotificationListComponent implements OnInit, OnDestroy {
  @Input() vehicleId!: number;

  vehicleNotifications: NotificationEntity[] = [];
  isConnected = false;
  showPanel = false;
  unreadCount = 0;

  private subs: Subscription[] = [];

  constructor(private websocketService: WebSocketService) {}

  ngOnInit() {
    console.log('🚗 NotificationList iniciando para vehicle:', this.vehicleId);

    // Debug del estado inicial
    console.log('🔍 Estado inicial:', this.websocketService.getSubscriptionStatus());

    // Suscribirse al estado de conexión
    this.subs.push(
      this.websocketService.isConnected.subscribe(connected => {
        this.isConnected = connected;
        console.log('🔌 Estado conexión:', connected);
      })
    );

    // Suscribirse a las notificaciones
    this.subs.push(
      this.websocketService.notifications.subscribe(allNotifications => {
        console.log('📨 Total notificaciones:', allNotifications.length);
        this.vehicleNotifications = this.websocketService.getVehicleNotifications(this.vehicleId);
        this.unreadCount = this.vehicleNotifications.filter(n => !n.read).length;
        console.log(`📊 Notificaciones vehicle ${this.vehicleId}:`, this.vehicleNotifications.length);

        // Debug después de recibir notificación
        if (allNotifications.length > 0) {
          console.log('🔍 Estado después de notificación:', this.websocketService.getSubscriptionStatus());
        }
      })
    );

    // ✅ SUSCRIBIRSE UNA SOLA VEZ
    this.websocketService.subscribeToVehicle(this.vehicleId);

    // Debug después de suscribirse
    setTimeout(() => {
      console.log('🔍 Estado después de suscribirse:', this.websocketService.getSubscriptionStatus());
    }, 1000);
  }

  toggleNotifications() {
    this.showPanel = !this.showPanel;
  }

  markAsRead(notificationId: number) {
    this.websocketService.markAsRead(notificationId);
  }

  markAllAsRead() {
    this.vehicleNotifications.forEach(notif => {
      if (!notif.read) {
        this.markAsRead(notif.id);
      }
    });
  }

  ngOnDestroy() {
    // ✅ DESUSCRIBIRSE CORRECTAMENTE
    this.websocketService.unsubscribeFromVehicle(this.vehicleId);
    this.subs.forEach(sub => sub.unsubscribe());
    console.log('🧹 NotificationList destruido para vehicle:', this.vehicleId);
    console.log('🔍 Estado final:', this.websocketService.getSubscriptionStatus());
  }
}

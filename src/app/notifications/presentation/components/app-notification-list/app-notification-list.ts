// notification-list.component.ts
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationEntity } from '@app/notifications/domain/model/notification-entity.entity';
import { Subscription } from 'rxjs';
import { WebSocketService } from '@app/notifications/infrastructure/websocket/websocket.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './app-notification-list.html',
  styleUrl: './app-notification-list.css'
})
export class NotificationListComponent implements OnInit, OnDestroy {
  @Input() vehicleId!: number;
  private shouldDestroy = true;

  vehicleNotifications: NotificationEntity[] = [];
  isConnected = false;
  showPanel = false;
  unreadCount = 0;

  private subs: Subscription[] = [];

  constructor(private websocketService: WebSocketService) {}

  ngOnInit() {

    // Suscribirse al estado de conexión
    this.subs.push(
      this.websocketService.isConnected.subscribe(connected => {
        this.isConnected = connected;
      })
    );

    // Suscribirse a las notificaciones
    this.subs.push(
      this.websocketService.notifications.subscribe(allNotifications => {
        this.vehicleNotifications = this.websocketService.getVehicleNotifications(this.vehicleId);
        this.unreadCount = this.vehicleNotifications.filter(n => !n.read).length;

      })
    );

    // SUSCRIBIRSE UNA SOLA VEZ
    this.websocketService.subscribeToVehicle(this.vehicleId);


  }

  toggleNotifications(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showPanel = !this.showPanel;

    // Si el panel se cierra Y no hay notificaciones sin leer, destruir
    if (!this.showPanel && this.unreadCount === 0) {
      this.destroyComponent();
    }
  }

  markAsRead(notificationId: number) {
    this.websocketService.markAsRead(notificationId);

    // Verificar si todas están leídas después de marcar
    setTimeout(() => {
      const updatedUnreadCount = this.vehicleNotifications.filter(n => !n.read).length;
      if (updatedUnreadCount === 0 && !this.showPanel) {
        this.destroyComponent();
      }
    }, 100);
  }

  markAllAsRead() {
    this.vehicleNotifications.forEach(notif => {
      if (!notif.read) {
        this.markAsRead(notif.id);
      }
    });

    // Destruir después de marcar todas
    setTimeout(() => {
      if (!this.showPanel) {
        this.destroyComponent();
      }
    }, 200);
  }

  private destroyComponent() {
    if (this.shouldDestroy) {
      this.ngOnDestroy();
    }
  }

  keepAlive() {
    this.shouldDestroy = false;
  }

  ngOnDestroy() {
    if (this.shouldDestroy) {
      this.websocketService.unsubscribeFromVehicle(this.vehicleId);
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

  extractValue(message: string, label: string): string {
    // Busca el label en el mensaje y extrae lo que viene después
    const index = message.indexOf(label);
    if (index === -1) return '';

    // Toma el texto desde después del label hasta la próxima coma o el final
    const afterLabel = message.substring(index + label.length);
    const nextComma = afterLabel.indexOf(',');

    if (nextComma !== -1) {
      return afterLabel.substring(0, nextComma).trim();
    } else {
      return afterLabel.trim();
    }
  }
}

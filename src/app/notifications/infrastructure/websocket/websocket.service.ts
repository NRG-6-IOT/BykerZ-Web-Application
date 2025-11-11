// websocket.service.ts
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { NotificationEntity } from '@app/notifications/domain/model/notification-entity.entity';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client | null = null;
  public notifications = new BehaviorSubject<NotificationEntity[]>([]);
  public isConnected = new BehaviorSubject<boolean>(false);
  private connectionAttempted = false;
  private activeSubscriptions = new Map<number, any>();
  private pendingSubscriptions = new Set<number>(); // ← Para evitar duplicados durante reconexión

  constructor() {}

  private connect() {
    if (this.connectionAttempted) return;
    this.connectionAttempted = true;

    console.log('🔄 Iniciando conexión WebSocket...');

    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws-wellness',
      reconnectDelay: 5000,
      connectionTimeout: 5000,

      onConnect: () => {
        console.log('✅ WebSocket Conectado exitosamente');
        this.isConnected.next(true);
        // NO llamar reconnectSubscriptions aquí - ya se maneja en setupSubscription
      },

      onDisconnect: () => {
        console.log('❌ WebSocket Desconectado');
        this.isConnected.next(false);
      },

      onStompError: (error) => {
        console.error('❌ Error STOMP:', error);
        this.isConnected.next(false);
      },

      onWebSocketError: (event) => {
        console.error('🔌 Error WebSocket:', event);
        this.isConnected.next(false);
      }
    });

    try {
      this.client.activate();
      console.log('🎯 Cliente WebSocket activado');
    } catch (error) {
      console.error('❌ Error activando WebSocket:', error);
    }
  }

  subscribeToVehicle(vehicleId: number) {
    console.log('📡 Intentando suscribirse a vehicle:', vehicleId);

    // ✅ VERIFICACIÓN MÁS ESTRICTA
    if (this.activeSubscriptions.has(vehicleId) || this.pendingSubscriptions.has(vehicleId)) {
      console.log('ℹ️ Ya suscrito o pendiente de suscripción a vehicle:', vehicleId);
      return;
    }

    // Marcar como pendiente
    this.pendingSubscriptions.add(vehicleId);

    // Si no hay cliente, conectarse primero
    if (!this.client) {
      console.log('🔄 Cliente no existe, conectando...');
      this.connect();
    }

    this.setupSubscription(vehicleId);
  }

  private setupSubscription(vehicleId: number) {
    // Si ya está conectado, suscribir inmediatamente
    if (this.isConnected.value && this.client) {
      console.log('✅ Ya conectado, suscribiendo inmediatamente');
      this.doSubscription(vehicleId);
      return;
    }

    // Si no está conectado, esperar la conexión
    console.log('⏳ Esperando conexión para vehicle:', vehicleId);

    const connectionSub = this.isConnected.subscribe(connected => {
      if (connected && this.client) {
        console.log('✅ Conectado, suscribiendo a vehicle:', vehicleId);
        this.doSubscription(vehicleId);
        connectionSub.unsubscribe(); // ← Limpiar después de usar
      }
    });

    // Limpiar suscripción después de 30 segundos por si acaso
    setTimeout(() => {
      connectionSub.unsubscribe();
      this.pendingSubscriptions.delete(vehicleId);
    }, 30000);
  }

  private doSubscription(vehicleId: number) {
    if (!this.client) {
      console.error('❌ Cliente WebSocket no disponible');
      this.pendingSubscriptions.delete(vehicleId);
      return;
    }

    // ✅ VERIFICACIÓN FINAL ANTES DE SUSCRIBIR
    if (this.activeSubscriptions.has(vehicleId)) {
      console.log('ℹ️ Ya existe suscripción activa para vehicle:', vehicleId);
      this.pendingSubscriptions.delete(vehicleId);
      return;
    }

    const topic = `/topic/vehicle/${vehicleId}/alerts`;
    console.log('🎯 Creando suscripción ÚNICA a:', topic);

    try {
      const stompSubscription = this.client.subscribe(topic, (message) => {
        console.log('🔔 Mensaje WebSocket recibido (SOLO UNA VEZ):', message.body);

        try {
          const data = JSON.parse(message.body);
          const notification = new NotificationEntity(
            Date.now(),
            data.vehicleId || vehicleId,
            data.title || 'Alerta',
            data.message || data.body,
            data.type,
            data.severity
          );

          // Agregar a la lista
          const current = this.notifications.value;
          this.notifications.next([notification, ...current]);

          this.showBrowserNotification(notification);
        } catch (error) {
          console.error('❌ Error parseando mensaje:', error);
        }
      });

      // ✅ MARCAR COMO SUSCRITO
      this.activeSubscriptions.set(vehicleId, stompSubscription);
      this.pendingSubscriptions.delete(vehicleId);

      console.log(`✅ Suscrito EXITOSAMENTE a ${topic}`);

    } catch (error) {
      console.error('❌ Error en suscripción:', error);
      this.pendingSubscriptions.delete(vehicleId);
    }
  }

  unsubscribeFromVehicle(vehicleId: number) {
    const subscription = this.activeSubscriptions.get(vehicleId);
    if (subscription) {
      subscription.unsubscribe();
      this.activeSubscriptions.delete(vehicleId);
      console.log('✅ Desuscrito de vehicle:', vehicleId);
    }
    this.pendingSubscriptions.delete(vehicleId);
  }

  private showBrowserNotification(notification: NotificationEntity) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        // Usar un icono por defecto si no existe el personalizado
        const iconUrl = '/assets/icons/alert.png';
        new Notification(notification.title, {
          body: notification.message,
          icon: iconUrl
        }).onerror = () => {
          // Si falla el icono, crear sin icono
          new Notification(notification.title, {
            body: notification.message
          });
        };
      } else if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }

  markAsRead(notificationId: number) {
    const notifications = this.notifications.value.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    this.notifications.next(notifications);
  }

  getVehicleNotifications(vehicleId: number): NotificationEntity[] {
    return this.notifications.value.filter(notif => notif.vehicleId === vehicleId);
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isConnected.next(false);

      // Limpiar todas las suscripciones
      this.activeSubscriptions.forEach((sub, vehicleId) => {
        sub.unsubscribe();
      });
      this.activeSubscriptions.clear();
      this.pendingSubscriptions.clear();

      console.log('🔌 WebSocket desconectado y limpiado');
    }
  }

  // ✅ MÉTODO PARA DEBUG: Ver estado actual
  getSubscriptionStatus() {
    return {
      activeSubscriptions: Array.from(this.activeSubscriptions.keys()),
      pendingSubscriptions: Array.from(this.pendingSubscriptions.keys()),
      isConnected: this.isConnected.value,
      totalNotifications: this.notifications.value.length
    };
  }
}

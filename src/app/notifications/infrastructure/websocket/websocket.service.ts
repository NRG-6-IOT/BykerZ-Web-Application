import {Client, IMessage} from '@stomp/stompjs';
import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client | null = null;
  private isConnected = new BehaviorSubject<boolean>(false);
  private notifications = new BehaviorSubject<Notification[]>([]);
  private subscriptions = new Map<number, any>(); // Para manejar múltiples suscripciones

  public connectionStatus$ = this.isConnected.asObservable();
  public notifications$ = this.notifications.asObservable();

  constructor() {
    console.log('🎯 WebSocketService CONSTRUCTOR ejecutado');
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    console.log('🎯 initializeWebSocket ejecutado');

    const websocketUrl = `ws://localhost:8080/ws-wellness/websocket`;
    console.log('🔌 Conectando WebSocket nativo a:', websocketUrl);

    this.stompClient = new Client({
      brokerURL: websocketUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('✅ WebSocket conectado exitosamente');
        this.isConnected.next(true);

        // Re-suscribir todas las suscripciones activas después de reconexión
        this.reconnectSubscriptions();
      },

      onDisconnect: () => {
        console.log('❌ WebSocket desconectado');
        this.isConnected.next(false);
      },

      onStompError: (error) => {
        console.error('❌ Error en WebSocket STOMP:', error);
        this.isConnected.next(false);
      }
    });

    console.log('🎯 stompClient creado, activando...');
    this.stompClient.activate();
  }

  /**
   * Suscribirse a alertas de un vehículo específico (versión mejorada)
   */
  subscribeToVehicleAlerts(vehicleId: number): void {
    console.log('🎯 subscribeToVehicleAlerts llamado con vehicleId:', vehicleId);

    // Si ya estamos suscritos a este vehicleId, no hacer nada
    if (this.subscriptions.has(vehicleId)) {
      console.log('ℹ️ Ya suscrito a vehicleId:', vehicleId);
      return;
    }

    if (!this.stompClient) {
      console.error('❌ stompClient no inicializado');
      return;
    }

    const subscription = this.connectionStatus$.subscribe(connected => {
      if (connected) {
        console.log('✅ Conectado, suscribiendo a vehicleId:', vehicleId);
        this.doVehicleSubscription(vehicleId);
        subscription.unsubscribe();
      }
    });

    // Si ya estamos conectados, suscribir inmediatamente
    if (this.isConnected.value) {
      console.log('✅ Ya conectado, suscribiendo inmediatamente');
      this.doVehicleSubscription(vehicleId);
      subscription.unsubscribe();
    }
  }

  private doVehicleSubscription(vehicleId: number): void {
    console.log('🎯 doVehicleSubscription ejecutado para vehicleId:', vehicleId);

    if (!this.stompClient) {
      console.error('❌ stompClient es null');
      return;
    }

    const topic = `/topic/vehicle/${vehicleId}/alerts`;
    console.log('📡 Suscribiendo a topic:', topic);

    try {
      const stompSubscription = this.stompClient.subscribe(topic, (message: IMessage) => {
        console.log('🎯 MENSAJE WEBSOCKET RECIBIDO EN FRONTEND:');
        console.log('📦 Body completo:', message.body);

        try {
          const notification = JSON.parse(message.body);
          console.log('🚗 Nueva alerta parseada:', notification);
          this.handleNotification(notification);
        } catch (parseError) {
          console.error('❌ Error parseando mensaje JSON:', parseError);
          console.log('📄 Contenido del mensaje:', message.body);
        }
      });

      // Guardar la suscripción para posible reconexión
      this.subscriptions.set(vehicleId, stompSubscription);
      console.log(`✅ SUSCRITO EXITOSAMENTE a ${topic}`);

    } catch (error) {
      console.error('❌ Error en suscripción STOMP:', error);
    }
  }

  /**
   * Reconectar suscripciones después de reconexión
   */
  private reconnectSubscriptions(): void {
    console.log('🔄 Reconectando suscripciones...');
    const vehicleIds = Array.from(this.subscriptions.keys());

    this.subscriptions.clear();

    vehicleIds.forEach(vehicleId => {
      console.log('🔄 Re-suscribiendo a vehicleId:', vehicleId);
      this.doVehicleSubscription(vehicleId);
    });
  }

  /**
   * Desuscribirse de alertas de un vehículo
   */
  unsubscribeFromVehicleAlerts(vehicleId: number): void {
    const subscription = this.subscriptions.get(vehicleId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(vehicleId);
      console.log('✅ Desuscrito de vehicleId:', vehicleId);
    }
  }

  /**
   * Manejar notificaciones recibidas
   */
  private handleNotification(notification: Notification): void {
    console.log('🔔 Notificación recibida en handleNotification:', notification);

    // Agregar timestamp si no existe
    if (!notification.createdAt) {
      notification.createdAt = new Date().toISOString();
    }

    const currentNotifications = this.notifications.value;
    this.notifications.next([notification, ...currentNotifications]);

    // Mostrar notificación del navegador
    this.showBrowserNotification(notification);
  }

  /**
   * Mostrar notificación del navegador
   */
  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: `${notification.message} - Vehículo ${notification.vehicleId}`,
          icon: '/assets/icons/alert.png',
          tag: `vehicle-${notification.vehicleId}`
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.showBrowserNotification(notification);
          }
        });
      }
    }
  }

  /**
   * Obtener notificaciones del vehículo actual
   */
  getVehicleNotifications(vehicleId: number): Notification[] {
    return this.notifications.value.filter(notification =>
      notification.vehicleId === vehicleId
    );
  }

  /**
   * Limpiar notificaciones del vehículo
   */
  clearVehicleNotifications(vehicleId: number): void {
    const filteredNotifications = this.notifications.value.filter(
      notification => notification.vehicleId !== vehicleId
    );
    this.notifications.next(filteredNotifications);
  }

  /**
   * Desconectar WebSocket
   */
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.isConnected.next(false);
      this.subscriptions.clear();
      console.log('🔌 WebSocket desconectado');
    }
  }
}

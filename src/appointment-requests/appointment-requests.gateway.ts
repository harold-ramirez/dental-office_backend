import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  namespace: '/', // Socket.IO en la raíz, no bajo /api/vdemo
  cors: {
    origin: "*",
    credentials: false,
  },
})
export class AppointmentRequestsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppointmentRequestsGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(private configService: ConfigService) {}

  handleConnection(client: Socket) {
    console.log('📡 Intento de conexión WebSocket:');
    console.log('  - ID del cliente:', client.id);
    console.log('  - Origen:', client.handshake.headers.origin);
    console.log(
      '  - Auth token:',
      client.handshake.auth.token ? '✓ Presente' : '✗ Falta',
    );
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        this.logger.warn(
          `Socket connection attempt without token: ${client.id}`,
        );
        client.disconnect();
        return;
      }

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        throw new UnauthorizedException('JWT_SECRET not configured');
      }

      const decoded = jwt.verify(token, jwtSecret);
      client.data.user = decoded;

      this.logger.debug(
        `Socket connected: ${client.id} - User: ${decoded.sub}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Authentication failed for socket ${client.id}: ${errorMessage}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Socket disconnected: ${client.id}`);
  }

  notifyAppointmentRequestCreated(patientFullName: string) {
    if (!this.server) {
      return;
    }

    this.server.emit('appointment-request-created', {
      patientFullName,
    });
  }
}

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CreateAppointmentRequestDto } from '../appointment-requests/dto/create-appointment-request.dto';
import { PrismaService } from 'src/prisma.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private prisma: PrismaService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('onNewRequest')
  async handleNewAppointmentRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateAppointmentRequestDto,
  ) {
    const created = await this.prisma.appointmentrequest.create({
      data: data,
    });
    client.broadcast.emit('onNewRequest', data);
    return created;
  }
}

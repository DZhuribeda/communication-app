import { Middleware, MiddlewareInterface } from "socket-controllers";
import Container from "typedi";
import AuthService from "../services/auth";

@Middleware()
export class AuthenticationMiddleware implements MiddlewareInterface {
  async use(socket: any, next: (err?: any) => any) {
    const authHeader = socket.handshake.headers["authorization"];
    const authService = Container.get(AuthService);
    const user = await authService.getCurrentUser(authHeader);
    if (user === null) {
      next(new Error("unauthorized event"));
      return;
    }
    socket.userId = user.id;
    next();
  }
}

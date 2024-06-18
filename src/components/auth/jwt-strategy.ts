
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { User } from "./entities/user.entity";
import { JwtPayload } from "./interface/jwt-payload.interface";
import { UserRepository } from "./repository/user.repository";
import { Logger } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    private logger = new Logger('JwtStrategy');
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: any) {
        /*const { username } = payload
        const user = await this.userRepository.findOneBy({ username: username })
        
        if (!user) {
            throw new UnauthorizedException()
        }
        return user*/
        this.logger.debug('JWT Payload:', payload);
        return { id: payload.sub, username: payload.username };
    }
}
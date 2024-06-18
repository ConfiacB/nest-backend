import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy';
import { User } from './entities/user.entity';

@Global()
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: `${process.env.JWT_SECRET}`,
            signOptions: {
                expiresIn: '7d'
            }
        }),
        TypeOrmModule.forFeature([User])
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UserRepository,
        JwtStrategy
    ],
    exports: [
        JwtStrategy,
        PassportModule
    ]
})
export class AuthModule {}
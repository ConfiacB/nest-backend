import { EntityRepository, Repository, DataSource } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'

import { SignupCredentialsDto } from "../../auth/dto/signup-credentials.dto";
import { SignInCredentialsDto } from "../..//auth/dto/signin-credentials.dto";
import { User } from "../../auth/entities/user.entity";
import { JwtPayload } from "../../auth/interface/jwt-payload.interface";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async signUp(signupCredentialsDto: SignupCredentialsDto): Promise<{message:string}> {
        const { username, password, admin } = signupCredentialsDto

        const user = new User()
        user.username = username
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)
        user.admin = admin
        
        try {
            await user.save()
            return {message: "User succesfully created"};
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async validateUserPassword(signinCredentialDto: SignInCredentialsDto): Promise <any> {
        const { username, password } = signinCredentialDto
        const auth = await this.findOneBy({ username: username })

        if (auth && await auth.validatePassword(password)) {
            return {
                auth
            }
        } else {
            return null
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt)
    }
}
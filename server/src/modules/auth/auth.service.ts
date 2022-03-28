import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

/**
 * Import Entities (models)
 */
import { User } from "@/modules/users/user.entity"

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}
  getUser(username: string): Promise<User> {
    return this.usersRepository.findOne({ username })
  }
  comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword)
  }
  async getAccessTokenWithUserInfo(body: any) {
    const { username, password } = body
    const user = await this.getUser(username)
    if (!user) throw new BadRequestException(["user not found"])

    const isValidPassword = await this.comparePassword(password, user.password)
    //! if the user exists but the provided password is wrong
    if (!isValidPassword) throw new ForbiddenException(["invalid password"])
    const userObj = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    }
    const accessToken = jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET)
    return {
      accessToken,
      user: userObj,
    }
  }
  registerUser(userData): Promise<User> {
    const { name, username, password, email } = userData
    const newUser = this.usersRepository.create({
      name,
      username,
      password,
      email,
      role: "user",
    })
    return this.usersRepository.save(newUser)
  }
}

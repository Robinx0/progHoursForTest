import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

/**
 * Import Entities (models)
 */
import { User } from "@/modules/users/user.entity"
import { Submission } from "@/modules/submissions/submission.entity"

/**
 * Import Controllers
 */
import { UsersController } from "@/modules/users/users.controller"

/**
 * Import Services
 */
import { UsersService } from "@/modules/users/users.service"
import { AuthService } from "../auth/auth.service"

@Module({
  imports: [TypeOrmModule.forFeature([User, Submission])],
  providers: [UsersService, AuthService],
  controllers: [UsersController],
})
export class UsersModule {}

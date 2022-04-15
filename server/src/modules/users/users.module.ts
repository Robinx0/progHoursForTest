import { forwardRef, Module } from "@nestjs/common"
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
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, Submission]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

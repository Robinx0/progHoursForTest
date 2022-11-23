import { Role } from "@prisma/client"
import { IsEmail, IsString, IsNumber, IsOptional, IsPositive, Min, Max, ValidateIf } from "class-validator"

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  username: string

  @IsEmail()
  @IsOptional()
  email: string

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @ValidateIf((obj, val) => {
    return val === 0
  })
  batch: number

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(4)
  @IsOptional()
  cgpa: number

  @IsString()
  @IsOptional()
  department: string

  @IsString()
  @IsOptional()
  mobile: string

  @IsString()
  @IsOptional()
  role: Role

  @IsString()
  @IsOptional()
  section: string
}

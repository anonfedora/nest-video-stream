import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    UploadedFiles,
    Put,
    Req,
    Res
} from "@nestjs/common";
import { User } from "../model/user.schema";
import { UserService } from "../service/user.service";
import { JwtService } from "@nestjs/jwt";

@Controller("/api/v1/user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {}

    @Post("/signup")
    async signup(@Res() res, @Body() user: User) {
        const newUser = await this.userService.signup(user);
        return res.status(HttpStatus.CREATED).json({
            newUser
        });
    }

    @Post("/signin")
    async signin(@Res() res, @Body() user: User) {
        const token = await this.userService.login(user, this.jwtService);
        return res.status(HttpStatus.OK).json(token);
    }
}

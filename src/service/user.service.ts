import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../model/user.schema";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async signup(user: User): Promise<User> {
        const hash = await bcrypt.hash(user.password, 10);

        const reqBody = {
            fullname: user.fullname,
            email: user.email,
            password: hash
        };

        const newUser = new this.userModel(reqBody);
        return newUser.save();
    }

    async login(user: User, jwt: JwtService): Promise<any> {
        const foundUser = await this.userModel
            .findOne({ email: user.email })
            .exec();
        if (foundUser) {
            const { password } = foundUser;
            if (bcrypt.compare(user.password, password)) {
                const payload = { email: user.email };
                return {
                    token: jwt.sign(payload)
                };
            }
            return new HttpException(
                "Incorrect username or password",
                HttpStatus.UNAUTHORIZED
            );
        }
        return new HttpException(
            "Incorrect username or password",
            HttpStatus.UNAUTHORIZED
        );
    }

    async getOne(email): Promise<User> {
        await this.userModel.findOne({ email }).exec();
    }
}

import { Module, RequestMethod, MiddlewareConsumer } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { JwtModule } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { VideoController } from "./controller/video.controller";
import { UserController } from "./controller/user.controller";
import { VideoService } from "./service/video.service";
import { UserService } from "./service/user.service";
import { Video, VideoSchema } from "./model/video.schema";
import { User, UserSchema } from "./model/user.schema";
import { secret } from "./utils/constants";
import { join } from "path/posix";
import { isAuthenticated } from "./app.middleware";
import "dotenv/config";

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI),
        MulterModule.register({
            storage: diskStorage({
                destination: "./public",
                filename: (req, file, cb) => {
                    const ext = file.mimetype.split("/")[1];
                    cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
                }
            })
        }),
        JwtModule.register({
            secret,
            signOptions: { expiresIn: "2h" }
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "public")
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "public")
        })
    ],
    controllers: [AppController, VideoController, UserController],
    providers: [AppService, VideoService, UserService]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(isAuthenticated)
            .exclude({
                path: "api/v1/video/:id",
                method: RequestMethod.GET
            })
            .forRoutes(VideoController);
    }
}

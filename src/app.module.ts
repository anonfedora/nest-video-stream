import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { JwtModule } from "@nestjs/jwt";
import "dotenv/config";

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI),
        JwtModule.register({
            secret,
            signOptions: { expiresIn: "2h" }
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "public")
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}

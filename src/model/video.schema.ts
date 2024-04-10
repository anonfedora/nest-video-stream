import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "./user.schema";

export type VideoDocument = Video & Document;

@Schema()
export class Video {
    @Prop()
    video: string;

    @Prop()
    title: string;

    @Prop()
    coverImage: string;

    @Prop({ default: Date.now() })
    uploadDate: Date;

    @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
    createdBy: User;
}

export const VideoSchema = SchemaFactory.createForClass(Video);

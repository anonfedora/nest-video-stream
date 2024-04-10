import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    UseInterceptors,
    UploadedFiles,
    Put,
    Req,
    Res,
    Query
} from "@nestjs/common";
import { Video } from "../model/video.schema";
import { VideoService } from "../video.service";
import {
    FileFieldsInterceptor,
    FilesInterceptor
} from "@nestjs/platform-express";

@Controller("/api/v1/video")
export class VideoController {
    constructor(private readonly videoService: VideoService) {}

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "video", maxCount: 1 },
            { name: "cover", maxCount: 1 }
        ])
    )
    async createBook(
        @Res() res,
        @Req() req,
        @Body() video: Video,
        @UploadedFiles()
        files: { video?: Express.Multer.File[]; cover?: Express.Multer.File[] }
    ) {
        const requestBody = {
            createdBy: req.user,
            title: video.title,
            video: files.video[0].filename,
            coverImage: files.cover[0].filename
        };
        const newVideo = await this.videoService.createVideo(requestBody);
        return res.status(HttpStatus.CREATED).json({
            newVideo
        });
    }

    @Get()
    async read(@Query() id): Promise<Object> {
        return await this.videoService.readVideo(id);
    }

    @Get("/:id")
    async stream(@Param("id") id, @Res() res, @Req() req) {
        return await this.videoService.streamVideo(id, res, req);
    }

    @Put(":/id")
    async update(@Res() res, @Param("id") id, @Body() video: Video) {
        const updateVideo = await this.videoService.update(id);
        return res.status(HttpStatus.OK).json(updateVideo);
    }

    @Delete(":/id")
    delete(@Res() res, @Param("id") id) {
        await this.videoService.delete(id);
        return res.status(HttpStatus.OK).json({
            user: null
        });
    }
}

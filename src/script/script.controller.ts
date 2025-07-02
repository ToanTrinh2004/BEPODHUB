import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import {  ScriptsService } from './script.service';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';
import { Script } from 'src/schema/script.schema';

@Controller('script')
export class ScriptController {
  constructor(private readonly scriptService: ScriptsService) {}

 
  @Post('import')
  async importScript(
    @Body() body: { podcastId: number; translateAudio?: string }
  ): Promise<Script> {
    const { podcastId, translateAudio } = body;
    
    return this.scriptService.importScriptsFromTxt(podcastId, translateAudio);
  }

  @Get('podcast/:podcastId')
  async getByPodcastId(@Param('podcastId') podcastId: number): Promise<Script | null> {
    return this.scriptService.findByPodcastId(podcastId);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Podcast } from 'src/schema/podcast.schema';

@Controller('podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Post()
  create(@Body() createPodcastDto: CreatePodcastDto) {
    return this.podcastService.create(createPodcastDto);
  }
  @Get('category')
  async getPodcasts(
    @Query('term') term: string = 'pride',
    @Query('limit') limit: number = 5,
  ): Promise<Podcast[]> {
    return this.podcastService.getPodcastsWithEpisodes(term, limit);
  }

  @Get()
  findAll() {
    return this.podcastService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.podcastService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePodcastDto: UpdatePodcastDto) {
    return this.podcastService.update(+id, updatePodcastDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.podcastService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HistoryService } from './history.service';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  /**
   * Updates the user's history.
   * @param uuid - User UUID
   * @param updateHistoryDto - Data Transfer Object containing history updates
   */
  @Post(':uuid')
  async postHistory(
    @Param('uuid') uuid: string,
    @Body() updateHistoryDto: UpdateHistoryDto
  ) {
    return this.historyService.postHistory(uuid, updateHistoryDto);
  }

  /**
   * Fetches the user's history.
   * @param uuid - User UUID
   */
  @Get(':uuid')
  async getHistory(@Param('uuid') uuid: string) {
    return this.historyService.getHistory(uuid);
  }
}

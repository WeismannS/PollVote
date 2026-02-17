import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VoteDto } from './dto/vote.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  create(@Body() createPollDto: CreatePollDto, @Session() session: UserSession) {
    return this.pollsService.create(createPollDto, session.user.id);
  }

  @Get()
  findAll() {
    return this.pollsService.findAll();
  }

  @Post('vote')
  vote(@Body() voteDto: VoteDto, @Session() session: UserSession) {
    return this.pollsService.vote(voteDto, session.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    return this.pollsService.remove(+id, session.user.id);
  }
}

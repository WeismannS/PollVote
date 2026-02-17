import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { VoteDto } from './dto/vote.dto';
import { PollDto, ChoiceDto } from './dto/poll.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Choices, Polls, Votes } from './entities/poll.entity';
import { user } from '../db/auth-schema';
import { eq, and, sql } from 'drizzle-orm';

@Injectable()
export class PollsService {
  constructor(
    @Inject('DB') private db: PostgresJsDatabase
  ) {}

  async create(createPollDto: CreatePollDto, userId: string) {
    return await this.db.transaction(async (tx) => {
      const poll = await tx
        .insert(Polls)
        .values({
          title: createPollDto.title,
          description: createPollDto.description || null,
          user_id: userId,
          anonymous: createPollDto.anonymous,
        })
        .returning()
        .execute();
      const choices: (typeof Choices.$inferInsert)[] =
        createPollDto.choices.map((name) => ({
          name,
          poll_id: poll[0].id,
          vote_count: 0,
        }));
      const [row] = await tx.insert(Choices).values(choices).returning();
      return row
    });
  }

  async findAll(): Promise<PollDto[]> {
    const polls = await this.db.select().from(Polls);
    const choices = await this.db.select().from(Choices);
    const votes = await this.db.select().from(Votes);
    const users = await this.db.select().from(user);

    return polls.map((poll) => {
      const pollCreator = users.find((u) => u.id === poll.user_id);
      const creator = poll.anonymous ? null : pollCreator?.name || null;

      const pollChoices: ChoiceDto[] = choices
        .filter((choice) => choice.poll_id === poll.id)
        .map((choice) => {
          const choiceVotes = votes.filter(
            (v) => v.poll_id === poll.id && v.choice_id === choice.name,
          );
          const voters = choiceVotes
            .filter((v) => !v.anonymous)
            .map((v) => users.find((u) => u.id === v.user_id)?.name || 'Unknown');

          return {
            poll_id: choice.poll_id,
            name: choice.name,
            vote_count: choice.vote_count,
            voters,
          };
        });

      return {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        voters_count: poll.voters_count ?? 0,
        anonymous: poll.anonymous,
        created_at: poll.created_at?.toISOString() || new Date().toISOString(),
        creator,
        user_id: poll.user_id,
        choices: pollChoices,
      };
    });
  }

  async remove(id: number, userId: string) {
    const poll = await this.db.select().from(Polls).where(eq(Polls.id, id));

    if (!poll.length) {
      throw new NotFoundException('Poll not found');
    }
    if (poll[0].user_id !== userId) {
      throw new ForbiddenException('You can only delete your own polls');
    }
    await this.db.delete(Polls).where(eq(Polls.id, id));
    return { success: true };
  }

  async vote(voteDto: VoteDto, userId: string) {
    const { pollId, name } = voteDto;

    await this.db.transaction(async (tx) => {
      const existingVote = await tx
        .select()
        .from(Votes)
        .where(
          and(
            eq(Votes.poll_id, pollId),
            eq(Votes.user_id, userId),
          ),
        );
      if (existingVote.length > 0 && existingVote[0]) {
        await tx
        .delete(Votes)
        .where(
          and(
            eq(Votes.poll_id, pollId),
            eq(Votes.user_id, userId),
          ),
        );
        await tx.update(Choices).set({
          vote_count : sql`${Choices.vote_count} - 1`
        }).where(eq(Choices.name, existingVote[0].choice_id)).execute();
      }
      await tx.insert(Votes).values({
        poll_id: pollId,
        choice_id: name,
        user_id: userId,
        anonymous: voteDto.anonymous,
      });

      await tx
        .update(Choices)
        .set({ vote_count: sql`${Choices.vote_count} + 1` })
        .where(and(eq(Choices.poll_id, pollId), eq(Choices.name, name)));
      
      if (!existingVote[0])
        await tx
          .update(Polls)
          .set({ voters_count: sql`${Polls.voters_count} + 1` })
          .where(eq(Polls.id, pollId));
      });

    return { success: true };
  }
}

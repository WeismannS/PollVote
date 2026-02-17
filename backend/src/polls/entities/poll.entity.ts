import { integer } from 'drizzle-orm/pg-core';
import {sql} from 'drizzle-orm';
import { timestamp } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { check } from 'drizzle-orm/pg-core';
import { varchar } from 'drizzle-orm/pg-core';
import { serial, primaryKey, text } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { user } from '../../db/auth-schema';

export const Polls = pgTable('polls', {
  id: serial().primaryKey(),
  user_id: text()
    .references(() => user.id)
    .notNull(),
  created_at: timestamp({ withTimezone: true, precision: 6 }).defaultNow(),
  title: varchar().notNull(),
  description: varchar(),
  voters_count: integer().default(0),
  anonymous: boolean().default(false).notNull(),
}, (t)=>[check("voters_check", sql`${t.voters_count} >= 0`)]);

export const Choices = pgTable(
  'choices',
  {
    poll_id: integer().references(() => Polls.id, {onDelete : "cascade"}).notNull(),
    name: varchar().notNull(),
    vote_count: integer().default(0).notNull(),
  },
  (t) => [
    primaryKey({
      columns: [t.poll_id, t.name],
    }), 
    check("voters_check", sql`${t.vote_count} >= 0`)]
    
  ,
);

export const Votes = pgTable(
  'votes',
  {
    poll_id: integer().references(() => Polls.id,{onDelete : "cascade"}).notNull(),
    choice_id: text().notNull(),
    user_id: text().references(() => user.id).notNull(),
    anonymous: boolean().default(false).notNull(),
  },
  (t) => [
    primaryKey({
      columns: [t.user_id, t.poll_id,t.choice_id
      ],
    }),
  ],
);

export type Poll = typeof Polls.$inferSelect;
export type Choice = typeof Choices.$inferSelect;
export type Vote = typeof Votes.$inferSelect;

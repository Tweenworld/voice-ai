#!/usr/bin/env -S bun
import type { Contract as End } from '../../snapshots/1de8574c9bdffa1c8114f1e5dea93bf3b4b88b08b849b081c746b2e123f2b9ca/contract';
import endContract from '../../snapshots/1de8574c9bdffa1c8114f1e5dea93bf3b4b88b08b849b081c746b2e123f2b9ca/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'generation',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orgId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('r2ObjectKey', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('repetitionPenalty', 'float8', {
            notNull: true,
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('temperature', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('text', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('topK', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('topP', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('voiceId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('voiceName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'post',
        columns: [
          col('authorId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('content', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('username', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'voice',
        columns: [
          col('category', 'text', {
            notNull: true,
            default: lit('GENERAL'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('language', 'text', {
            notNull: true,
            default: lit('en-US'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('orgId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('r2ObjectKey', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('variant', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'voice_category_check_4b32346a',
            "\"category\" IN ('AUDIOBOOK', 'CONVERSATIONAL', 'CUSTOMER_SERVICE', 'GENERAL', 'NARRATIVE', 'CHARACTERS', 'MEDITATION', 'MOTIVATIONAL', 'PODCAST', 'ADVERTISING', 'VOICEOVER', 'CORPORATE')",
          ),
          checkExpression('voice_variant_check_3cc27d96', "\"variant\" IN ('SYSTEM', 'CUSTOM')"),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'generation',
        index: 'generation_orgId_idx_c5e5aabe',
        columns: ['orgId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'generation',
        index: 'generation_voiceId_idx_9486803e',
        columns: ['voiceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'post',
        index: 'post_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'voice',
        index: 'voice_orgId_idx_c5e5aabe',
        columns: ['orgId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'voice',
        index: 'voice_variant_idx_132d5bea',
        columns: ['variant'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'generation',
        foreignKey: {
          name: 'generation_voiceId_fkey',
          columns: ['voiceId'],
          references: { schema: 'public', table: 'voice', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'post',
        foreignKey: {
          name: 'post_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);

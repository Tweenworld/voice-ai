import { z } from "zod";
import { or } from "@prisma/orm-postgres/orm-client";
import { prisma } from "@/lib/db";
import { createTRPCRouter, orgProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { deleteAudio } from "@/lib/r2";


export const voicesRouter = createTRPCRouter({
    getAll: orgProcedure
        .input(
            z
                .object({
                    query: z.string().trim().optional(),
                })
                .optional(),
        )
        .query(async ({ ctx, input }) => {
            const searchTerm = input?.query;

            const [custom, system] = await Promise.all([
                (() => {
                    const voices = prisma.orm.public.Voice.where({
                        variant: "CUSTOM",
                        orgId: ctx.orgId,
                    });
                    const filteredVoices = searchTerm
                        ? voices.where((voice) =>
                            or(
                                voice.name.ilike(`%${searchTerm}%`),
                                voice.description.ilike(`%${searchTerm}%`),
                            ),
                        )
                        : voices;

                    return filteredVoices
                        .select("id", "name", "description", "category", "language", "variant")
                        .orderBy((voice) => voice.createdAt.desc())
                        .all();
                })(),
                (() => {
                    const voices = prisma.orm.public.Voice.where({ variant: "SYSTEM" });
                    const filteredVoices = searchTerm
                        ? voices.where((voice) =>
                            or(
                                voice.name.ilike(`%${searchTerm}%`),
                                voice.description.ilike(`%${searchTerm}%`),
                            ),
                        )
                        : voices;

                    return filteredVoices
                        .select("id", "name", "description", "category", "language", "variant")
                        .orderBy((voice) => voice.name.asc())
                        .all();
                })(),
            ]);

            return { custom, system };
        }),

        delete: orgProcedure
            .input(z.object({ id: z.string() }))
            .mutation(async ({ ctx, input }) => {
                const voice = await prisma.orm.public.Voice
                    .where({
                        id: input.id,
                        variant: "CUSTOM",
                        orgId: ctx.orgId,
                    })
                    .select("id", "r2ObjectKey")
                    .first();

                if (!voice) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Voice not found",
                    });
                }

                await prisma.orm.public.Voice
                    .where({
                        id: voice.id,
                        variant: "CUSTOM",
                        orgId: ctx.orgId,
                    })
                    .delete();

                if (voice.r2ObjectKey) {
                    // In production consider background jobs, retries, cron jobs etc
                    await deleteAudio(voice.r2ObjectKey).catch(() => {});
                }

                return { success: true };
            }),
});
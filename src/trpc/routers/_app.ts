import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
 
export const appRouter = createTRPCRouter({
  health: baseProcedure.query(async () => {

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // throw new Error("Something went wrong!")

    return { status: "ok", code: 123, };
  }),
});
 
// export type definition of API
export type AppRouter = typeof appRouter;
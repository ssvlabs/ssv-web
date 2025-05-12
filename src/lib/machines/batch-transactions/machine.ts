/* eslint-disable @typescript-eslint/no-unused-expressions */
import { toast } from "@/components/ui/use-toast";
import { queryClient } from "@/lib/react-query";
import { getErrorMessage } from "@/lib/utils/wagmi";
import { config } from "@/wagmi/config";
import { getPublicClient } from "@wagmi/core";
import type { ReactNode } from "react";
import type { Hash, TransactionReceipt } from "viem";
import { setup, fromPromise, assign } from "xstate";

type Writer = {
  name: string;
  write: () => Promise<Hash>;
};
type WriterInput = { input: { index: number; writer: Writer } };
type WaiterInput = { input: { hash: Hash } };

const writerActor = fromPromise(async ({ input }: WriterInput) => {
  return await input.writer.write();
});

const waiterActor = fromPromise(async ({ input }: WaiterInput) => {
  const client = getPublicClient(config);
  if (!client) {
    throw new Error("Client not found");
  }

  const mutationCache = queryClient.getMutationCache();
  const mutation = mutationCache.build(queryClient, {
    mutationKey: ["waitForTransactionReceipt"],
    mutationFn: () => client.waitForTransactionReceipt({ hash: input.hash }),
  });
  return await mutation.execute({});
});

export const machine = setup({
  types: {
    context: {} as {
      writers: Writer[];
      i: number;
      output: { hash: Hash; receipt?: TransactionReceipt }[];
      header: ReactNode;
    },
    events: {} as
      | { type: "retry" | "restart" }
      | { type: "write"; writers: Writer[]; header: ReactNode }
      | { type: "done.invoke.writer"; output: Hash }
      | { type: "done.invoke.waiter"; output: TransactionReceipt }
      | { type: "error.invoke.writer"; error: Error }
      | { type: "error.invoke.waiter"; error: Error }
      | { type: "cancel" },
  },
  actions: {
    onDone: () => {},
    onTaskFailed: ({ event }) => {
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description:
          "error" in event
            ? getErrorMessage(event.error)
            : "Something went wrong",
      });
    },
    increment: assign({
      i: ({ context }) => context.i + 1,
    }),
    addHash: assign({
      output: ({ context, event }) => {
        if ("output" in event) {
          return [...context.output, { hash: event.output as Hash }];
        }

        return context.output;
      },
    }),
    reset: assign({
      i: 0,
    }),
  },
  actors: {
    writer: writerActor,
    waiter: waiterActor,
  },
  guards: {
    isFinished: ({ context }) => context.i === context.writers.length - 1,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCECGAXAxgCwCoCdUA7WVTdASwHsiBZM7CosAOgogBswBiAd3wrowAbQAMAXUSgADlViDqRKSAAeiAMwBGAEwttANgAs+-etGGA7OYMAaEAE9Em-bsOXjADm0WAnDqOGAL6BdmhYeIQkZJQ09DhMrPyCPBA0rEwAblQA1qxhOATEpOSKcYzMLElCCJlUmBiKYuJNyrLyMUpIqogWWiwArG6aPv39vqLak3aOCOr6Fizzvv2TPtqaWtpBISD5EUXRpQwJlQJC3GD4+FT4LNIcGABmNwC2LHuFUSWxxxVVYDUiFl6h0mi0um0FDRlGpZqJNCwLP19B51B5DJphhN9NMNKJ1HpRKjNETfFYNsFQhgCpFih0yideKhBNxUhVarl3tT9l96b9Esz0IDgQ0aGCJK05FDOqBYSSfD5Ef1NBZNMqfHMiepcbMfKIWOoFWZjNpREjMZTdtzPnSjvE-oLWWk2ECcnlrbTDj97QLBMK6qKiGDNJIIVKOjCeoYCRYTG51QrBj4dabDCwPPoNcrvH5fIZ+paPp7vnR+SxHkwKLBsJBuCpYOgMKxUI8hPgABQk0SiACU3CLBxLDIqFaIVZrEHBMnDikjCExmZYhh8Fg8E2R-Q8wwsOosrnUhgmok3+Mza0LHsHfJ95eZXAg3HwYHQ+HsU5AkIjXVhyIJ+ZVxj9Oovioh4OpuLo6jaOiPgeMqB5EvoBY7AOvJ2uUrCPHetb1EQmBgBw76frO36INocyIgYowalu2gjBm4GGJB0HLnBGyHhmyE7EQVAQHAyioba3oYZK7QkbKTgeB4lFIf0NE6PROIOIgAC0mhplJUk+Jm+gbAYwwXuENpeqWN7sFwonSnO3j6t2FixlYFjLvMoy7tJHgjIa6hAaqHhOchVJGcW14YacySWV+EkICs+gsOYPiHiYCX2UpMympB0Z0XRQHqMB6iGTSV7oYygoReJ3QIHqf7kRxJKmHGOpzP0LBqpofluBi8xwQVPJCaZoWjuOkBldCpHzm1tmYjRky5cM2g6iquj9KISFmua6zoj1xlDmWWEUPeI0yhVGILOseprExHljOpjEIrBCp6mMmbaMi+jBMEQA */
  context: {
    i: 0,
    writers: [],
    header: null,
    output: [],
  },
  id: "BatchTransactionMachine",
  initial: "idle",
  states: {
    idle: {
      on: {
        write: {
          target: "write",
          guard: ({ event }) => {
            console.assert(
              event.writers.length > 0,
              "You've tried to write with no writers",
            );
            return event.writers.length > 0;
          },
          actions: [
            assign({
              writers: ({ event }) => event.writers,
              header: ({ event }) => event.header,
              output: [],
              i: 0,
            }),
          ],
        },
      },
    },
    write: {
      invoke: {
        input: ({ context }) => {
          return {
            index: context.i,
            writer: context.writers[context.i],
          };
        },
        src: "writer",
        onDone: {
          target: "wait",
          actions: "addHash",
        },
        onError: {
          target: "failed",
          actions: "onTaskFailed",
        },
      },
    },
    wait: {
      invoke: {
        input: ({ event }) => {
          if ("output" in event) {
            return { hash: event.output as Hash };
          }
          throw new Error("Invalid event type for waiter input");
        },
        src: "waiter",
        onDone: [
          {
            target: "finished",
            guard: "isFinished",
          },
          {
            target: "write",
            reenter: true,
            actions: ["increment"],
          },
        ],
      },
    },
    finished: {
      actions: "onDone",
      after: {
        1000: {
          target: "idle",
        },
      },
    },
    failed: {
      on: {
        retry: "write",
        cancel: "idle",
      },
    },
  },
});

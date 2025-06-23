import { queryClient } from "@/lib/react-query";
import type { DecodedReceipt } from "@/lib/utils/viem";
import { config } from "@/wagmi/config";
import { getPublicClient } from "@wagmi/core";
import type { ReactNode } from "react";
import type { Hash } from "viem";
import { setup, fromPromise, assign } from "xstate";
import { addDecodedEventsToReceipt } from "@/lib/utils/viem";
import { set } from "lodash-es";
import type {
  AllEvents,
  MutationOptions,
} from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { toast } from "@/components/ui/use-toast";
import { getErrorMessage } from "@/lib/utils/wagmi";
import { Span } from "@/components/ui/text";

type Writer = {
  name: string;
  write: () => Promise<Hash>;
} & MutationOptions<AllEvents>;

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
    mutationFn: () =>
      client
        .waitForTransactionReceipt({ hash: input.hash })
        .then(addDecodedEventsToReceipt),
  });
  return await mutation.execute({});
});

export const machine = setup({
  types: {
    context: {} as {
      writers: Writer[];
      i: number;
      output: { hash: Hash; receipt?: DecodedReceipt }[];
      header: ReactNode;
      onDone?: () => void;
    },
    events: {} as
      | { type: "retry" | "restart" }
      | {
          type: "write";
          writers: Writer[];
          header: ReactNode;
          onDone?: () => void;
        }
      | { type: "error.invoke.writer"; error: Error }
      | { type: "error.invoke.waiter"; error: Error }
      | { type: "cancel" },
  },
  actions: {
    onDone: () => {},
    increment: assign({
      i: ({ context }) => context.i + 1,
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
  /** @xstate-layout N4IgpgJg5mDOIC5QCECGAXAxgCwCoCdUA7WVTdASwHsiBZM7CosAOgogBswBiAd3wrowAbQAMAXUSgADlViDqRKSAAeiAMwBGAEwttANgAs+-etGGA7OYMAaEAE9Em-bsOXjADm0WAnDqOGAL6BdmhYeIQkZJQ09DhMrPyCPBA0rEwAblQA1qxhOATEpOSKcYzMLElCCJlUmBiKYuJNyrLyMUpIqogWWiwArG6aPv39vqLak3aOCOr6Fizzvv2TPtqaWtpBISD5EUXRpQwJlQJC3GD4+FT4LNIcGABmNwC2LHuFUSWxxxVVYDUiFl6h0mi0um0FDRlGpZqJNCwLP19B51B5DJphhN9NMNKJ1HpRKjNETfFYNsFQhgCpFih0yideKhBNxUhVarl3tT9l96b9Esz0IDgQ0aGCJK05FDOqBYSSfD5Ef1NBZNMqfHMiepcbMfKIWOoFWZjNpREjMZTdtzPnSjvE-oLWWk2ECcnlrbTDj97QLBMK6qKiGDNJIIVKOjCeoYCRYTG51QrBj4dabDCwPPoNcrvH5fIZ+paPp7vnR+ZVHWz0q7OUWDiWGQ6-bUQY0JMJtKGZOHFJGEJiUen+qIh84dJN+h4dSsCYaNeYXGblZpCx663yfSxHkwKLBsJBuCpYOgMKxUI8hPgABQk0SiACU3FrvLt5VYW6IO73EHBXfaPa6crOIqhg+BYHgTMiE7DBYOoWK46iGBMw7gXMCraCu4Q2l6pYbo8zJcBA3D4GA6D4PYP4gJCEYAYgyIEvmKrGP06i+Kik4OIgbi6Oo2joj4HjKghRL6AWOxPra3qvpu+H7vURCYGAHAUVR-6yog2hzIiBijBqHg6CMGY6lxBq8SBAkbIhGaiTsRBUBAcDKOJ2ENmAkp-tCNF9h4HhaSJ-S6fpE44hxCAALSaGmvQGIYGlInqFhweoGE0muL4nOwXBudKvbePqt4JfMZogfMoywT5HgjIa6jMaqHgWPmyU8hJOFSf8WXUWpCArPoLDmD4iEmP1BUphMBrRtoayVeoLFJWJq7PpJjKCu1qndAger0RplkkqYcY6nM-QsGqmh1W4GLzAJjVYfWZbvp+kArR5nWYuBvWYrpkzTcM2g6iquhDiJZrmus6JXcW65SXhFAEY9MprRiCzrHqawxRVYwRUZGIsPxCp6mMmbaMi+jBMEQA */
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
            assign(({ event }) => ({
              writers: event.writers,
              header: event.header,
              onDone: event.onDone,
              output: [],
              i: 0,
            })),
            ({ context }) => {
              context.writers[context.i].onInitiated?.();
            },
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
          actions: [
            assign({
              output: ({ context, event }) => [
                ...context.output,
                { hash: event.output },
              ],
            }),
            ({ context, event }) => {
              context.writers[context.i].onConfirmed?.(event.output);
            },
          ],
        },
        onError: {
          target: "failed",
        },
      },
    },
    wait: {
      invoke: {
        input: ({ event }) => {
          if (!("output" in event)) {
            throw new Error("Invalid event type for waiter input");
          }
          return { hash: event.output as Hash };
        },
        src: "waiter",
        onDone: [
          {
            target: "finished",
            guard: "isFinished",
            actions: [
              assign({
                output: ({ context, event }) => {
                  return set(
                    context.output,
                    `[${context.i}].receipt`,
                    event.output,
                  );
                },
              }),
              ({ context, event }) => {
                context.writers[context.i].onMined?.(event.output);
              },
            ],
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
          actions: ({ context }) => {
            context.onDone?.();
          },
        },
      },
    },
    failed: {
      on: {
        retry: "write",
        cancel: "idle",
      },
      entry: [
        ({ event }) => {
          "error" in event &&
            toast({
              title: "Transaction failed",
              description: (
                <Span className="whitespace-pre-wrap">
                  {getErrorMessage(event.error)}
                </Span>
              ),
              variant: "destructive",
            });
        },
      ],
    },
  },
});

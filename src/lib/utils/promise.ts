import { ms } from "@/lib/utils/number";

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const retryPromiseUntilSuccess = async (
  promise: () => Promise<boolean | null | undefined>,
  { delay = ms(1, "seconds"), timeout = ms(1, "minutes") } = {},
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
    const retry = async () => {
      try {
        if (await promise()) {
          resolve();
        } else {
          wait(delay).then(retry);
        }
      } catch (error) {
        console.error("Error in promise:", error);
        wait(delay).then(retry);
      }
    };

    retry();
  });
};

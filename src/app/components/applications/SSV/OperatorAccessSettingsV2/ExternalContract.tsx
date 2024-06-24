import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FaCircleInfo } from 'react-icons/fa6';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { isAddress } from 'viem';
import { z } from 'zod';
import config from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import { Alert, AlertDescription } from '~app/components/ui/alert';
import { Button } from '~app/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~app/components/ui/form';
import { Input } from '~app/components/ui/input';
import { Tooltip } from '~app/components/ui/tooltip';
import { useSetOperatorsWhitelistingContract } from '~app/hooks/operator/useSetOperatorsWhitelistingContract';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';
import { isWhitelistingContract as _isWhitelistingContract } from '~root/services/operatorContract.service';

type FormValues = {
  externalContract: string;
};

const ExternalContract = () => {
  const operator = useAppSelector(getSelectedOperator)!;
  const whitelistingContractAddress = operator.whitelisting_contract !== config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST ? operator.whitelisting_contract : '';

  const setExternalContract = useSetOperatorsWhitelistingContract();
  const isWhitelistingContract = useMutation({
    mutationFn: _isWhitelistingContract
  });

  const schema = useMemo(
    () =>
      z.object({
        externalContract: z
          .custom<string>((address) => {
            if (!address) return true;
            return isAddress(address);
          }, 'Contract address must be a in a valid address format')
          .refine((address) => {
            if (!address) return true;
            return isWhitelistingContract.mutateAsync(address);
          }, 'Contract is not a compatible whitelisting contract')
      }) satisfies z.ZodType<FormValues>,
    [isWhitelistingContract]
  );

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      externalContract: whitelistingContractAddress
    },
    resolver: zodResolver(schema, { async: true }, { mode: 'async' })
  });

  const isChanged = form.watch('externalContract') !== whitelistingContractAddress;
  const hasErrors = Boolean(form.formState.errors.externalContract);

  const reset = () => {
    form.reset({
      externalContract: whitelistingContractAddress
    });
  };

  const submit = form.handleSubmit((values) => {
    if (!isChanged) return;
    setExternalContract.mutate(
      {
        type: values.externalContract ? 'set' : 'remove',
        operatorIds: [operator.id],
        contractAddress: values.externalContract
      },
      {
        onSuccess: () => {
          form.reset({ externalContract: values.externalContract });
        }
      }
    );
  });

  return (
    <BorderScreen
      blackHeader
      width={872}
      body={[
        <Form {...form}>
          <form className="flex flex-col gap-8 w-full" onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span>External Contract</span>
                <Tooltip
                  asChild
                  content={
                    <div>
                      Learn how to set an{' '}
                      <a
                        href="https://docs.ssv.network/operator-user-guides/operator-management/configuring-a-permissioned-operator/external-whitelist-contracts"
                        className="link text-primary-500"
                        target="_blank"
                      >
                        External Contract
                      </a>
                    </div>
                  }
                >
                  <div>
                    <FaCircleInfo className="size-4 text-gray-500" />
                  </div>
                </Tooltip>
              </h1>
              <p>
                Delegate the management of whitelisted addresses to an external contract.
                <br />
                Whitelisted addresses are effective only when your operator status is set to Private.
              </p>
            </div>
            <Alert variant="warning">
              <AlertDescription>
                If you have configured an external contract for managing whitelists, both the whitelisted addresses and the external contract will apply simultaneously.
              </AlertDescription>
            </Alert>
            <FormField
              control={form.control}
              name="externalContract"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="0xCONT...RACT"
                      rightSlot={
                        field.value && (
                          <Button variant="ghost" size="icon" onClick={() => field.onChange('')}>
                            <X className="size-5" />
                          </Button>
                        )
                      }
                      leftSlot={
                        isWhitelistingContract.isPending ? (
                          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                        ) : (
                          <IoDocumentTextOutline className="w-6 h-6 text-gray-600" />
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
            {isChanged && (
              <div className="flex gap-3">
                <Button type="button" disabled={setExternalContract.isPending} size="xl" variant="secondary" className="w-full" onClick={reset}>
                  Cancel
                </Button>
                <Button type="submit" disabled={hasErrors} isLoading={setExternalContract.isPending} isActionBtn size="xl" className="w-full">
                  Save
                </Button>
              </div>
            )}
          </form>
        </Form>
      ]}
    />
  );
};

export default ExternalContract;

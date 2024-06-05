import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { isAddress } from 'viem';
import { z } from 'zod';
import BorderScreen from '~app/components/common/BorderScreen';
import { Button } from '~app/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~app/components/ui/form';
import { Input } from '~app/components/ui/input';
import { useSetOperatorsWhitelistingContract } from '~app/hooks/operator/useSetOperatorsWhitelistingContract';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';
import { isWhitelistingContract as _isWhitelistingContract } from '~root/services/operatorContract.service';

type FormValues = {
  externalContract: string;
};

const ExternalContract = () => {
  const navigate = useNavigate();

  const operator = useAppSelector(getSelectedOperator);
  const setExternalContract = useSetOperatorsWhitelistingContract();

  const isWhitelistingContract = useMutation({
    mutationFn: _isWhitelistingContract
  });

  const schema = useMemo(
    () =>
      z.object({
        externalContract: z
          .custom<string>(isAddress, 'Contract address must be a in a valid address format')
          .refine(isWhitelistingContract.mutateAsync, 'Address is not a valid whitelisting contract')
      }) satisfies z.ZodType<FormValues>,
    [isWhitelistingContract.mutateAsync]
  );

  const form = useForm<FormValues>({
    defaultValues: {
      externalContract: ''
    },
    resolver: zodResolver(schema, { async: true }, { mode: 'async' })
  });

  const hasErrors = Boolean(form.formState.errors.externalContract);

  const submit = form.handleSubmit((values) => {
    setExternalContract.mutate({
      type: 'set',
      operatorIds: [operator.id],
      contractAddress: values.externalContract
    });
  });

  return (
    <BorderScreen
      blackHeader
      width={872}
      body={[
        <Form {...form}>
          <form className="flex flex-col gap-8 w-full" onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">External Contract</h1>
              <p>
                Manage whitelisted addresses through an external contract. Learn how to set an{' '}
                <a href="https://docs.ssv.network/learn/operators/permissioned-operators" className="text-primary-500" target="_blank">
                  External Contract
                </a>
                .
              </p>
            </div>
            <FormField
              control={form.control}
              name="externalContract"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="0xCONT...RACT"
                      leftSlot={isWhitelistingContract.isPending ? <Loader2 className="w-6 h-6 text-primary-500" /> : <IoDocumentTextOutline className="w-6 h-6 text-gray-600" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
            <div className="flex gap-3">
              <Button type="button" disabled={setExternalContract.isPending} size="xl" variant="secondary" className="w-full" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={hasErrors} isLoading={setExternalContract.isPending} isActionBtn size="xl" className="w-full">
                Save
              </Button>
            </div>
          </form>
        </Form>
      ]}
    />
  );
};

export default ExternalContract;

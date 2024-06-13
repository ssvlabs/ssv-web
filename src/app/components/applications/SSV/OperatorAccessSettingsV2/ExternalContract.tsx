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
import { Alert, AlertDescription } from '~app/components/ui/alert';
import { Button } from '~app/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~app/components/ui/form';
import { Input } from '~app/components/ui/input';
import { useSetOperatorsWhitelistingContract } from '~app/hooks/operator/useSetOperatorsWhitelistingContract';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';
import { isWhitelistingContract as _isWhitelistingContract } from '~root/services/operatorContract.service';
import config from '~app/common/config';

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
          .refine(isWhitelistingContract.mutateAsync, 'Contract is not a compatible whitelisting contract')
      }) satisfies z.ZodType<FormValues>,
    [isWhitelistingContract.mutateAsync]
  );

  const form = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      externalContract: operator.whitelisting_contract
    },
    resolver: zodResolver(schema, { async: true }, { mode: 'async' })
  });

  const address = form.watch('externalContract');
  const isChanged = address !== operator.whitelisting_contract;

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
                <a href={config.links.PERMISSIONED_OPERATORS} className="text-primary-500" target="_blank">
                  External Contract
                </a>
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
                      leftSlot={isWhitelistingContract.isPending ? <Loader2 className="w-6 h-6 text-primary-500" /> : <IoDocumentTextOutline className="w-6 h-6 text-gray-600" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
            {isChanged && (
              <div className="flex gap-3">
                <Button type="button" disabled={setExternalContract.isPending} size="xl" variant="secondary" className="w-full" onClick={() => navigate(-1)}>
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

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { z } from 'zod';
import BorderScreen from '~app/components/common/BorderScreen';
import { Button } from '~app/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~app/components/ui/form';
import { Input } from '~app/components/ui/input';

type FormValues = {
  externalContract: string;
};

const schema = z.object({
  externalContract: z.string().refine(isAddress, 'Contract address must be a in a valid address format')
}) satisfies z.ZodType<FormValues>;

const ExternalContract = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      externalContract: ''
    },
    resolver: zodResolver(schema)
  });

  const submit = form.handleSubmit((values) => {
    console.log(values);
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
              <p>Manage whitelisted addresses through an external contract. Learn how to set an External Contract.</p>
            </div>

            <FormField
              control={form.control}
              name="externalContract"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size="lg" className="w-full h-[60px]">
              Switch to Private
            </Button>
          </form>
        </Form>
      ]}
    />
  );
};

export default ExternalContract;

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext.tsx";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const LoginForm = () => {
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await auth.signIn(values.email, values.password);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={auth.isLoadingLogin} type="submit">
            {auth.isLoadingLogin && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Log in
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;

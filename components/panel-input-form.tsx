import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PanelFormSchema = z.object({
  stc: z.string().min(2, {
    message: "Latitude must be at least 1 character.",
  }),
  ptc: z.string().min(2, {
    message: "Longitude must be at least 1 character.",
  }),
  v_mp: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
});

export function PanelForm() {
  const form = useForm<z.infer<typeof PanelFormSchema>>({
    resolver: zodResolver(PanelFormSchema),
  });

  async function onSubmit(values: z.infer<typeof PanelFormSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="stc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>STC</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ptc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PTC</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="v_mp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>V_MP</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Change Parameters
        </Button>
      </form>
    </Form>
  );
}

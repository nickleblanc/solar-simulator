"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LocationFormSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getRoofArea } from "@/actions/google-solar";
import { useLocationStore } from "@/stores/data";

export function InputForm() {
  const addLocation = useLocationStore((state) => state.addLocation);

  const form = useForm<z.infer<typeof LocationFormSchema>>({
    resolver: zodResolver(LocationFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LocationFormSchema>) {
    console.log(values);
    const data = await getRoofArea(values.latitude, values.longitude);
    addLocation(values.name, values.latitude, values.longitude, data, true);
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input
                  {...form.register("latitude", {
                    setValueAs: (v) => (v === "" ? undefined : v),
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input
                  {...form.register("longitude", {
                    setValueAs: (v) => (v === "" ? undefined : v),
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add
        </Button>
      </form>
    </Form>
  );
}

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
import { getRoofArea, getRoofSegments } from "@/actions/google-solar";
import { useLocationStore } from "@/stores/data";
import { useFormValueStore } from "@/stores/form-values";
import { useEffect } from "react";

export function InputForm() {
  const addLocation = useLocationStore((state) => state.addLocation);
  const test = useFormValueStore((state) => state);

  const form = useForm<z.infer<typeof LocationFormSchema>>({
    resolver: zodResolver(LocationFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (test.lat === null || test.lng === null) return;
    form.setValue("latitude", test.lat);
    form.setValue("longitude", test.lng);
  }, [form, test]);

  async function onSubmit(values: z.infer<typeof LocationFormSchema>) {
    const data = await getRoofArea(values.latitude, values.longitude);
    const segments = await getRoofSegments(values.latitude, values.longitude);
    console.log(segments);
    addLocation(values.name, values.latitude, values.longitude, data, true);
    form.reset();
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

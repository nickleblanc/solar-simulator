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
import { useLocationStore } from "@/stores/locations";
import { useFormValueStore } from "@/stores/form-values";
import { useEffect } from "react";
import { calculateNumberOfPanels } from "@/lib/panel";

export function InputForm() {
  const addLocation = useLocationStore((state) => state.addLocation);
  const formValues = useFormValueStore((state) => state);
  const setFormValues = useFormValueStore((state) => state.setValues);

  const form = useForm<z.infer<typeof LocationFormSchema>>({
    resolver: zodResolver(LocationFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (formValues.lat === null || formValues.lng === null) return;
    form.setValue("latitude", formValues.lat);
    form.setValue("longitude", formValues.lng);
  }, [form, formValues]);

  async function onSubmit(values: z.infer<typeof LocationFormSchema>) {
    const data = await getRoofArea(values.latitude, values.longitude);
    const segments = await getRoofSegments(values.latitude, values.longitude);
    console.log(segments);
    const numberPanels = calculateNumberOfPanels(segments);
    addLocation(
      values.name,
      values.latitude,
      values.longitude,
      data,
      numberPanels,
      true,
      segments
    );
    form.reset();
    setFormValues(null, null);
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

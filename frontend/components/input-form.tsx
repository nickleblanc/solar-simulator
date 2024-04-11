"use client";

import { useState } from "react";
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
import { getRoofSegments } from "@/actions/google-solar";
import { useLocationStore } from "@/stores/locations";
import { useFormValueStore } from "@/stores/form-values";
import { useParameterStore } from "@/stores/parameters";
import { useEffect } from "react";
import { calculateNumberOfPanels } from "@/lib/panel";
import { FormError } from "@/components/form-error";

export function InputForm() {
  const [error, setError] = useState<string | undefined>("");

  const addLocation = useLocationStore((state) => state.addLocation);
  const formValues = useFormValueStore((state) => state);
  const setFormValues = useFormValueStore((state) => state.setValues);
  const panelParameters = useParameterStore((state) => state);

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
    setError("");
    const { roofSegments, roofArea, error } = await getRoofSegments(
      values.latitude,
      values.longitude
    );
    if (error) {
      setError(error);
      return;
    }
    const numberPanels = calculateNumberOfPanels(
      roofSegments,
      panelParameters.length,
      panelParameters.width
    );
    addLocation(
      values.name,
      values.latitude,
      values.longitude,
      roofArea,
      numberPanels,
      true,
      roofSegments
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
        <FormError message={error} />
        <Button type="submit" className="w-full">
          Add Location
        </Button>
      </form>
    </Form>
  );
}

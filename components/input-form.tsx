"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/schemas";
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
import { useAreaStore, useLocationStore } from "@/stores/data";

type InputFormProps = {};

export function InputForm() {
  // const [latitude, setLatitude] = useState("45.950840");
  // const [longitude, setLongitude] = useState("-66.642444");

  // const query = useQuery({
  //   queryKey: ["area", latitude, longitude],
  //   queryFn: () => getRoofArea(latitude, longitude),
  // });

  const setArea = useAreaStore((state) => state.setArea);

  const locations = useLocationStore((state) => state.locations);
  const setLocations = useLocationStore((state) => state.setLocations);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latitude: "",
      longitude: "",
    },
  });

  const { control } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await getRoofArea(values.latitude, values.longitude);
    // setLocations([...locations, `${values.latitude}, ${values.longitude}`]);
    setArea(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
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
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onClick={() => append({})} className="w-full">
          Add
        </Button>
        <div>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex items-center justify-center">
                <FormField
                  name="locations"
                  render={({ field }) => (
                    <FormItem>
                      {index}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button onClick={() => remove(index)}>Remove</Button>
              </div>
            );
          })}
        </div>
      </form>
    </Form>
  );
}

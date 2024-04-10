"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocationStore } from "@/stores/locations";
import { useParameterStore } from "@/stores/parameters";
import {
  stringToDollars,
  getDateString,
  getSavings,
  createExcel,
} from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Graph } from "@/components/Graph";
import { FormError } from "@/components/form-error";

const FormSchema = z.object({
  daterange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

export function History() {
  const [graphData, setGraphData] = useState<any>(null);
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const locations = useLocationStore((state) => state.locations);
  const selectedLocations = locations.filter((location) => location.selected);

  const parameters = useParameterStore((state) => state);

  const numLocations = selectedLocations.length;
  const totalNumberPanels = selectedLocations.reduce(
    (acc, location) => acc + location.numberPanels,
    0
  );

  const roi = getSavings(graphData);

  const fetchHistory = async (start: string, end: string) => {
    const body = {
      parameters: parameters,
      start: start,
      end: end,
      numLocations: numLocations,
      numPanels: totalNumberPanels,
    };
    try {
      const response = await fetch(`http://localhost:5001/hist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return response.json();
    } catch (error) {
      return { error: "Failed to fetch history" };
    }
  };

  async function onSubmit(data: any) {
    setError("");
    const test = await fetchHistory(
      getDateString(data.daterange.from),
      getDateString(data.daterange.to)
    );
    if (test.error) {
      setError(test.error);
      return;
    }
    setGraphData(test);
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="daterange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Calendar
                    mode="range"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={{ after: new Date() }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
            <FormError message={error} />
          </form>
        </Form>
        {graphData && (
          <Card className="w-full mt-4">
            <CardHeader>
              <CardTitle>Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <span>{stringToDollars.format(roi)}</span>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="flex w-full justify-center h-full">
        {graphData && (
          <div className="flex flex-col space-y-4 h-full w-full pl-8">
            <Graph
              times={graphData.histsearch.times}
              acpower={graphData.histsearch.acpower}
            />
            <Button onClick={() => createExcel(graphData)}>
              Export to Excel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

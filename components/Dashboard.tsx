"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLocationStore } from "@/stores/data";
import { useParameterStore } from "@/stores/parameters";
import { Graph } from "@/components/Graph";
import { calculateNumberOfPanels } from "@/lib/panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

const FormSchema = z.object({
  daterange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

export function Dashboard() {
  const defaultSelected: DateRange = {
    from: new Date(2024, 2, 1),
    to: new Date(2024, 2, 7),
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [graphData, setGraphData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const locations = useLocationStore((state) => state.locations);
  const selectedLocations = locations.filter((location) => location.selected);

  const parameters = useParameterStore((state) => state);

  const totalArea = selectedLocations.reduce(
    (acc, location) => acc + location.area,
    0
  );

  const numLocations = selectedLocations.length;

  const { numPanels, solarProduction, costOfPanels, payback } =
    calculateNumberOfPanels(totalArea);

  const fetchHistory = async (start: string, end: string) => {
    const body = {
      parameters: parameters,
      start: start,
      end: end,
      numLocations: numLocations,
      numPanels: numPanels,
    };
    const response = await fetch(`http://localhost:5001/hist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const fetchForecast = async () => {
    const body = {
      parameters: parameters,
      numLocations: numLocations,
      numPanels: numPanels,
    };
    const response = await fetch(`http://localhost:5001/forecast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  async function onClick() {
    const test = await fetchForecast();
    console.log(test);
    setForecastData(test);
  }

  function getDateString(date: Date) {
    return `${date.getFullYear().toString()},${(
      date.getMonth() + 1
    ).toString()},${date.getDate().toString()}`;
  }

  async function onSubmit(data: any) {
    console.log(data);
    const test = await fetchHistory(
      getDateString(data.daterange.from),
      getDateString(data.daterange.to)
    );
    console.log(test);
    setGraphData(test);
  }

  return (
    <div className="flex flex-col justify-between mt-2 mr-2">
      <div className="flex flex-row">
        <Card className="grow">
          <CardHeader>
            <CardTitle>Array Size</CardTitle>
          </CardHeader>
          <CardContent>{solarProduction / 1000} kW</CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle>Total Cost</CardTitle>
          </CardHeader>
          <CardContent>${costOfPanels}</CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle>Total Surface Area</CardTitle>
          </CardHeader>
          <CardContent>
            <span>{totalArea} m²</span>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="history" className="w-full mt-10">
        <TabsList>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="flex">
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
            </form>
          </Form>
          <div className="flex w-full justify-center">
            {graphData && (
              <Graph
                times={graphData.histsearch.times}
                acpower={graphData.histsearch.acpower}
              />
            )}
          </div>
        </TabsContent>
        <TabsContent value="forecast" className="flex">
          <div className="flex w-full justify-center">
            <Button onClick={onClick}>Fetch Forecast</Button>
            {forecastData && (
              <Graph
                times={forecastData.forecast.times}
                acpower={forecastData.forecast.acpower}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

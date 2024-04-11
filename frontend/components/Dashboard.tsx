import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleMap } from "@/components/google-map";
import { Stats } from "@/components/stats";
import { History } from "@/components/history";
import { Forecast } from "@/components/forecast";

export function Dashboard() {
  return (
    <div className="flex flex-col p-4 h-screen">
      <Stats />
      <Tabs defaultValue="map" className="w-full mt-6 h-full flex flex-col">
        <TabsList className="w-[215px]">
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="grow">
          <GoogleMap />
        </TabsContent>
        <TabsContent value="history" className="grow">
          <History />
        </TabsContent>
        <TabsContent value="forecast" className="flex">
          <Forecast />
        </TabsContent>
      </Tabs>
    </div>
  );
}

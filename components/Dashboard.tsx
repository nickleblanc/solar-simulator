"use client";

import { getGoogleSolar, getRoofArea } from "@/actions/google-solar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAreaStore } from "@/stores/data";

export function Dashboard() {
  const area = useAreaStore((state) => state.area);

  return (
    <div className="flex justify-between mt-2 mr-2">
      <Card className="grow">
        <CardHeader>
          <CardTitle>Total Production</CardTitle>
        </CardHeader>
        <CardContent>{}</CardContent>
      </Card>
      <Card className="grow">
        <CardHeader>
          <CardTitle>Total Cost</CardTitle>
        </CardHeader>
        <CardContent>{}</CardContent>
      </Card>
      <Card className="grow">
        <CardHeader>
          <CardTitle>Total Surface Area</CardTitle>
        </CardHeader>
        <CardContent>{area}</CardContent>
      </Card>
    </div>
  );
}

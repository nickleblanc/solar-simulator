// import { useLocationStore } from "@/stores/locations";
import { useParameterStore } from "@/stores/parameters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PanelSelector() {
  // const locations = useLocationStore((state) => state.locations);
  const panels = useParameterStore((state) => state.Panels);
  const setSelectedPanel = useParameterStore((state) => state.setSelectedPanel);

  const onValueChange = (value: string) => {
    console.log(value);
    const panel = panels.find((panel) => panel.name === value);
    if (!panel) return;
    setSelectedPanel(panel);
  };

  return (
    <Select onValueChange={onValueChange} defaultValue="BYD395MLK-27">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Panel" />
      </SelectTrigger>
      <SelectContent>
        {panels.map((panel) => {
          return (
            <SelectItem key={panel.name} value={panel.name}>
              {panel.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

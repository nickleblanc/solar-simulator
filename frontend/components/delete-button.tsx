import { useLocationStore } from "@/stores/locations";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";

export function DeleteButton({ id }: { id: string }) {
  const deleteLocation = useLocationStore((state) => state.deleteLocation);

  const onClick = () => {
    deleteLocation(id);
  };

  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="h-8 w-8">
      <IoClose className="h-5 w-5" />
    </Button>
  );
}

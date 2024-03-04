import { Command } from "@tauri-apps/api/shell";

export async function TestPython() {
  // const command = Command.sidecar("py/test", ["value", "test"]);
  const command = Command.sidecar("py/test");
  const output = await command.execute();
  const { stdout, stderr } = output;
  console.log(stdout);
}

import "reflect-metadata";
import { createApplication } from "./app";

createApplication().then((runner: { run: () => void }) => {
  runner.run();
});

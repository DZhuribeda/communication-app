import "reflect-metadata";
import express from "express";

export async function createApp() {
  const app = express();

  



  
  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  await require("./loaders").default({ expressApp: app });
  return app;
}

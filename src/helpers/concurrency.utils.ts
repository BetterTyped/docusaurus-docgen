import { writeFileSync } from "fs";
import { ensureDirSync, existsSync, readJSONSync } from "fs-extra";

import { trace } from "./log.utils";

export const createInstance = (dir: string, file: string) => {
  trace("Creating instance...");
  ensureDirSync(dir);
  const date = new Date().toISOString();
  writeFileSync(file, JSON.stringify({ date }));
  return date;
};

export const isNewInstance = (file: string, date: string, watch: boolean) => {
  const exist = existsSync(file);
  if (!exist) return true;

  // Require will cache the file, so watch mode will be initialized only once
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const savedDate = watch ? require(file) : readJSONSync(file);

  if (savedDate.date !== date) trace("New instance detected.");

  return savedDate.date !== date;
};

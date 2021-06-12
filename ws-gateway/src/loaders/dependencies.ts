import { RedisClient, createClient } from "redis";
import { Container } from "typedi";
import config from "../config";

export default function () {
  Container.set(RedisClient, createClient(config.redisUrl));
}

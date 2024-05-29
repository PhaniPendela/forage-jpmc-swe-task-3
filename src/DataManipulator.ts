import { ServerResponse } from "http";
import { ServerRespond } from "./DataStreamer";

export interface Row {
  timestamp: Date;
  price_abc: Number;
  price_def: Number;
  ratio: Number;
  upper_bound: Number;
  lower_bound: Number;
  trigger_alert: Number | undefined;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    const priceABC =
      (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF =
      (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperbound = 1 + 0.05;
    const lowerbound = 1 - 0.05;
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio: ratio,
      timestamp:
        serverResponds[0].timestamp > serverResponds[1].timestamp
          ? serverResponds[0].timestamp
          : serverResponds[1].timestamp,
      upper_bound: upperbound,
      lower_bound: lowerbound,
      trigger_alert:
        ratio > upperbound || ratio < lowerbound ? ratio : undefined,
    };
  }
}

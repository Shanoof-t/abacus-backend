import { LoaderParams } from "../types/loader-types";
import expressLoader from "./express";
import "colors";

export default async ({ app, express }: LoaderParams) => {
  expressLoader({ app, express });
};

import { ImageResponse } from "./image-response";
import { Product } from "./product";
import { Products } from "./products";

export interface Response {
    body: Product | Products | string | Array<string> | ImageResponse,
    status: number
}

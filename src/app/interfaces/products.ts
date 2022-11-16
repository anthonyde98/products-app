import { Product } from "./product"

export interface Products {
    products: Array<Product>,
    total: number,
    skip: number,
    limit: number
}

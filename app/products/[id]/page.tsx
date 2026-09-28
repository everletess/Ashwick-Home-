import { ProductPage, productMetadata, productStaticParams, type ProductParams } from "./product-page";

export const dynamicParams = false;
export const generateStaticParams = productStaticParams;
export const generateMetadata = productMetadata;

export default function Page(props: ProductParams) {
  return <ProductPage {...props} mode="designed" />;
}

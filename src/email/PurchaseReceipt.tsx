import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";
import { formatCurrency } from "../lib/formatters";

type ProductEmail = {
  name: string;
  imagePath: string;
  description: string;
};

type PurchaseReceiptEmailProps = {
  products: ProductEmail[];
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  downloadVerificationIds: string[];
};
const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

PurchaseReceiptEmail.PreviewProps = {
  products: [
    {
      name: "Product name",
      description: "Some description",
      imagePath:
        "/products/2bee3c8a-e2bd-47f9-9733-e8c52e12912a-photo_2025-04-08_13-12-43.jpg",
    },
  ],
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 10000,
  },
  downloadVerificationIds: [crypto.randomUUID()],
} satisfies PurchaseReceiptEmailProps;

export default function PurchaseReceiptEmail({
  products,
  order,
  downloadVerificationIds,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>
        Download {products.length === 1 ? products[0].name : "your products"}{" "}
        and view receipt
      </Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Section>
            <Row>
              <Column>
                <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                  Order ID
                </Text>
                <Text className="mt-0 mr-4">{order.id}</Text>
              </Column>
              <Column>
                <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                  Purchased On
                </Text>
                <Text className="mt-0 mr-4">
                  {dateFormatter.format(order.createdAt)}
                </Text>
              </Column>
              <Column>
                <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                  Price Paid
                </Text>
                <Text className="mt-0 mr-4">
                  {formatCurrency(order.pricePaidInCents / 100)}
                </Text>
              </Column>
            </Row>
          </Section>
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            {products.map((product, idx) => (
              <OrderInformation
                key={downloadVerificationIds[idx] ?? idx}
                order={order}
                product={product}
                downloadVerificationId={downloadVerificationIds[idx]}
              />
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

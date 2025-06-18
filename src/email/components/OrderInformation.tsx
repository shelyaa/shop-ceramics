import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";

type OrderInformationProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  product: { imagePath: string; name: string; description: string };
  downloadVerificationId: string;
};


export function OrderInformation({
  product,
  downloadVerificationId,
}: OrderInformationProps) {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

  return (
    <>
      
      <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
        <Img
          width="300px"
          alt={product.name}
          src={`${serverUrl}${product.imagePath}`}
          className="m-auto"
        />
        <Row className="mt-8">
          <Column className="align-bottom">
            <Text className="text-lg font-bold m-0 mr-4">{product.name}</Text>
          </Column>
          <Column align="right">
            <Button
              href={`${serverUrl}/products/download/${downloadVerificationId}`}
              className="bg-black text-white px-6 py-4 rounded text-lg"
            >
              Download
            </Button>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-gray-500 mb-0">{product.description}</Text>
          </Column>
        </Row>
      </Section>
    </>
  );
}
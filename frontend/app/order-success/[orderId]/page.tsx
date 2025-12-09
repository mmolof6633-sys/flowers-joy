import { CheckoutSuccessPageClient } from '@pages/checkout-success';

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <CheckoutSuccessPageClient orderId={orderId} />;
}


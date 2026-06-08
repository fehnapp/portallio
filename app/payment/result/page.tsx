import { PaymentConfirmation } from "@/components/payment-confirmation";

export default function PaymentResultPage({
  searchParams,
}: {
  searchParams: { merchant_order_id?: string; success?: string; error_occured?: string };
}) {
  return (
    <PaymentConfirmation
      merchantOrderId={searchParams.merchant_order_id}
      success={searchParams.success}
      errorOccured={searchParams.error_occured}
    />
  );
}

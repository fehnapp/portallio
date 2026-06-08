import { PaymentConfirmation } from "@/components/payment-confirmation";

export default function PaymentResultPage({
  searchParams,
}: {
  searchParams: { id?: string; merchant_order_id?: string; success?: string; error_occured?: string };
}) {
  return (
    <PaymentConfirmation
      paymobOrderId={searchParams.id}
      merchantOrderId={searchParams.merchant_order_id}
      success={searchParams.success}
      errorOccured={searchParams.error_occured}
    />
  );
}

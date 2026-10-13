import axios from "axios";

// Falls back to this IP if no env var is set. To override, create a
// .env.local file in your project root with:
//   VITE_ORDER_API_BASE_URL=http://localhost:5298/api/order
const BASE_URL =
  import.meta.env.VITE_ORDER_API_BASE_URL || "http://localhost:5298/api/order";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

const toNullableString = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const stringValue = String(value).trim();

  return stringValue === "" ? null : stringValue;
};

export const getOrderDetails = async (
  {
    poNumber,
    countryCode,
    environment,
    orderNumber,
    partnerId,
    accountNumber,
    sku,
    transactionId,
  } = {},
  signal,
) => {
  try {
    const response = await client.post(
      "/GetOrder",
      {
        poNumber: toNullableString(poNumber),
        countryCode: toNullableString(countryCode),
        environment: toNullableString(environment),
        orderNumber: toNullableString(orderNumber),
        partnerId: toNullableString(partnerId),
        customerNumber: toNullableString(accountNumber),
        sku: toNullableString(sku),
        transactionId: toNullableString(transactionId),
      },
      { signal },
    );

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
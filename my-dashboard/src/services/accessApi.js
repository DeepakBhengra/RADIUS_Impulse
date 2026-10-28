import axios from "axios";

const orderBase =
  import.meta.env.VITE_ORDER_API_BASE_URL || "http://localhost:5298/api/order";
const baseURL = orderBase.replace(/\/api\/order\/?$/, "/api/access");

const client = axios.create({
  baseURL,
  timeout: 15000,
});

export class AccessLogError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "AccessLogError";
    this.status = status;
  }
}

function toError(error, fallback) {
  return new AccessLogError(
    error.response?.data?.message || fallback,
    error.response?.status,
  );
}

export async function recordAccessUser(record) {
  try {
    const response = await client.post("/users", record);
    return response.data;
  } catch (error) {
    throw toError(error, "The access log could not be reached.");
  }
}

export async function findAccessUser(email) {
  try {
    const response = await client.get("/users", { params: { email } });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw toError(error, "The access log could not be reached.");
  }
}

export async function loginAdminUser(email, password) {
  try {
    const response = await client.post("/admin-login", { email, password });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) return null;
    throw toError(error, "The access log could not be reached.");
  }
}

export async function loginAccessUser(email, password) {
  try {
    const response = await client.post("/login", { email, password });
    return { user: response.data, status: 200 };
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 404) {
      return { user: null, status: error.response.status };
    }
    throw toError(error, "The access log could not be reached.");
  }
}

export async function createPasswordReset(email) {
  try {
    const response = await client.post("/password-resets", { email });
    return response.data;
  } catch (error) {
    throw toError(error, "The access log could not be reached.");
  }
}

export async function createApprovalRequest(request) {
  try {
    const response = await client.post("/requests", request);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409 && error.response.data?.status) {
      return error.response.data;
    }
    throw toError(error, "The access log could not be reached.");
  }
}

export async function listApprovalRequests() {
  try {
    const response = await client.get("/requests");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw toError(error, "The access log could not be reached.");
  }
}

export async function approveApprovalRequest(id) {
  try {
    const response = await client.post(`/requests/${encodeURIComponent(id)}/approve`);
    return response.data;
  } catch (error) {
    throw toError(error, "The access log could not be reached.");
  }
}

export async function declineApprovalRequest(id, note) {
  try {
    const response = await client.post(`/requests/${encodeURIComponent(id)}/decline`, { note });
    return response.data;
  } catch (error) {
    throw toError(error, "The access log could not be reached.");
  }
}

export async function recordGuestLogin(guest) {
  try {
    const response = await client.post("/guests", guest);
    return response.data;
  } catch (error) {
    throw toError(error, "The access log could not be reached.");
  }
}

export async function findGuestLogin(email) {
  try {
    const response = await client.get("/guests", { params: { email } });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw toError(error, "The access log could not be reached.");
  }
}

# Impulse Tool

Web-based tracking and diagnostic tool for the Impulse ecosystem. Search an order, SKU, account, or partner and follow it across order-entry flows and systems.

Source imported from [im-charmi152/Impulse_Tool](https://github.com/im-charmi152/Impulse_Tool.git).

## Layout

- `my-dashboard` — React + Vite dashboard. Search, order header, line items, partner setup, process flow, and monitoring panels.
- `backend-dotnet` — ASP.NET Core 8 API (`ImpulseSupportTool_Repo`) that looks up orders in DB2 and Oracle ODS. Database passwords are read from .NET user secrets, not from this repo.

## Run the dashboard

The UI ships with mock data so it runs without the corporate network or the API.

```bash
cd my-dashboard
npm install
npm run dev
```

Open the URL Vite prints. `VITE_USE_MOCK_API=true` in `my-dashboard/.env.local` uses the local mock. Any search value returns a sample order; include `NOTFOUND` in a field to see the empty state.

To call the live API instead, set `VITE_USE_MOCK_API=false` and point `VITE_ORDER_API_BASE_URL` at the running service.

## Run the API

Requires the .NET 8 SDK, IBM DB2 and Oracle client access, and user secrets for the connection passwords (`ODSConnectionQa:Password`, `ODSConnectionDev:Password`, `ODSConnectionProd:Password`).

```bash
cd backend-dotnet/ImpulseSupportTool_Repo
dotnet run --launch-profile http
```

The HTTP profile listens on `http://localhost:5298`. Swagger is served at `/swagger`.

# Impulse Tool

Web tool for tracing an Impulse order. A support user searches by customer PO number and country, then reviews the header, line items, processing flow, partner setup, and PO switch data on one screen.

Functional requirements are listed in [requirements.txt](requirements.txt).

Source imported from [im-charmi152/Impulse_Tool](https://github.com/im-charmi152/Impulse_Tool.git).

## Architecture

```text
Browser
  React 19 + Vite dashboard (my-dashboard)
        |
        |  VITE_USE_MOCK_API=true  -> services/mockApi.js
        |  VITE_USE_MOCK_API=false -> POST /api/order/GetOrder
        v
ASP.NET Core 8 API (backend-dotnet/ImpulseSupportTool_Repo)
  OrderController
        |
        v
  OrderService
        |
        v
  OrderRepository
        |
        +--> EnvironmentMapper
        |      picks Prod, Qa, or Dev
        |      adds the Oracle password from user secrets
        |
        v
  Oracle ODS
    ODS.ODS_ORDER
    ODS.ODS_ORDER_LINE
    ODS.DB2_OR_ORDER_STUS_CHGS
    ODS.DB2_EO_ORDR_HDR_INFO
    ODS.DB2_IE_PARTNER_SETUP
    ODS.DB2_IE_IN_PO_SW
```

The UI never talks to Oracle. It asks `services/api.js` for one consolidated object. That file either returns mock data or calls the API and passes the JSON through `services/mapOrderResponse.js`.

DB2 order, partner, and PO-switch rows are read from the `ODS.DB2_*` tables. `appsettings.json` contains a DB2 ODBC connection string, and the project references `System.Data.Odbc`, but the repository does not open an ODBC connection.

## Technical design

### Dashboard

| Piece | Role |
| --- | --- |
| `src/RootRouter.jsx` | Hash router for the dashboard and the four detail pages |
| `src/App.jsx` | Search page, result tabs, and export |
| `src/hooks/useOrderSearch.js` | States `idle`, `loading`, `success`, `empty`, `error`. Cancels the previous request and caches the last 20 searches |
| `src/services/api.js` | Chooses mock or live lookup |
| `src/services/orderApi.js` | Axios `POST` to `GetOrder` |
| `src/services/mapOrderResponse.js` | Maps the C# response into the shape the components render |
| `src/services/mockApi.js` | Offline sample order. `NOTFOUND` in any field returns no order |
| `src/data/navigation.js` | Search fields and the three flow definitions |
| `src/utils/auditLog.js` | In-browser record of each search |

Live search sends `poNumber`, `countryCode`, and `environment`. Country code is stored on the order as `COMPANY_CD`. Environment must be `Prod`, `Qa`, or `Dev`.

### API

| Piece | Role |
| --- | --- |
| `Controllers/OrderController.cs` | `POST /api/order/GetOrder` |
| `OrderService.cs` | Passes the request to the repository |
| `OrderRepository.cs` | Opens Oracle and fills `OrderResponse` |
| `EnviormentMapper.cs` | Builds the ODS connection string for the selected environment |
| `OrderRequestModel.cs` | Request body |
| `OrderResponseModel.cs` | Header, lines, status history, partner setup, and PO switch |
| `ZoneMapper.cs` | Maps a country code to a DB2 zone (`Z1`–`Z4`) |
| `Program.cs` | Controllers, Swagger, CORS policy `FrontendPolicy`, dependency injection |

`GetOrder` returns `200` with the order, or `404` with `Order not found` when the header query has no row. Swagger is at `/swagger`.

Oracle passwords are user secrets, not files in git:

- `ODSConnectionQa:Password`
- `ODSConnectionDev:Password`
- `ODSConnectionProd:Password`

The project user-secrets id is `b7da84d9-96e6-47f8-823c-0dad566774cb`.

## UI

The main screen is a header, a sidebar, and a search card. The card asks for customer PO number, country code, and environment. Search stays disabled until the PO and country are filled in. Recent searches are stored in the browser.

After a successful search the summary banner sits above these tabs:

| Tab | What it shows |
| --- | --- |
| Order Details | Header fields from `ODS.ODS_ORDER` |
| Line Items | Rows from `ODS.ODS_ORDER_LINE` |
| Processing Flow | Progress derived from the EO state code |
| Flow Trace Status | EDI, XEDI+MQ, and X4C system steps |
| PO Switch | Inbound PO switch rows |
| Setup & Configuration | Partner setup |
| Logs & Monitoring | Log and alert panels from the consolidated response |

The active tab can be exported as JSON or CSV.

Detail pages, opened from the result, use hash routes:

- `#/order-header-details`
- `#/line-item-details`
- `#/partner-setup-details`
- `#/po-switch-details`

Empty, loading, and error states are separate panels. There is no signed-in user. The API does not require a token.

## Backend

Runtime is .NET 8. The HTTP launch profile listens on `http://localhost:5298`.

Request example:

```http
POST /api/order/GetOrder
Content-Type: application/json

{
  "poNumber": "CW22988",
  "countryCode": "MD",
  "environment": "Prod"
}
```

`countryCode` is the company code in `ODS.ODS_ORDER`. `environment` selects `ODSConnectionProd`, `ODSConnectionQa`, or `ODSConnectionDev` from `appsettings.json`, then appends the matching user-secret password.

NuGet packages:

- `Oracle.ManagedDataAccess.Core` 23.26.300
- `Swashbuckle.AspNetCore` 6.6.2
- `System.Data.Odbc` 10.0.8

## How to run

### Dashboard with mock data

No database and no API are required.

```bash
cd my-dashboard
npm ci
npm run dev
```

`my-dashboard/.env.local`:

```text
VITE_ORDER_API_BASE_URL=http://localhost:5298/api/order
VITE_USE_MOCK_API=true
```

Any PO returns the sample order. A PO that contains `NOTFOUND` shows the empty state.

Other scripts:

```bash
npm run build
npm run lint
npm run preview
```

### API

Requires the .NET 8 SDK, network access to the ODS host for the environment you select, and the three user-secret passwords.

```bash
cd backend-dotnet/ImpulseSupportTool_Repo
dotnet user-secrets set "ODSConnectionQa:Password" "<qa-password>"
dotnet user-secrets set "ODSConnectionDev:Password" "<dev-password>"
dotnet user-secrets set "ODSConnectionProd:Password" "<prod-password>"
dotnet run --launch-profile http
```

Swagger: `http://localhost:5298/swagger`.

### Dashboard against the API

In `my-dashboard/.env.local` set `VITE_USE_MOCK_API=false`, restart Vite, and search with a PO, country code, and environment. The browser calls `http://localhost:5298/api/order/GetOrder`.

## Repository layout

```text
requirements.txt          functional and runtime requirements
my-dashboard/             React + Vite UI
backend-dotnet/           ASP.NET Core solution
  ImpulseSupportTool_Repo/
```

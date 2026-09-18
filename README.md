# React + ASP.NET Core Azure B2C reference

This solution demonstrates two independent authorization boundaries:

- `Api/Controllers/PublicController.cs` is anonymous.
- `Api/Controllers/ProfileController.cs` requires a JWT and the `access_as_user` delegated scope.
- `frontend/src/App.tsx` renders public and protected routes and calls the API through MSAL-acquired tokens.

## Frontend routes

The Vite React client uses `react-router-dom` with route guards:

- `/` and `/about` are public pages.
- `/dashboard` is protected by `RequireAuth`; anonymous visitors see a `Login / Sign up` button that starts the Azure B2C redirect flow.
- `/admin` is protected by `RequireAuth` and `RequireRole`; the signed-in account must contain `Admin` in its `roles` claim.

The route guard improves navigation and user experience, but it is not a security boundary. Enforce authorization again in API controllers using `[Authorize]`, scopes, and roles.

To use the admin route, define an `Admin` app role on the SPA app registration and assign it to the intended users or groups. The role must be emitted in the ID token for the client-side route guard. If the role protects API data, also enforce it on the API endpoint.

## Create the app registrations

Use one Microsoft Entra External ID / Azure AD B2C tenant and create two app registrations.

### 1. API registration

1. Register an app named `B2C Reference API`; leave redirect URI empty.
2. Copy its **Application (client) ID** into `Api/appsettings.Development.json` as `ClientId`.
3. Open **Expose an API**, set the Application ID URI to the suggested value, and add a delegated scope named `access_as_user`.
4. Keep the scope consent description clear, for example: `Allow the SPA to call the reference API as the signed-in user.`
5. Note the complete scope value. It normally looks like `https://TENANT.onmicrosoft.com/API_CLIENT_ID/access_as_user`.

### 2. SPA registration

1. Register a second app named `B2C Reference SPA`.
2. Add a **Single-page application** redirect URI: `http://localhost:5173`.
3. Under **API permissions**, add the API registration's delegated `access_as_user` permission.
4. Grant consent if your tenant requires administrator consent.
5. Copy this registration's **Application (client) ID** into the frontend environment file.

### 3. Sign-up/sign-in user flow

Create or reuse a user flow named `B2C_1_signupsignin` (or your preferred policy name) and enable the SPA app. The policy name is used in both the API settings and the frontend authority.

## Configure locally

Copy `frontend/.env.example` to `frontend/.env.local` and replace the placeholders:

```text
VITE_B2C_CLIENT_ID=<SPA application client ID>
VITE_B2C_TENANT_NAME=<tenant short name>
VITE_B2C_TENANT_DOMAIN=<tenant short name>.onmicrosoft.com
VITE_B2C_TENANT_ID=<tenant directory ID>
VITE_B2C_SIGNUP_SIGNIN_POLICY=B2C_1_signupsignin
VITE_API_SCOPE=https://<tenant short name>.onmicrosoft.com/<API application client ID>/access_as_user
```

Replace the `YOUR_*` values in `Api/appsettings.Development.json`. For shared environments, prefer environment variables such as `AzureAdB2C__ClientId` instead of committing settings. Client IDs are not secrets; client secrets must never be placed in this SPA.

## Run

In one terminal:

```powershell
dotnet run --project Api --launch-profile https
```

In another terminal:

```powershell
npm install --prefix frontend
npm run dev --prefix frontend
```

Open `http://localhost:5173`. The public card should load without signing in. After sign-in, the protected card acquires a token silently and calls `/api/profile` with the bearer token.

The API uses the generated HTTPS development certificate. If the browser rejects it, run `dotnet dev-certs https --trust` once on the development machine.

## Production notes

- Add the production SPA origin to API CORS and as a SPA redirect URI.
- Use HTTPS everywhere.
- Keep API authorization attributes and scope checks at the controller/action boundary; do not rely on the React route alone.
- Validate the API scope and issuer in the API configuration. Never treat a client-side token or hidden UI as authorization.

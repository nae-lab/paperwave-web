import { initializeApp } from "firebase/app";
import { getAuth, getIdToken } from "firebase/auth";
import { getInstallations, getToken } from "firebase/installations";

// this is set during install
let firebaseConfig;

self.addEventListener("install", (_) => {
  // extract firebase config from query string
  const serializedFirebaseConfig = new URL(location).searchParams.get(
    "firebaseConfig",
  );

  if (!serializedFirebaseConfig) {
    throw new Error(
      "Firebase Config object not found in service worker query string.",
    );
  }

  firebaseConfig = JSON.parse(serializedFirebaseConfig);
  console.debug(
    "Service worker installed with Firebase config",
    firebaseConfig,
  );
});

self.addEventListener("fetch", (event) => {
  const { origin } = new URL(event.request.url);

  if (origin !== self.location.origin) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

async function fetchWithFirebaseHeaders(request) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const installations = getInstallations(app);
  const headers = new Headers(request.headers);
  const [authIdToken, installationIdToken] = await Promise.all([
    getAuthIdToken(auth),
    getToken(installations),
  ]);

  headers.append("Firebase-Instance-ID-Token", installationIdToken);
  if (authIdToken) {
    headers.append("Authorization", `Bearer ${authIdToken}`);
  }
  const newRequest = new Request(request, {
    headers,
  });

  const response = await fetch(newRequest);

  // Add Access-Control-Allow-Origin header to the response to avoid CORS issues
  const newHeaders = new Headers(response.headers);

  newHeaders.append("Access-Control-Allow-Origin", "*");
  newHeaders.append("Access-Control-Allow-Headers", "*");
  newHeaders.append("Access-Control-Allow-Methods", "*");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

async function getAuthIdToken(auth) {
  await auth.authStateReady();
  if (!auth.currentUser) return;

  return await getIdToken(auth.currentUser);
}

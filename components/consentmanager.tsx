import Script from "next/script";

export default function ConsentManager() {
  return (
    <Script
      data-cmp-ab="1"
      data-cmp-cdn="cdn.consentmanager.net"
      data-cmp-codesrc="16"
      data-cmp-host="c.delivery.consentmanager.net"
      src="https://cdn.consentmanager.net/delivery/autoblocking/b36c954e01969.js"
      // strategy="beforeInteractive"
      type="text/javascript"
    />
  );
}

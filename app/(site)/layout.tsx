import NavbarClient from "./NavbarClient";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarClient />
      {children}
    </>
  );
}

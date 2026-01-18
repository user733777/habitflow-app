import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trackflow - Gestionnaire d'habitudes et de tâches",
  description: "Suivez vos habitudes quotidiennes et gérez vos tâches efficacement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

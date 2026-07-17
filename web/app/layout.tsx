import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rota Zero - Assistente Financeiro",
    description:
          "Assistente educativo para ajudar pessoas endividadas a sairem do vermelho e planejarem investimentos saudaveis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
          <html lang="pt-BR">
                <body>{children}
                </body>
          </html>
        );
}

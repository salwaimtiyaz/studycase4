"use client";

import "./globals.css";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  
	const queryClient = new QueryClient();

	return (
		<html lang="en">
			<QueryClientProvider client={queryClient}>
				<body>{children}</body>
				<ReactQueryDevtools />
			</QueryClientProvider>
		</html>
	);
}

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return
          }

          if (id.includes("react-dom") || id.includes("react-router-dom") || id.includes("/react/")) {
            return "vendor-react"
          }

          if (id.includes("@reduxjs/toolkit") || id.includes("@tanstack/")) {
            return "vendor-data"
          }

          if (id.includes("/antd/") || id.includes("/rc-") || id.includes("/dayjs/")) {
            return "vendor-antd"
          }

          if (id.includes("@react-pdf/") || id.includes("/pdfkit/") || id.includes("/fontkit/")) {
            return "vendor-pdf"
          }

          if (id.includes("/recharts/")) {
            return "vendor-charts"
          }

          if (id.includes("@radix-ui/")) {
            return "vendor-radix"
          }

          if (id.includes("/react-icons/") || id.includes("/lucide-react/") || id.includes("@tabler/icons-react")) {
            return "vendor-icons"
          }

          if (id.includes("/i18next/") || id.includes("/react-i18next/")) {
            return "vendor-i18n"
          }

          if (id.includes("/zod/")) {
            return "vendor-zod"
          }

          return "vendor-misc"
        },
      },
    },
  },
})

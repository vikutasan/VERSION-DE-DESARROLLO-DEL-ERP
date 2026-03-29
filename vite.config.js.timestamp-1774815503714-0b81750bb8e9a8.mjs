// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/Pollo/Downloads/ERP%20R%20DE%20RICO/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Pollo/Downloads/ERP%20R%20DE%20RICO/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\Pollo\\Downloads\\ERP R DE RICO";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./apps"),
        "@packages": path.resolve(__vite_injected_original_dirname, "./packages")
      }
    },
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
      open: false,
      watch: {
        usePolling: true
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxQb2xsb1xcXFxEb3dubG9hZHNcXFxcRVJQIFIgREUgUklDT1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUG9sbG9cXFxcRG93bmxvYWRzXFxcXEVSUCBSIERFIFJJQ09cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1BvbGxvL0Rvd25sb2Fkcy9FUlAlMjBSJTIwREUlMjBSSUNPL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gICAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2FwcHMnKSxcclxuICAgICAgICAgICAgICAgICdAcGFja2FnZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9wYWNrYWdlcycpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VydmVyOiB7XHJcbiAgICAgICAgICAgIHBvcnQ6IHBhcnNlSW50KGVudi5WSVRFX1BPUlQpIHx8IDUxNzMsXHJcbiAgICAgICAgICAgIG9wZW46IGZhbHNlLFxyXG4gICAgICAgICAgICB3YXRjaDoge1xyXG4gICAgICAgICAgICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1QsU0FBUyxjQUFjLGVBQWU7QUFDMVYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN0QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsU0FBTztBQUFBLElBQ0gsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQ2pCLFNBQVM7QUFBQSxNQUNMLE9BQU87QUFBQSxRQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLFFBQVE7QUFBQSxRQUNyQyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDckQ7QUFBQSxJQUNKO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDSixNQUFNLFNBQVMsSUFBSSxTQUFTLEtBQUs7QUFBQSxNQUNqQyxNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDSCxZQUFZO0FBQUEsTUFDaEI7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Banners from "./pages/Banners";
import WeeklySpecials from "./pages/WeeklySpecials";
import CarouselItems from "./pages/CarouselItems";
import ImageGallery from "./pages/ImageGallery";
import ServicesBanner from "./pages/ServicesBanner";
import BelowBannerImages from "./pages/BelowBannerImages";
import CompanySections from "./pages/CompanySections";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/produtos" element={<Products />} />
                      <Route path="/categorias" element={<Categories />} />
                      <Route path="/banners" element={<Banners />} />
                      <Route path="/ofertas" element={<WeeklySpecials />} />
                      <Route path="/carrossel" element={<CarouselItems />} />
                      <Route path="/galeria" element={<ImageGallery />} />
                      <Route path="/banner-servicos" element={<ServicesBanner />} />
                      <Route path="/imagens-abaixo-banner" element={<BelowBannerImages />} />
                      <Route path="/secoes-empresa" element={<CompanySections />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
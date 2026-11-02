import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Publications from "./pages/Publications";
import Activities from "./pages/Activities";
import AcrossTheGlobe from "./pages/AcrossTheGlobe";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import SiteErrorBoundary from "./components/SiteErrorBoundary";

export default function App() {
  return (
    <SiteErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<ProjectDetail />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/across-the-globe" element={<AcrossTheGlobe />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SiteErrorBoundary>
  );
}

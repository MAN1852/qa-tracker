import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './pages/Dashboard';
import { ApplicationBoard } from './pages/ApplicationBoard';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { Layout } from './components/Layout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/board" element={<ApplicationBoard />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
            {/* Add more routes here */}
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

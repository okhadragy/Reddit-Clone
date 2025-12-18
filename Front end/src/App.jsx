import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './Components/LoginContext.jsx';
import AppContent from './AppContent.jsx';
   
function App() {
  
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

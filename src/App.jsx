import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./navigation/authContext";
import AppStack from "./navigation/AppStack";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppStack />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

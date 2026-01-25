import { BrowserRouter } from "react-router-dom";
import AppStack from "./navigation/AppStack";

const App = () => {
  return (
    
      <BrowserRouter>
        <AppStack />
      </BrowserRouter>
   
  );
};

export default App;

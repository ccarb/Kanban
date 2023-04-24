import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";

// Views
import App from './App';
import Home from './views/home/home';
import DetailedChecklist from './views/detailedChecklist';
import Kanban from './views/kanban/kanban';

//export const CHECKLIST_API_URL = "http://ccarb-sandbox.click:8000/api/checklists/";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/checklists",
    element: <App />,
  },
  {
    path: "/checklists/:checklistId",
    element: <DetailedChecklist/>,
    loader: ({params}) => {return params.checklistId;},
  },
  {
    path: "kanban/:boardId",
    element: <Kanban/>,
    loader: ({params}) => {return params.boardId;},
  },
  {
    path: '*',
    element: <><div className="ps-3"><h1>404</h1><h2>Not Found</h2></div></>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

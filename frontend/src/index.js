import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App';
import DetailedChecklist from './views/detailedChecklist';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";

export const CHECKLIST_API_URL = "http://localhost:8000/api/checklists/";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div><h1>Kanban</h1><p>Site in progress</p><a href="checklists">Checklists</a><br/><a href='checklist'>Checklist detail</a></div>
  },
  {
    path: "/checklists",
    element: <App />,
  },
  {
    path: "/checklists/:checklistId",
    element: <DetailedChecklist/>,
    loader: ({params}) => {return params.checklistId;},
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

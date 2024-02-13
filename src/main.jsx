import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import { queryClient } from './services/queyClient.js'

import Dashboard from './routes/pages/DashBoard/Dashboard.jsx'
import Pomodoro from './routes/pages/Pomodoro/Pomodoro.jsx'
import App from './App.jsx'

import ErrorPage from './routes/Erro-page.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/pomodoro',
        element: <Pomodoro />
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)

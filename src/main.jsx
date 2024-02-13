import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'

import Dashboard from './routes/Dashboard.jsx'
import Pomodoro from './routes/Pomodoro.jsx'
import App from './App.jsx'
import ErrorPage from './routes/Erro-page.jsx'
import { queryClient } from './services/queyClient.js'

const router = createBrowserRouter([
  {
    path: '/Pondera/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/Pondera/',
        element: <Dashboard />
      },
      {
        path: '/Pondera/pomodoro/',
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

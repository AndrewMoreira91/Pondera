import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
// import { getPomodoroTasks } from './routes/pages/Pomodoro/Pomodoro'

// export async function loader() {
//   const tasks = await getPomodoroTasks()
//   return tasks
// }

function App() {
  // const { pomodoro } = useLoaderData()
  // console.log(pomodoro)
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App

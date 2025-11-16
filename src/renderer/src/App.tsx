// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
import MainLayout from './layout/mainLayout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './screen/homePage'
import Settings from './screen/settings'

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Wrapper */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="settings" element={<Settings />} />
          {/* <Route path="logs" element={<Logs />} /> */}

          {/* 404 fallback */}
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

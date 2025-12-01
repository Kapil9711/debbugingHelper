// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
import MainLayout from './layout/mainLayout'
import { HashRouter, Routes, Route } from 'react-router-dom'
import HomePage from './screen/homePage'
import Settings from './screen/settings'
import { Toaster } from 'react-hot-toast'
import NetworkPage from './screen/networkPage'
import ApiTesting from './screen/apiTesting'

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={10}
        containerClassName=""
        containerStyle={{}}
        toasterId="default"
        toastOptions={{
          // Define default options
          className: '!bg-[#004545] uppercase tracking-[1px] text-sm',
          duration: 5000,
          removeDelay: 1000,
          style: {
            // background: '#363636',
            color: '#fff'
          },

          // Default options for specific types
          success: {
            duration: 2000,
            iconTheme: {
              primary: 'green',
              secondary: 'black'
            }
          }
        }}
      />

      <Routes>
        {/* Layout Wrapper */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="api-testing" element={<ApiTesting />} />
          <Route path="settings" element={<Settings />} />

          {/* 404 fallback */}
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App

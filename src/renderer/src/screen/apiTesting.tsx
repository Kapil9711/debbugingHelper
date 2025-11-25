import ApiTestingContent from '@renderer/components/pages/apiTesting/apiTestingContent'
import ApiTestingHeader from '@renderer/components/pages/apiTesting/apiTestingHeader'
import { createContext, useContext, useState } from 'react'

const ApiTestingContext = createContext(null as any)
export const useApiTestingContext = () => useContext(ApiTestingContext)

const ApiTesting = () => {
  const [selectedEnvironment, setSelectedEnivronment] = useState('GET')
  return (
    <ApiTestingContext.Provider value={{ selectedEnvironment, setSelectedEnivronment }}>
      <ApiTestingHeader />
      <ApiTestingContent />
    </ApiTestingContext.Provider>
  )
}

export default ApiTesting

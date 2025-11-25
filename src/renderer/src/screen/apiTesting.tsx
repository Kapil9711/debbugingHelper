import ApiTestingHeader from '@renderer/components/pages/apiTesting/apiTestingHeader'
import { createContext, useContext } from 'react'

const ApiTestingContext = createContext(null as any)
export const useApiTestingContext = () => useContext(ApiTestingContext)

const ApiTesting = () => {
  return (
    <ApiTestingContext.Provider value={{}}>
      <ApiTestingHeader />
    </ApiTestingContext.Provider>
  )
}

export default ApiTesting

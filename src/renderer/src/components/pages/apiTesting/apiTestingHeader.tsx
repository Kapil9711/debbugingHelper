import Header from '@renderer/components/header'
import { useApiTestingContext } from '@renderer/screen/apiTesting'
import { FaEdit } from 'react-icons/fa'

const ApiTestingHeader = () => {
  const { selectedEnvironment, setSelectedEnvironment } = useApiTestingContext()
  return (
    <Header>
      <div className="h-full w-full border-b border-gray-400">
        <div className="h-[50%]  w-full flex justify-between items-center px-5!">
          <p>Global Environment</p>
          <div className="flex items-center justify-center gap-5">
            <select
              value={selectedEnvironment}
              onChange={(e) => {
                setSelectedEnvironment(e.target.value)
              }}
              className={`px-3! py-1! rounded font-semibold text-sm shadow-sm cursor-pointer border outline-none `}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>

            <button className="py-1! px-1! rounded-lg cursor-pointer  text-sm">
              <FaEdit size={15} />
            </button>
          </div>
        </div>
        <div className="h-[50%] w-full"></div>
      </div>
    </Header>
  )
}

export default ApiTestingHeader

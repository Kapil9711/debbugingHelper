import Header from '@renderer/components/header'
import { FaEdit } from 'react-icons/fa'

const ApiTestingHeader = () => {
  const inputMethod = 'GET'
  return (
    <Header>
      <div className="h-full w-full border-b border-gray-400">
        <div className="h-[50%] border-b border-gray-400 w-full flex justify-between items-center px-5!">
          <p>Global Environment</p>
          <div>
            <select
              // value={inputMethod}
              // onChange={(e) => {
              //   setInputMethod(e.target.value)
              //   const idString = convertId(request?._id)
              //   const payload = {
              //     ...request,
              //     method: e.target.value
              //   }
              //   window.api.request.updateRequest({ id: idString, payload })
              // }}
              className={`
    px-3! py-1! rounded font-semibold text-sm shadow-sm cursor-pointer outline-none
  
  `}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>

            <button className="py-1! px-3! rounded-lg border border-gray-400 text-sm">
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

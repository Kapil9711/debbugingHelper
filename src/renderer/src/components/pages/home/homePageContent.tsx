import { useHomePageContext } from '@renderer/screen/homePage'
import { useState } from 'react'
import toast from 'react-hot-toast'
import ReactJson from 'react-json-view'

const HomePageContent = () => {
  const { logs } = useHomePageContext()
  const handleCopy = async (textToCopy) => {
    await navigator.clipboard.writeText(textToCopy)
    toast.success('Copied To Clipboard')
  }

  const [isHovered, setIsHovered] = useState(0)
  return (
    <div className="flex flex-col gap-10!  h-[calc(100%-80px)]  p-5! overflow-auto scrollbar-hidden bg-[#101111] ">
      {logs.map((item: any, index: any) => {
        return (
          <div
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(0)}
            key={index}
            className="hover:border border-gray-300  hover:rounded-md flex flex-col justify-center w-fit p-2!  gap-1.5 cursor-pointer hover:shadow-md relative"
          >
            <button
              style={{ display: isHovered == index ? 'block' : 'none' }}
              onClick={() => {
                const obj = JSON.stringify(item?.data, null, 2)
                handleCopy(obj)
              }}
              className="absolute right-3 top-3 border border-gray-200 h-[25px] w-[60px] bg-gray-300 text-black text-xs rounded-md cursor-pointer uppercase"
            >
              Copy
            </button>

            <p className="text-indigo-400! border-b  border-white w-fit" key={index}>
              {item?.time}
            </p>
            <ReactJson
              style={{
                width: 'fit-content',
                paddingBlock: '10px',
                background: 'transparent',
                height: 'fit-content'
              }}
              src={item?.data}
              theme="summerfruit"
              name={item?.type}
              collapsed={1}
              enableClipboard={true}
              displayDataTypes={true}
            />
          </div>
        )
      })}
    </div>
  )
}

export default HomePageContent

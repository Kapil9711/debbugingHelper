import { useHomePageContext } from '@renderer/screen/homePage'
import { useState } from 'react'
import ReactJson from 'react-json-view'

const HomePageContent = () => {
  const { logs } = useHomePageContext()
  const handleCopy = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy)
  }
  // const [isHovered, setIsHovered] = useState(0)
  return (
    <div className="flex flex-col  h-[calc(100%-80px)]  p-5! overflow-auto scrollbar-hidden bg-[#101111]">
      {logs.map((item: any, index: any) => {
        return (
          <div
            // onMouseEnter={() => setIsHovered(index)}
            onClick={() => {
              const obj = JSON.stringify(item?.data, null, 2)
              handleCopy(obj)
            }}
            key={index}
            className="hover:border hover:scale-[1.01] hover:rounded-md flex flex-col justify-center w-fit  gap-1.5 cursor-pointer"
          >
            <p className="text-white border-b border-white w-fit" key={index}>
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
              collapsed={index == 0 ? false : 1}
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

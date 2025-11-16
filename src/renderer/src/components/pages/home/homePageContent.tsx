import { useHomePageContext } from '@renderer/screen/homePage'
import ReactJson from 'react-json-view'

const HomePageContent = () => {
  const { logs } = useHomePageContext()
  return (
    <div className="flex flex-col items-center h-[calc(100%-80px)]  p-5! overflow-auto scrollbar-hidden bg-[#101111]">
      {logs.map((item: any, index: any) => {
        return (
          <div key={index} className="flex flex-col justify-center w-full  gap-1.5">
            <p className="text-white border-b border-white w-fit" key={index}>
              {item?.time}
            </p>
            <ReactJson
              style={{
                width: '100%',
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

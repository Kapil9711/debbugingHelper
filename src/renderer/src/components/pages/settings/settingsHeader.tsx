import Header from '@renderer/components/header'

const SettingsHeader = () => {
  return (
    <Header>
      <div className="h-full w-full flex justify-center items-center border-b border-gray-400">
        <p className="uppercase tracking-wider">Settings</p>
      </div>
    </Header>
  )
}

export default SettingsHeader

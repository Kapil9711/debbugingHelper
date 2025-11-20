import { consoleStore } from '../../services/consoleStore'
import { formatTime } from '../utlis/time'
import isEqual from 'lodash/isEqual'

export const createConsole = async (reqData) => {
  const { type, payload } = reqData
  console.log('insideReqDatafinal', reqData)
  const time = formatTime()
  const isLogExist = () => {
    return consoleStore.logs.some((item: any) => {
      console.log(item, payload, 'compared')
      return isEqual(item?.data, payload)
    })
  }
  if (!consoleStore.pauseConsole) {
    if (!isLogExist()) {
      consoleStore.push({ type, data: payload, time })
      return { isSuccess: true, msg: 'Log Added Successfully' }
    }
    return { isSuccess: false, msg: 'Log Already Exists' }
  }

  return { isSuccess: false, msg: 'Not Adding This Payload' }
}

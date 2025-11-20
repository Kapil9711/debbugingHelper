import { networkStore } from '../../services/networkStore'
import { formatTime } from '../utlis/time'

export const createConsole = async (reqData) => {
  const { type, body } = reqData
  const time = formatTime()

  let parsedBody
  try {
    parsedBody = JSON.parse(body)
  } catch (error) {
    parsedBody = body
  }

  const isLogExist = () => {
    let flag = false
    for (let item of networkStore.logs) {
      const obj1 = JSON.stringify(item?.data, null, 2)
      let obj2
      if (method == 'Get') {
        obj2 = JSON.stringify({ type, url, method }, null, 2)
      }
      if (method != 'Get') {
        obj2 = JSON.stringify({ type, url, method, body: parsedBody }, null, 2)
      }
      if (obj1 == obj2) {
        flag = true
        break
      }
    }
    return flag
  }

  if (type == 'xhr-request' && !url?.includes('/event-tracking') && !url?.includes('socket')) {
    if (!isLogExist()) {
      let payload: any = {
        data: { type, url, method, body: parsedBody },
        type: 'networkRequest',
        time: `🕒 ${time}`
      }
      if (method == 'Get') {
        payload = {
          data: { type, url, method },
          type: 'networkRequest',
          time: `🕒 ${time}`
        }
      }

      networkStore.push(payload)
      return { isSuccess: true, msg: 'Log Added Successfull' }
    }

    return { isSuccess: false, msg: 'Log Already Exists' }
  }

  return { isSuccess: false, msg: 'Not Adding This Payload' }
}

import { Channels } from '../../../shared/channels'
import { NetworkEventType } from '../../../shared/eventType'
import { broadcast } from '../../ipc/broadcast'
import { networkStore } from '../../services/networkStore'
import { formatTime } from '../utlis/time'

export const createNetwork = async (reqData) => {
  const { body, url, method, type } = reqData
  const time = formatTime()

  // console.log('inisideCreateNetwork', reqData)

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

  if (!networkStore.pauseNetwork) {
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
        broadcast(Channels.events.NetworkUpdated, { type: NetworkEventType.NewLog, payload })
        return { isSuccess: true, msg: 'Log Added Successfull' }
      }

      return { isSuccess: false, msg: 'Log Already Exists' }
    }
  } else {
    return { isSuccess: false, msg: 'Networ Is Paused' }
  }

  return { isSuccess: false, msg: 'Not Adding This Payload' }
}

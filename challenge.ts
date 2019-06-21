import * as  AsyncLock from 'async-lock'
let lock = new AsyncLock()


async function sleep(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
    })
}

async function randomDelay() {
    const randomTime = Math.round(Math.random() * 1000)
    return sleep(randomTime)
}

class ShipmentSearchIndex {
    async updateShipment(id: string, shipmentData: any) {
        const startTime = new Date()
        await randomDelay()
        const endTime = new Date()
        console.log(`update ${id}@${
            startTime.toISOString()
            } finished@${
            endTime.toISOString()
            }`
        )

        return { startTime, endTime }
    }
}

// Implementation needed
interface ShipmentUpdateListenerInterface {
    receiveUpdate(id: string, shipmentData: any)
}


class ShipmentUpdateListener extends ShipmentSearchIndex implements ShipmentUpdateListenerInterface {
    receiveUpdate(id: string, shipmentData: any): void {
        lock.acquire(id, async () => {
            await this.updateShipment(id, shipmentData)
        })
    }
}

// test restrictions
let shipment: ShipmentUpdateListenerInterface = new ShipmentUpdateListener()

shipment.receiveUpdate('1', 'shipmentData1')
// console output: update 1@2019-06-21T10:36:44.953Z finished@2019-06-21T10:36:45.665Z
shipment.receiveUpdate('1', 'shipmentData1')
// console output: update 1@2019-06-21T10:36:45.665Z finished@2019-06-21T10:36:46.630Z
shipment.receiveUpdate('1', 'shipmentData1')
// console output: update 1@2019-06-21T10:36:46.630Z finished@2019-06-21T10:36:46.890Z

shipment.receiveUpdate('2', 'shipmentData2')
// console output: update 2@2019-06-21T10:36:44.954Z finished@2019-06-21T10:36:45.238Z
shipment.receiveUpdate('2', 'shipmentData2')
// console output: update 2@2019-06-21T10:36:45.239Z finished@2019-06-21T10:36:45.301Z
shipment.receiveUpdate('2', 'shipmentData2')
// console output: update 2@2019-06-21T10:36:45.301Z finished@2019-06-21T10:36:46.248Z

shipment.receiveUpdate('3', 'shipmentData3')
//  console output: update 3@2019-06-21T10:36:44.954Z finished@2019-06-21T10:36:45.222Z
shipment.receiveUpdate('3', 'shipmentData3')
//  console output: update 3@2019-06-21T10:36:45.225Z finished@2019-06-21T10:36:45.665Z
shipment.receiveUpdate('3', 'shipmentData3')
// console output: update 3@2019-06-21T10:36:45.665Z finished@2019-06-21T10:36:46.509Z
import config from '~/js/config'

const ws = new WebSocket(config.websocketUrl, 'echo-protocol')
const events = []

ws.onopen = ev => {
    
}

ws.addEventListener('message', ev => {
    const res = ev.data.split('|')
    if (res[0] == 201) {
        events.forEach(fn => fn({
            mod: res[1],
            name: res[2],
            data: JSON.parse(res[3])
        }))
    }
})

setInterval(() => {
    ws.send('102|kernel|peerInfo')
}, 1000 * 60)

ws.onclose = ev => {
    
}

export default {
    ws: ws,
    add (fn) {
        events.push(fn)
    }
}
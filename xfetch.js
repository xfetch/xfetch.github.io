onmessage = evt => {
  const port = evt.ports[0]

  fetch(...evt.data).then(res => {
    // the response is not clonable
    // so we make a new plain object
    const obj = {
      bodyUsed: false,
      headers: [...res.headers],
      ok: res.ok,
      redirected: res.redurected,
      status: res.status,
      statusText: res.statusText,
      type: res.type,
      url: res.url
    }

    port.postMessage(obj)

    // Pipe the request to the port (MessageChannel)
    const reader = res.body.getReader()
    const pump = () => reader.read()
    .then(({value, done}) => done
      ? port.postMessage(done)
      : (port.postMessage(value), pump())
    )

    // start the pipe
    pump()
  })
}

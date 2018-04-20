
function startTcp(app, props) {

}

const stopTcp = app => () => {
  app.ref.clear() // Clear plugin state.
  return Promise.resolve()
}
module.exports = {
  startTcp,
  stopTcp,
}

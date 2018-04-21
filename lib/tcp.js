
function startTcp(app, props) {

}

// const stopTcp = app => () => {
//   app.ref.clear() // Clear plugin state.
//   return Promise.resolve()
// }
const stopTcp = () => () => Promise.resolve()

module.exports = {
  startTcp,
  stopTcp,
}

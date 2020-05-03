const { async } = require(`../lib/get-all-files`).default
const { join } = require(`path`)

;(async () => {
  console.log(await async.array(join(__dirname, `../node_modules`)))
})()

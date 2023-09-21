import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js"
const {button, input, label, div, script, pre, p, ul, li, a} = van.tags;

const ForumEL = () => {
  return div({id:'forum'},
  label('Forum')
  )
}

export {
  ForumEL
}
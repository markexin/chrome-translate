function debounce (fn, delay) {
  let timeout
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

function offSet (curEle) {
  let totalLeft = null
  let totalTop = null
  let par = curEle.offsetParent
  // 首先把自己本身的相加
  totalLeft += curEle.offsetLeft
  totalTop += curEle.offsetTop
  // 现在开始一级一级往上查找，只要没有遇到body，我们就把父级参照物的边框和偏移相加
  while (par) {
    if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
      // 不是IE8我们才进行累加父级参照物的边框
      totalTop += par.clientTop
      totalLeft += par.clientLeft
    }
    // 把父级参照物的偏移相加
    totalTop += par.offsetTop
    totalLeft += par.offsetLeft
    par = par.offsetParent
  }
  return { left: totalLeft, top: totalTop }
}

function findExit () {
  const domList = document.getElementsByClassName('gpt-translate')
  if (domList.length >= 1) {
    domList[0].removeChild()
    return true
  }
  return false
}

function appIncon () {
  const focusNode = document.getSelection().focusNode.parentElement
  const body = document.body
  let parentDiv
  if (findExit()) {
    parentDiv = document.getElementsByClassName('gpt-translate')[0]
  } else {
    parentDiv = document.createElement('div')
  }
  parentDiv.setAttribute('class', 'gpt-translate')
  console.log(focusNode)
  const pos = focusNode.getBoundingClientRect()
  const right = Math.ceil(pos.right / window.devicePixelRatio)
  const top = Math.ceil(offSet(focusNode).top) - 30
  parentDiv.setAttribute('style', `position: absolute; left: ${right}px; top: ${top}px; width: 30px; height: 30px; background: black; color: white; text-align: center; line-height: 30px; border-radius: 3px; cursor: pointer;`)
  const p = document.createElement('p')
  p.innerText = '译'
  parentDiv.appendChild(p)
  body.appendChild(parentDiv)
}

document.addEventListener('selectionchange', debounce(appIncon, 1000))

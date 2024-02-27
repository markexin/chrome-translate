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

let right = 0
let top = 0

function appIncon () {
  try {
    const storeTextDom = document.getElementsByClassName('gpt-translate')[0]
    const focusNode = document.getSelection()
    if (!focusNode.toString()) {
      storeTextDom.setAttribute('style', `display: none; position: absolute; left: ${right}px; top: ${top}px; width: 30px; height: 30px; background: black; color: white; text-align: center; line-height: 30px; border-radius: 3px; cursor: pointer;`)
      return
    }
    storeTextDom.firstChild.setAttribute('data-text', focusNode.toString())
    top = offSet(focusNode.focusNode.parentElement).top + 30
    storeTextDom.setAttribute('style', `display: block; position: absolute; left: ${right}px; top: ${top}px; width: 30px; height: 30px; background: black; color: white; text-align: center; line-height: 30px; border-radius: 3px; cursor: pointer;`)
  } catch (error) {
    console.warn('plugins error', error)
  }
}

document.addEventListener('selectionchange', debounce(appIncon, 200))
document.addEventListener('mouseup', function (event) {
  right = event.x
})

window.onload = function () {
  const body = document.body
  const parentDiv = document.createElement('div')
  parentDiv.setAttribute('class', 'gpt-translate')
  parentDiv.setAttribute('style', `display: none; position: absolute; left: ${right}px; top: ${top}px; background: black; color: white; text-align: center; line-height: 30px; border-radius: 3px; cursor: pointer;`)
  const p = document.createElement('p')
  p.innerText = '译'
  p.addEventListener('click', function (e) {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({
      messageType: 'ajax',
      text: e.target.getAttribute('data-text')
    },
    function (res) {
      alert(res)
    })
  })
  parentDiv.appendChild(p)
  body.appendChild(parentDiv)
}

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
  p.setAttribute('style', 'margin: 0;')
  p.addEventListener('click', function (e) {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({
      messageType: 'ajax',
      text: e.target.getAttribute('data-text')
    },
    function (res) {
      document.getElementById('translate-panel').innerHTML = res
      document.getElementById('translate-panel').style.display = 'block'
    })
  })
  parentDiv.appendChild(p)
  body.appendChild(parentDiv)
  // 创建翻译面板
  const translatePanel = document.createElement('div')
  translatePanel.setAttribute('id', 'translate-panel')
  translatePanel.setAttribute('style', `font-size: 18px; text-align: left; padding: 20px; min-width: 300px; min-height: 200px; display:none; position: absolute; right: 0px; top: ${window.scrollY}px; z-index: 9999; background: #000000; color: #ffff;`)
  translatePanel.addEventListener('dblclick', function (e) {
    translatePanel.innerHTML = ''
    translatePanel.style.display = 'none'
    e.stopPropagation()
  })
  // 创建翻译的输入框
  const translateInput = document.createElement('input')
  translateInput.setAttribute('type', 'text')
  translateInput.setAttribute('style', `width: 500px; font-size: 24px; padding: 10px; min-width: 500px; min-height: 100px; display:none; position: absolute; right: 50%; transform: translateX(50%); top: ${window.scrollY + 100}px; z-index: 9999; background: #000000; color: #ffff;`)

  body.appendChild(translatePanel)
  body.appendChild(translateInput)

  // 监听键盘取消事件
  document.addEventListener('keydown', function (event) {
    if (event.keyCode === 27) { // ESC key
      // eslint-disable-next-line no-undef
      translateInput.style.display = 'none'
    }
  })

  // 监听键盘事件
  document.addEventListener('keydown', function (event) {
    // 检查按下的键是 S 键，并且同时按下了 Command 和 Shift 键
    if (event.key === 's' && event.metaKey && event.shiftKey) {
      // 阻止默认行为，以防止浏览器触发保存页面的行为
      event.preventDefault()

      // 在此处执行你想要的操作
      console.log('start input')
      translateInput.style.display = 'block'
      // translateInput.style.cssText = 'display: block !important;'
      translateInput.style.top = `${window.scrollY + 100}px`
      translatePanel.style.top = `${window.scrollY}px`
    }
  }, false)

  // 监听输入框回车事件
  translateInput.addEventListener('keydown', function (e) {
    if (event.key === 'Enter') {
      event.preventDefault()
      translateInput.style.display = 'none'
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({
        messageType: 'ajax',
        text: e.target.value
      },
      function (res) {
        document.getElementById('translate-panel').innerHTML = res
        document.getElementById('translate-panel').style.display = 'block'
      })
    }
  })
}

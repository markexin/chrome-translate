let key

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.messageType === 'ajax') {
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `你是一个专业的翻译，请帮我翻译以下内容：${request.text}` }],
      temperature: 0.7
    }
    fetch('https://api.chatanywhere.tech/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
      // 异步操作完成后，调用 sendResponse 发送响应
        console.log(data)
        sendResponse(data.choices[0].message.content)
      })
      .catch(error => {
        console.error('Fetch error:', error)
        // 在出错时也要发送响应，以免关闭消息端口
        sendResponse({ error: error.message })
      })

    // 必须返回 true，以确保 sendResponse 可以异步发送数据
    return true
  }

  if (request.messageType === 'key') {
    key = request.text
    sendResponse('store key is ok')
  }
})

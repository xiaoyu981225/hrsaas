// 管理自定义指令
export const imageerror = {
  inserted(dom, options) {
    dom.onerror = function() {
      dom.src = options.value
    }
    if (dom.src === '') {
      dom.src = options.value
    }
  }
}

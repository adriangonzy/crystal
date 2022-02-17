// Initialize button with user's preferred color
let changeColor = document.getElementById('changeColor')

chrome.storage.local.get(['color'], (result) => {
  if (result && changeColor) {
    if (!('style' in changeColor)) changeColor.style = {}
    changeColor.style.backgroundColor = result.color
  }
})

// This assumes that you're using Rouge; if not, update the selector
const codeBlocks = Array.from(
  document.querySelectorAll('div.highlighter-rouge'),
)

const clickHandler = (e) => {
  const button = e.target
  const codeBlock = button.parentElement.parentElement.querySelector('code')
  const code = codeBlock.innerText

  window.navigator.clipboard.writeText(code)

  button.classList.add('copied')
  button.innerText = 'Copied!'

  setTimeout(() => {
    button.innerText = buttonText
    button.classList.remove('copied')
  }, 2000)
}

codeBlocks.forEach((codeBlock) => {
  const buttonWrapper = document.createElement('div')
  buttonWrapper.className = 'copy-code-button-wrapper'

  const button = document.createElement('button')
  const buttonText = 'Copy code to clipboard'
  button.innerText = buttonText
  button.className = 'copy-code-button'

  button.addEventListener('click', clickHandler)

  buttonWrapper.appendChild(button)

  codeBlock.appendChild(buttonWrapper)
})

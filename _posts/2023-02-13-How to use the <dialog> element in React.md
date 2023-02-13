---
title: 'How to use the <dialog> element in React'
date: 2023-02-13
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

To render a modal in React I usually use (material ui)[https://mui.com/core] or (react-modal)[https://github.com/reactjs/react-modal]. Today I came across a (nasty bug)[https://github.com/wojtekmaj/react-date-picker/issues/415] that happens to react-date-picker when it is rendered inside a modal created by react-modal. The only solution I found is to remove react-modal. So I took a look at the (native <dialog> element)[https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog] and apparently it works quite well, it is accessible, has a strong browser support and it works as ma modal is supposed to work: it opens on top of the content and prevents any interaction with that content.

<!--more-->

Here is my recipe

```typescript
import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'

const CloseButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
`

const FADE_IN_CLASS = 'in'

const DURATION = 150

const Dialog = styled.dialog`
  border-radius: 10px;
  width: 95%;
  height: 95%;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  background-color: white;
  position: static;
  flex-direction: column;
  border: none;
  display: none;
  padding: 0;

  &&::backdrop {
    background-color: rgba(3, 20, 52, 0.3);
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  &[open],
  &[open]::backdrop {
    display: flex;
    opacity: 0;
    transition: opacity ${DURATION}ms;
  }

  &[open].${FADE_IN_CLASS}, &[open].${FADE_IN_CLASS}::backdrop {
    opacity: 1;
  }
`

const Content = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`

type Props = {
  isOpen: boolean
  onRequestClose: () => void
  closeOnBackdropClick?: boolean
}

const Modal: React.FC<Props> = ({
  isOpen,
  onRequestClose,
  closeOnBackdropClick,
  children,
}) => {
  const dialogRef = useRef<
    // TS, at least my tsc, does not have the right interface for HTMLDialogElement
    HTMLDialogElement & {
      close: () => void
      open: boolean
      showModal: () => void
      show: () => void
    }
  >(null)

  const close = useCallback(() => {
    dialogRef.current?.classList.remove(FADE_IN_CLASS)

    // it is possible to use dialogRef.current.addEventListener('transitionend')
    // to close the modal after the fade out is completed,
    // but I feel safer with a setTimeout that executes only once and I'm sure is triggered
    // always at the right moment
    setTimeout(() => {
      dialogRef.current?.classList.remove(FADE_IN_CLASS)

      if (dialogRef.current?.open) {
        dialogRef.current?.close()
      }
      if (isOpen) {
        onRequestClose()
      }
    }, DURATION)
  }, [isOpen, onRequestClose])

  useEffect(() => {
    if (!dialogRef.current) {
      return
    }

    if (isOpen) {
      // This is a key instruction, to behave like a modal, with the backdrop and all the rest
      // the dialog element must be open with the showModal method
      // the show method opens it more like a notification
      !dialogRef.current.open && dialogRef.current.showModal()
      dialogRef.current.classList.add(FADE_IN_CLASS)
    } else {
      close()
    }
  }, [isOpen, close])

  return (
    <Dialog
      ref={dialogRef}
      onClick={(e) => {
        if (!dialogRef.current || !closeOnBackdropClick) {
          return
        }

        // When the backdrop is clicked the e.target is the dialog element itself
        // to distinguish internal and external click we need and internal element
        // that covers all the modal area
        if (e.target === dialogRef.current) {
          close()
        }
      }}
    >
      <Content>
        <CloseButtonWrapper>
          <button onClick={close}>X</button>
        </CloseButtonWrapper>
        {children}
      </Content>
    </Dialog>
  )
}

export default Modal
```

With a 150 lines of code we have a fully functional modal with a nice fade in/fade out effect and the option to be closed clicking on the backdrop. The `esc` key works out of the box and the focus should be automatically set the first nested focusable elements (I didn't check).

The key points are the one commented in the code:

- to work as a modal the `<dialog>` element must be opened with the `showModal` method, not with the `open` attribute or the `show` method
- to apply a css transition/animation the usual trick to use a 2 step process must be used. In this case one step is the dialog opening, that sets the `open` attribute. The attribute can be used in css with the `[open]` selector to remove the `display: none`. The second step is a class that toggles the opacity.
- since a click on the backdrop is seen as a click on the dialog element itself, to distinguish it there must be an element that covers all the modal area.

Let me know in the comment if you found errors or improvements in the code above.

See you soon.

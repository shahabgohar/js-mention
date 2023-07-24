const messageBox = document.getElementById('message-box')
const mentionBox = document.getElementById('mention-box')
const mentionComplete = document.getElementById('mention-complete')
messageBox.focus()

let preserveSelection = null
let characterAfterMention = null
let debounceForPrevCharacter = null

function userTypesCharacters(event) {
    preserveSelection = window.getSelection()

    if(event.key === ' ' && mentionBox.classList.contains('show')) {
        mentionBox.classList.toggle('show')
    }

    if(event.key === '@' && checkForEmptySpace()) {

        if(!mentionBox.classList.contains('show')) {
            mentionBox.classList.toggle('show')
        }

    }
    
    if(debounceForPrevCharacter) {
        clearTimeout(debounceForPrevCharacter)
    }

    debounceForPrevCharacter = setTimeout(trackCharsAfterMentionSymbol, 100)


}

function checkForEmptySpace() {

    const selection = window.getSelection()
    selection.modify('extend', 'backward', 'character')
    const prevCharacter = selection.toString().charCodeAt(0)
    selection.collapseToEnd()

    return !prevCharacter || prevCharacter === 160

}

function trackCharsAfterMentionSymbol() {
    if(!mentionBox.classList.contains('show')) {
        return
    }

    const selection = window.getSelection()
    selection.modify('extend', 'backward', 'word')
    characterAfterMention = selection.toString()
    selection.collapseToEnd()
}

function mentionCompleteListener(event) {
    if(!preserveSelection) {
        return
    }

    if(characterAfterMention && characterAfterMention.length > 1) {
        preserveSelection.modify('extend', 'backward', 'word')
        if(!preserveSelection.toString()?.startsWith('@')) {
            preserveSelection.modify('extend', 'backward', 'character')
        }
        

    } else {
        preserveSelection.modify('extend', 'backward', 'character');
    }

    preserveSelection.getRangeAt(0).deleteContents()
   
    const node = document.createElement('b')
    node.innerHTML = ' @shahab '
    preserveSelection.getRangeAt(0).insertNode(node)
    node.insertAdjacentHTML('afterend', '<span>&nbsp;</span>')
    preserveSelection.modify('extend', 'forward', 'word')
    preserveSelection.collapseToEnd()

    mentionBox.classList.toggle('show')
}


mentionComplete.addEventListener('click', mentionCompleteListener)
messageBox.addEventListener('keypress', userTypesCharacters)
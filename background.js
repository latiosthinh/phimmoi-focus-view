let fv = false;

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ fv });
	console.log('Default focus view is false', `focusView:${fv}`);
} );

async function focusView() {
	const video = document.querySelector( '.film-view iframe' )
	const head = document.head || document.getElementsByTagName('head')[0]
	const focusClass = '<style id="focus-style">.focusView{ position:fixed;top:0;left:0;z-index:9999999999999 }</style>'

	await chrome.storage.sync.get( 'fv', ( {fv} ) => {
		if ( fv === true ) {
			head.insertAdjacentHTML( 'beforeend', focusClass );
			video.classList.add( 'focusView' )
		} else {
			video.classList.remove( 'focusView' )
			document.getElementById( 'focus-style' ).remove()
		}
	} );
}

chrome.action.onClicked.addListener( tab => {
	chrome.storage.sync.get( 'fv', ( {fv} ) => {
		chrome.storage.sync.set({ fv: !fv });
	} )

	chrome.scripting.executeScript( {
		target: { tabId: tab.id },
		function: focusView
	} )
} )

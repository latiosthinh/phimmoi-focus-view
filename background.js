let fv = false;

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ fv });
	console.log('Default focus view is false', `focusView:${fv}`);
} );

async function focusView() {
	const targets = [ '.film-view iframe', '#player iframe' ]
	const head = document.head || document.getElementsByTagName('head')[0]
	const focusClass = `
		<style id="focus-style">
			.focusView{ position:fixed !important;top:0 !important;left:0 !important;z-index:9999999999999 !important }
			.div-control, #catfish{ display: none !important }
		</style>`

	await chrome.storage.sync.get( 'fv', ( {fv} ) => {
		if ( fv === true ) {
			head.insertAdjacentHTML( 'beforeend', focusClass );
			targets.forEach( t => {
				const el = document.querySelector( t )
				if ( el ) {
					console.log(el)
					el.classList.add( 'focusView' )
				}
			} )
		} else {
			targets.forEach( t => {
				const el = document.querySelector( t )
				if ( el ) {
					el.classList.remove( 'focusView' )
				}
			} )
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

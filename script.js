// Load PrismJS JavaScript
var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/prism.min.js';
var scriptPy = document.createElement('script');
scriptPy.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/components/prism-python.min.js';
var scriptBash = document.createElement('script');
scriptBash.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/components/prism-bash.min.js';
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/themes/prism.min.css'; // URL of the PrismJS stylesheet

var mutationTimeout;

script.onload = function() {

    const mutationDelay = 500; // Delay in milliseconds
	const observer = new MutationObserver(function(mutations) {
	    clearTimeout(mutationTimeout);
	    mutationTimeout = setTimeout(function() {
	        // Disconnect the observer to prevent observing our own changes
	        observer.disconnect();
	        
		    handleMutations(mutations)
	    	// Reconnect the observer after changes
        	observer.observe(document.body, { childList: true, subtree: true });
        }, mutationDelay);
	});
    
    observer.observe(document.body, { childList: true, subtree: true });
    document.body.appendChild(scriptPy);
	document.body.appendChild(scriptBash);
	
	document.addEventListener('keydown', function(event) {
	    if (event.metaKey && event.key === 'l') {
	        event.preventDefault(); // prevent the default action
	        document.getElementById('TextField10').focus();
	    }
	});
	
};

document.body.appendChild(script);
document.head.appendChild(link);

function handleMutations(mutations) {
    mutations.forEach(mutation => {
        // Check for added nodes in each mutation
        mutation.addedNodes.forEach(node => {
		    // First, check if the node is an ELEMENT_NODE
		    if (node.nodeType === Node.ELEMENT_NODE) {

                // Search within newly added nodes for 'pre code' followed by 'p'
		        if (node.querySelectorAll) {
		            let preElements = node.querySelectorAll('pre code');
		            preElements.forEach(preElement => {
		                addCopyButton(preElement);

		                let nextSibling = preElement.parentNode.nextElementSibling; // Assuming 'pre' is the parent of 'code'
		                if (nextSibling && nextSibling.matches('p')) {
		                    // Found a 'p' element right after 'pre code'
		                    // console.log('Found a <p> after <pre><code>');
		                    // console.log(nextSibling)
		                    // console.log('preElement')
		                    // console.log(preElement)
		                    Prism.highlightAll()
		                }
		            });
		        }
		    }
		});

    });
}


function addCopyButton(preElement) {
    // Create a button
    console.log('adding copyButton')

    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-button');
    copyButton.textContent = 'Copy code';

    // Create a wrapper div for the button
    const wrapperDiv = document.createElement('div');
    wrapperDiv.style.textAlign = 'right';
    wrapperDiv.appendChild(copyButton);

    // Insert the wrapper above the pre element
    preElement.parentNode.insertBefore(wrapperDiv, preElement);

    // Add event listener to copy content
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(preElement.textContent)
            .then(() => console.log('Text copied to clipboard'))
            .catch(err => console.error('Failed to copy text: ', err));
    });
    
}


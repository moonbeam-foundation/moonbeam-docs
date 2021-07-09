/** Grab the body so we can append the modal to it */
const main = document.querySelector('main');

/** Create the modal */
const modalContainer = document.createElement('div');
const modal = document.createElement('div');
const modalHeader = document.createElement('h3');
const modalMessage = document.createElement('p');
const closeModal = document.createElement('span'); // maybe needs to be a div

/** Add classes to modal elements so we can find and update as needed */
modalContainer.className = 'error-modal-container';
modalHeader.className = 'error-modal-header';
modal.className = 'error-modal';
modalMessage.className = 'error-message';
closeModal.className = 'close-modal';

/** Set the display to none to hide the modal until it is needed */
modalContainer.style.display = 'none';

/** Set generic header for the error modal */
modalHeader.textContent =
  'There was a problem connecting MetaMask to Moonbase Alpha';

/** Set up close button */
closeModal.innerHTML = '&times;';
closeModal.onclick = () => {
  modalContainer.style.display = 'none';
};

/** Put the modal together and append it to the main area on the page */
modal.appendChild(closeModal);
modal.appendChild(modalHeader);
modal.appendChild(modalMessage);
modalContainer.appendChild(modal);
main.append(modalContainer);

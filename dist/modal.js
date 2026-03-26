var modalIds = ['venuesModal', 'artistsModal', 'charitiesModal'];

function openModal(id) {
  var modal = document.getElementById(id);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal__close').focus();
}

function closeModal(id) {
  var modal = document.getElementById(id);
  modal.hidden = true;
  document.body.style.overflow = '';
}

function openVenuesModal()    { openModal('venuesModal'); }
function closeVenuesModal()   { closeModal('venuesModal'); }
function openArtistsModal()   { openModal('artistsModal'); }
function closeArtistsModal()  { closeModal('artistsModal'); }
function openCharitiesModal() { openModal('charitiesModal'); }
function closeCharitiesModal(){ closeModal('charitiesModal'); }

modalIds.forEach(function(id) {
  document.getElementById(id).addEventListener('click', function(e) {
    if (e.target === this) closeModal(id);
  });
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    modalIds.forEach(function(id) { closeModal(id); });
  }
});

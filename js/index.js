function loadMessages() {
  $.ajax({
    dataType: 'json',
    url: 'messages',
    success: function(result) {
      $('#list').html('');
      $($(result).get().reverse()).each(function(index, message) {
        $('#list').append('<li>'
            + '<strong>' + message.user + '</strong>'
            + ' said <strong>\"' + message.content + '\"</strong>'
            + ' on <strong>' + formatTime(message.time) + '</strong>'
          + '.</li>');
      });
    }
  });
}

function formatTime(timeStr) {
  return moment(timeStr).format('MMMM Do YYYY, hh:mm a');
}

$(document).ready(function() {
  loadMessages();
  setInterval(loadMessages, 1000);

  $('.autoselect').click($(this).select)
});

function fetchRepo() {
  var user = document.getElementById('username').value.trim();
  if (!user) {
    return false;
  }
  $.ajax({
    type: 'GET',
    url: `https://api.github.com/users/${user}/repos`,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    beforeSend: () => {
      document.querySelector('.github-repo-error').classList.add('hide');
      document.querySelector('.github-repo-wrap').innerHTML = '';
      // pending: loader addition
    },
    success: (response) => {
      document.querySelector('.github-repo-wrap').innerHTML = getRepoHtmlString(response, user);
    },
    error: (error) => {
      document.querySelector('.github-repo-error').classList.remove('hide');
    },
    complete: () => {
      // pending: loader removal
    }
  });
  return false;
}

function getRepoHtmlString(response, user) {
  var htmlStr = '';
  response.forEach(function (element) {
    htmlStr += `<div class="col-xs-12 col-xs-offset-0 col-md-8 col-md-offset-2 github-repo no-padding">
        <div class="col-xs-8 col-md-10 text-left">${element.name}</div>
        <button type="button" data-toggle="modal" data-target="#issueModal" class="btn btn-primary col-xs-4 col-md-2 pull-right" onClick="openIssueModal('${user}', '${element.name}')">Add Issue</button>
    </div>`;
  });
  return htmlStr;
}

function openIssueModal(user, repo) {
  document.querySelector('#issueModal .repo-id').innerHTML = repo;
  document.getElementById('issueModal').setAttribute('data-user', user);
  document.getElementById('issueModal').setAttribute('data-repo', repo);
}

function addIssue() {
  var user = document.getElementById('issueModal').getAttribute('data-user');
  var repo = document.getElementById('issueModal').getAttribute('data-repo');
  var title = document.getElementById('issueName').value;
  var description = document.getElementById('issueDescription').value;
  var accessToken = document.getElementById('accessToken').value;
  $.ajax({
    type: 'POST',
    url: `https://api.github.com/repos/${user}/${repo}/issues`,
    data: JSON.stringify({
      title: title,
      body: description
    }),
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', 'token ' + accessToken);
      // pending: loader addition
    },
    success: (response) => {
      document.querySelector('.create-issue-wrapper').classList.add('hide');
      document.querySelector('.modal-success').classList.remove('hide');
      document.querySelector('.issue-id').innerHTML = response.id;
      setTimeout(function() {
        document.querySelector('.create-issue-wrapper').classList.remove('hide');
        document.querySelector('.modal-success').classList.add('hide');
        document.querySelector('.issue-id').innerHTML = '';
        $('#issueModal').modal('hide');
      }, 2000);
    },
    error: (error) => {
      // pending: show error message
    },
    complete: () => {
      // pending: loader removal
    }
  });
}

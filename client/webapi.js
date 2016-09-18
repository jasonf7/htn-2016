export function authenticate(user, callback) {
  fetch("/api/v1/auth", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then(callback)
}

export function getEntries() { //TODO: Pass a location
  return fetch('/api/v1/entries', {
    method: 'GET'
  })
}

export function upload(story, callback) {
  fetch("/api/v1/upload", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(story)
  })
  .then(callback)
}

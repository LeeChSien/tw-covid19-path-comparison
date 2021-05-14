import fetchGoogleTimelineData from './services/fetch-google-timeline-data'
import fetchOpensourcePathData from './services/fetch-opensource-path-data'
import fetchSelfMantainPathData from './services/fetch-self-maintain-path-data'
import compare from './services/compare'

chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.create({ url: chrome.extension.getURL('index.html') })
})

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.event === 'FETCH_TIMELINE') {
    fetchGoogleTimelineData(request.from, request.to)
      .then(data => {
        console.log('Received data', data)
        sendResponse({
          error: null,
          data
        })
      })
      .catch(error => {
        sendResponse({
          error
        })
      })
  }

  if (request.event === 'FETCH_OPENSOURCE_PATH') {
    fetchOpensourcePathData()
      .then(items => {
        console.log('Received data', items)
        sendResponse({
          error: null,
          items
        })
      })
      .catch(error => {
        sendResponse({
          error
        })
      })
  }

  if (request.event === 'FETCH_SELF_MAINTAIN_PATH') {
    fetchSelfMantainPathData()
      .then(items => {
        console.log('Received data', items)
        sendResponse({
          error: null,
          items
        })
      })
      .catch(error => {
        sendResponse({
          error
        })
      })
  }

  if (request.event === 'COMPARE') {
    try {
      const closePoints = compare(request.myHistory, request.pathSetA, request.pathSetB)
      sendResponse({
        error: null,
        closePoints
      })
    } catch (error) {
      sendResponse({
        error
      })
    }
  }

  // return true to indicate we wish to send a response asynchronously
  return true
})

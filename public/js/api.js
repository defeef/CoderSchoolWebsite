const endpoint = '/api'

const request = async (url, body, method) => {
    const response = await fetch(endpoint + url, {
        method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if (response.status == 401) {
        location.href = '/login'
    }
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.indexOf('application/json') !== -1) {
        const json = await response.json()
        return  { status: response.status, msg: json.msg, json }
    } else {
        const msg = await response.text()
        return { status: response.status, msg }
    }
}

const api_register = (first, last, email, username, password) => {
    return request('/register', { first, last, email, username, password }, 'POST')
}

const api_login = (username, password) => {
    return request('/login', { username, password }, 'POST')
}
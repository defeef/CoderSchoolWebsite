async function login(event) {
    event.preventDefault()
    const data = event.target.elements

    const username = data.username.value
    const password = data.password.value

    let response = await api_login(username, password)
    
    if (response.status != 201) {
        alert(response.msg)
        return
    }

    location.href = "/home"
}

async function register(event) {
    event.preventDefault()
    const data = event.target.elements

    const first = data.first.value
    const last = data.last.value
    const email = data.email.value
    const username = data.username.value
    const password = data.password.value
    const confirm = data.confirm.value

    let response = await api_register(first, last, email, username, password, confirm)
    
    if (response.status != 201) {
        alert(response.msg)
        return
    }

    location.href = "/home"
}
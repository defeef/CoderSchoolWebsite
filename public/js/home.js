function create_post(post, user) {
    return (`
        <div>
            <h3>${user.first} ${user.last} ${user.username}</h3>
            <p>${post.content}</p>
        </div>
    `)
}

async function load() {

    var users = {}
    var response = await api_get_posts();
    if (response.status != 200) {
        alert(response.msg)
        return
    }

    var posts = response.json
    
    console.log(posts.length)

    for (var post of posts) {
        if (usrs[post.user_id] !== undefined) continue

        var user_response = await api_get_user(post.user_id)
        if (user_response.status != 200) {
            alert(user_response.msg)
            return
        }
        var user = user_response.json
        users[post.user_id] = user
    }

    var block = document.getElementById('posts')
    for (var post of posts) {
        block.appendChild(
            create_post(post, users[post.user_id]).html()
        )
    }
}
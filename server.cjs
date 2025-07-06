const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')

const PORT = 3000
const DATA_PATH = path.join(__dirname,'public/data','posts.json')

function readPosts(){
    return new Promise((resolve, reject) => {
        fs.readFile(DATA_PATH, 'utf-8',(err, data) => {
            if(err) return reject(err)
            resolve(JSON.parse(data))
        })
    })
}

function writePosts(posts){
    return new Promise((resolve, reject) => {
        fs.writeFile(DATA_PATH, JSON.stringify(posts, null, 2), err => {
            if(err) return reject(err)
            resolve()
        })
    })
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url,`http://${req.headers.host}`)

    //Habilita CORS
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if(req.method === 'OPTIONS'){
        res.writeHead(204)
        res.end()
        return
    }

    // GET /api/posts
    if(req.method === 'GET' && url.pathname === '/api/posts'){
        try{
            const posts = await readPosts()
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(posts))
        }
        catch(err){  const id = parseInt(url.pathname.split('/').pop())
            res.writeHead(500)
            res.end(JSON.stringify({error: 'Erro ao ler os posts'}))
        }
        return
    }

    // POST /api/posts
    if(req.method === 'POST' && url.pathname === '/api/posts'){
        let body = ''
        req.on('data', chunk => (body += chunk))
        req.on('end', async () => {
            try{
                const newPost = JSON.parse(body)
                const posts = await readPosts()
                newPost.id = Date.now()
                posts.push(newPost)
                await writePosts(posts)

                res.writeHead(201, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(newPost))
            }
            catch(err){
                res.writeHead(500)
                res.end(JSON.stringify({error:'Erro ao salvar o post'}))
            }
        })
        return
    }

    // PATCH /api/posts/:id
    if(req.method === 'PATCH' && url.pathname.startsWith('/api/posts/')){
        const id = parseInt(url.pathname.split('/').pop())
        if(isNaN(id)){
            res.writeHead(400)
            res.end(JSON.stringify({error: 'ID inválido'}))
            return
        }

        let body = ''
        req.on('data', chunk => {
            body += chunk.toString()
        })

        req.on('end', async () => {
            try{
                //Conteúdo a ser atualizado
                const updateData = JSON.parse(body)

                //Carrega os posts
                const posts = await readPosts()

                //Localiza a postagem que será atualizada
                const postIndex = posts.findIndex(p => p.id === id)
                if(postIndex === -1){
                    res.writeHead(404)
                    res.end(JSON.stringify)
                }

                //Atualizando os campos enviados
                posts[postIndex] = {...posts[postIndex], ...updateData}

                //Salvando as alterações
                await writePosts(posts)

                //Respondendo ao cliente
                res.writeHead(200, { 'Content-Type': 'application/json'})
                res.end(JSON.stringify(posts[postIndex]))
            }
            catch(err){
                console.error(err)
                res.writeHead(500)
                res.end(JSON.stringify({error: 'Erro interno no servidor'}))
            }
        })

        return //garante que as demais rotas não sejam processadas
    }

    // DELETE /api/posts/:id
    if(req.method === 'DELETE' && url.pathname.startsWith('/api/posts/')){
        const id = parseInt(url.pathname.split('/').pop())
        try{
            let posts = await readPosts()
            posts = posts.filter(post => post.id !== id)
            await writePosts(posts)
            res.writeHead(204)
            res.end()
        }
        catch(err){
            res.writeHead(500)
            res.end(JSON.stringify({error: 'Erro ao deletar o post'}))
        }
        return
    }

    res.writeHead(404)
    res.end('Not found')
})

server.listen(PORT, () =>{
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})

import React from 'react'

export const Tes = () => {
  
    const getPosts = async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await res.json()
      return data
    }
  
    return (
    <div>
        {getPosts().then((data) => {
          return (
            <div>
              {data.map((post: any) => {
                return (
                  <ul key={post.id}>
                    <li key={post.id}>{post.title}</li>
                    <li key={post.id}>{post.userId}</li>
                  </ul>
                )
              })}
            </div>
          )
        })}
    </div>
  )
}
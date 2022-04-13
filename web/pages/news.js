/* This example requires Tailwind CSS v2.0+ */
import { useEffect, useState } from 'react'
import fetchStrapi from '../lib/fetchStrapi'

export default function News() {
  let [articles, setArticles] = useState([])

  // function getNews() {
  //   let responsejSON;
  //   var articles = []

  //   var url = "https://tranquil-lowlands-80935.herokuapp.com/api/articles";

  //   var xhr = new XMLHttpRequest();
  //   xhr.open("GET", url);


  //   xhr.onreadystatechange = function () {
  //     if (xhr.readyState === 4) {
  //       // console.log(xhr.status);
  //       responsejSON = JSON.parse(xhr.responseText);
  //       // console.log(responsejSON);
  //       // console.log("Length is - ", responsejSON.data.length)
  //       for (var i = responsejSON.data.length - 1; i >= 0; i--) {
  //         let individualArticles = new articleObj();
  //         individualArticles.article.author.name = responsejSON.data[i].attributes.Author;
  //         individualArticles.article.title = responsejSON.data[i].attributes.Title;
  //         individualArticles.article.description = responsejSON.data[i].attributes.Subtitle;
  //         individualArticles.article.date = responsejSON.data[i].attributes.Date;
  //         individualArticles.article.href = document.location.origin + "/article/" + responsejSON.data[i].id;
  //         // console.log("This is article - ",article)
  //         articles.push(individualArticles.article);
  //         // console.log("This is Article Arr - ", articles);
  //       }
  //       // posts = articles;
  //       console.log("Posts - ", articles);
  //       setPosts(articles);
  //       return articles;
  //     }
  //   };

  //   xhr.send();

  // }

  useEffect(async () => {

    let articles = await fetchStrapi(`articles`)
    console.log(articles.data)
    setArticles(articles.data);

  }, [])

  return (
    <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3" />
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Latest news about Patchwork-Kingdoms</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {/* Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa libero labore natus atque, ducimus sed. */}
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
          {articles && articles.map((post) => (
            <div key={post.attributes.Title} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <a href={"/article/" + post.id} className="block mt-2">
                <div className="flex-shrink-0">
                  <img className="h-48 w-full object-cover" src={post.attributes.imageUrl} alt="" />
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    {/* <p className="text-sm font-medium text-indigo-600">
                        <a href={post.category.href} className="hover:underline">
                          {post.category.name}
                        </a>
                      </p> */}
                    {/* <a href={post.href} className="block mt-2"> */}
                    <p className="text-xl font-semibold text-gray-900">{post.attributes.Title}</p>
                    <p className="mt-3 text-base text-gray-500">{post.attributes.Excerpt}</p>
                    {/* </a> */}
                  </div>
                  <div className="mt-6 flex items-center">
                    {/* <div className="flex-shrink-0">
                        <a href={post.author.href}>
                          <span className="sr-only">{post.author.name}</span>
                          <img className="h-10 w-10 rounded-full" src={post.author.imageUrl} alt="" />
                        </a>
                      </div> */}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {/* <a href={post.author.href} className="hover:underline"> */}
                        {post.attributes.Author}
                        {/* </a> */}
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={post.attributes.Date}>{post.attributes.Date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
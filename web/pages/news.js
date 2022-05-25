/* This example requires Tailwind CSS v2.0+ */
import { useEffect, useState } from 'react'
import fetchStrapi from '../lib/fetchStrapi'

export default function News() {
  let [articles, setArticles] = useState([])

  useEffect(async () => {

    let articles = await fetchStrapi(`articles`, 'date')
    console.log(articles)
    setArticles(articles.data);

  }, [])

  return (
    <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3" />
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Latest news</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            All updates and news around the Kingdoms.
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
          {articles && articles.map((post) => (
            <div key={post.attributes.Title} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <a href={"/article/" + post.id} className="block mt-2">
                <div className="flex-shrink-0">
                  <img className="h-48 w-full object-cover" src={post.attributes.FeaturedImage.data.attributes.formats.medium.url} alt="" />
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-xl font-semibold text-gray-900">{post.attributes.Title}</p>
                    <p className="mt-3 text-base text-gray-500">{post.attributes.Excerpt}</p>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="ml-0">
                      <p className="text-sm font-medium text-gray-900">
                        {post.attributes.Author}
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
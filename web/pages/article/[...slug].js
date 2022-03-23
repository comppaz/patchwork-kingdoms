import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import fetchStrapi from '../../lib/fetchStrapi'
import ReactMarkdown from 'react-markdown'

const Article = () => {
  const router = useRouter()
  const [article, setArticle] = useState({})


  useEffect(async () => {
    if (router.query.slug) {
      const articleId = router.query.slug[0]
      let article = await fetchStrapi(`articles/${articleId}`)
      setArticle(article.data.attributes)
    }
  }, [router.query.slug])


  return (
    <div className="relative py-16 bg-white overflow-hidden">
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="text-lg max-w-prose mx-auto">
          <h1>
            <span className="block text-base text-center text-teal-600 font-semibold tracking-wide uppercase">
              {article.Subtitle}
            </span>
            <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {article.Title}
            </span>
          </h1>
          <p className="mt-8 text-xl text-center text-gray-500 leading-8">
            <p className="text-sm font-medium text-gray-900">

              {article.Author}

            </p>
            <div className=" text-sm text-gray-500">
              <time dateTime={article.Date}>{article.Date}</time>
              <span aria-hidden="true">&middot;</span>
            </div>
          </p>
        </div>
        <div className="mt-6 prose prose-teal prose-lg text-gray-500 mx-auto">
          <ReactMarkdown children={article.Content} />
        </div>
      </div>
    </div>
  )
}

export default Article
import { FetchError } from "./fetchJson";
export default async function fetchStrapi(resource, sortBy='') {

    let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${resource}`;

    if(sortBy === 'date'){
        url += '?sort[0]=Date%3Adesc&populate=*';
    }else{
        url += '?populate=*';
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = await response.json();

    // response.ok is true when res.status is 2xx
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
    if (response.ok) {
        return data;
    }

    throw new FetchError({
        message: response.statusText,
        response,
        data,
    });
}
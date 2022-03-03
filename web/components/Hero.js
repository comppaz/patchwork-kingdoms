/* This example requires Tailwind CSS v2.0+ */
import Image from 'next/image'
import Slider from "react-slick";

export default function Hero() {

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };


  return (
    <>
      <div className="relative overflow-hidden">

        <div className="relative pt-6">

          <main className="mt-8 mx-auto max-w-7xl px-4 sm:mt-12">
            <div className="text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Patchwork Kingdoms</span>
                <p className="text-left text-lg font-normal text-gray-600 tracking-wider pt-8 pb-4 lg:tracking-wide">
                  Let's build a community of supporters for the Giga initiative and raise funds to bring reliable, robust connectivity to schools across the globe.
                </p>
              </h1>
            </div>
          </main>
          <div className="w-screen mt-8">
            <Slider {...settings}>
              <div>
                <Image
                  src="/images/butter_mints.png"
                  alt="Picture of the author"
                  layout="responsive"
                  width={512}
                  height={512}
                />
              </div>
              <div>
                <Image
                  src="/images/chaos.png"
                  alt="Picture of the author"
                  layout="responsive"
                  width={512}
                  height={512}
                />
              </div>
              <div>
                <Image
                  src="/images/cotton_candy.png"
                  alt="Picture of the author"
                  layout="responsive"
                  width={512}
                  height={512}
                />
              </div>
              <div>
                <Image
                  src="/images/dollhouse.png"
                  alt="Picture of the author"
                  layout="responsive"
                  width={512}
                  height={512}
                />
              </div>
              <div>
                <Image
                  src="/images/dragons.png"
                  alt="Picture of the author"
                  layout="responsive"
                  width={512}
                  height={512}
                />
              </div>
              <div>
                <Image
                  src="/images/fruit_loops.png"
                  alt="Picture of the author"
                  layout="responsive"
                  width={512}
                  height={512}
                />
              </div>
            </Slider>
          </div>
        </div>
        {/* <Banner></Banner> */}
        {/* <div className="text-center pb-2 mt-8">
          <h3 className="text-xl font-bold tracking-tight"><span className="text-teal-600">Public mint</span> is over! Checkout the collection on <a href="https://opensea.io/collection/patchworkkingdoms" target="_blank" className="underline text-teal-600">Opensea</a>.</h3>
        </div> */}
        <div class="flex justify-center mt-12" >
          <div>
            <a href="https://discord.gg/vS9QguncHu" target="_blank">
              <button class="bg-teal-600 hover:bg-teal-600 text-white font-bold py-2 px-5 mr-2 rounded center uppercase">
                Join Discord
              </button>
            </a>
            <a href="https://opensea.io/collection/patchworkkingdoms" target="_blank">
              <button class="bg-teal-600 hover:bg-teal-600 text-white font-bold py-2 px-4 ml-2 rounded center uppercase">
                Join kingdom
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
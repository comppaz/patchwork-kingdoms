import '../styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Head from 'next/head';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import { SWRConfig } from 'swr';
import { fetchJson } from '../lib/fetchData';
import { ModalProvider } from '../context/ModalContext';
import { AddressProvider } from '../context/AddressContext';

function getLibrary(provider) {
    return new Web3(provider);
}

function MyApp({ Component, pageProps }) {
    return (
        <SWRConfig
            value={{
                fetcher: fetchJson,
                onError: err => {
                    console.error(err);
                },
            }}>
            <Web3ReactProvider getLibrary={getLibrary}>
                <AddressProvider>
                    <ModalProvider>
                        <Head>
                            <title>
                                Patchwork Kingdoms | Raise funds to bring connectivity to schools across the globe | Giga x Snowcrash
                            </title>
                            <meta name="viewport" content="initial-scale=1.0, width=device-width" />

                            <meta property="og:title" content="Patchwork Kingdoms | Giga x Snowcrash" />
                            <meta
                                property="og:site_name"
                                content="Raise funds to bring reliable and robust connectivity to schools across the globe."
                            />
                            <meta property="og:url" content="https://patchwork-kingdom.vercel.app/" />
                            <meta
                                property="og:description"
                                content="Let's build a community of supporters for the Giga initiative and raise funds to bring reliable, robust connectivity to schools across the globe."
                            />
                            <meta property="og:type" content="website" />
                            <meta property="og:image" content="/images/chaos.png" />

                            <meta name="twitter:card" content="summary" />
                            <meta name="twitter:site" content="@Gigaconnect" />
                            <meta name="twitter:title" content="Patchwork Kingdoms | Giga x Snowcrash" />
                            <meta
                                name="twitter:description"
                                content="Let's build a community of supporters for the Giga initiative and raise funds to bring reliable, robust connectivity to schools across the globe."
                            />
                            <meta name="twitter:image" content="https://www.patchwork-kingdoms.com/images/cotton_candy.png"></meta>

                            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                            <link rel="manifest" href="/site.webmanifest" />
                            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                            <meta name="msapplication-TileColor" content="#da532c" />
                            <meta name="theme-color" content="#ffffff"></meta>

                            <link
                                rel="stylesheet"
                                type="text/css"
                                href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css"
                            />
                        </Head>
                        <Navbar />
                        <Component {...pageProps} />
                        <Footer />
                    </ModalProvider>
                </AddressProvider>
            </Web3ReactProvider>
        </SWRConfig>
    );
}

export default MyApp;

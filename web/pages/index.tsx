import Hero from '../components/Hero';
import JoinCTA from '../components/JoinCTA';
import Faq from '../components/Faq';
import About from '../components/About';
import Team from '../components/Team';
import LogoCloud from '../components/LogoCloud';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col py-2">
            <Hero></Hero>
            <JoinCTA></JoinCTA>
            <LogoCloud></LogoCloud>
            <About></About>
            <p className=" text-center text-xl text-gray-500">
                Check out our{' '}
                <span className=" cursor-pointer text-md text-gray-500 hover:text-gray-700 underline">
                    <Link href="/faq">
                        <a target="_blank">FAQ</a>
                    </Link>
                </span>{' '}
                or contact us for more information.
            </p>
            <Team></Team>
        </div>
    );
}

import Hero from '../components/Hero'
import JoinCTA from '../components/JoinCTA'
import Faq from '../components/Faq'
import About from '../components/About'
import Team from '../components/Team'
import LogoCloud from '../components/LogoCloud'

export default function Home() {

  return (

    <div className="flex flex-col py-2">
      <Hero></Hero>
      <JoinCTA></JoinCTA>
      <LogoCloud></LogoCloud>
      <About></About>
      <Faq></Faq>
      <Team></Team>
    </div>

  )
}
